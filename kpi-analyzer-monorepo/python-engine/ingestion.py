import pandas as pd
import io
from datetime import datetime
from sqlalchemy.orm import Session
from database.models import TransportEntry, RawImport

def clean_float(val):
    """Convertit une string avec virgule en float, gère les erreurs."""
    if pd.isna(val) or val == '':
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    try:
        # Remplacer virgule par point, supprimer espaces insécables
        cleaned = str(val).replace(',', '.').replace('\xa0', '').strip()
        return float(cleaned)
    except:
        return 0.0

def parse_date(val):
    """Tente de parser une date (format DD/MM/YYYY attendu)."""
    if pd.isna(val) or val == '':
        return None
    try:
        return pd.to_datetime(val, dayfirst=True)
    except:
        return None

def process_transport_file(content: bytes, filename: str, db: Session, raw_import: RawImport):
    """
    Traite un fichier CSV Transport :
    1. Nettoyage (BOM, séparateurs)
    2. Parsing Pandas
    3. Normalisation
    4. Déduplication (Agrégation par Bordereau)
    5. Insertion en base
    """
    try:
        # 1. Lecture du contenu (gestion encodage et BOM)
        content_str = content.decode('utf-8-sig') # 'utf-8-sig' gère le BOM automatiquement
        
        # 2. Parsing Pandas (Séparateur point-virgule)
        # On lit tout en string d'abord pour éviter les problèmes de conversion auto
        df = pd.read_csv(io.StringIO(content_str), sep=';', dtype=str)
        
        # Normalisation des colonnes : minuscules, strip, sans accents, suppression char invisibles
        # \ufeff est souvent collé au début
        df.columns = df.columns.str.lower().str.strip().str.replace('\ufeff', '').str.replace('é', 'e').str.replace('è', 'e').str.replace("'", "")
        
        print(f"DEBUG COLUMNS: {list(df.columns)}")
        if len(df) > 0:
            print(f"DEBUG ROW 0: {df.iloc[0].to_dict()}")

        entries = []
        
        # 3. Déduplication / Agrégation par Bordereau
        # Le fichier contient 1 ligne par UM (Unité de Manutention), mais les montants (CA, Poids) 
        # sont répétés sur chaque ligne du même bordereau.
        # Il faut donc grouper par "num de bordereau" (ou recepisse) pour ne pas multiplier le CA.
        
        # Colonnes clés pour le groupement (pour garder les infos uniques)
        # On groupe par le numéro de bordereau (colonne 9 -> 'num. de bordereau')
        # Mais on veut garder les autres infos (dates, pays, etc.) qui sont censées être identiques pour un même bordereau
        
        # Mapping des colonnes du CSV vers notre modèle
        # Basé sur l'analyse :
        # date de recepisse -> date_recepisse
        # date dexploitation -> date_exploitation
        # rec. -> num_recepisse
        # num. de bordereau -> num_bordereau
        # donneur dordre -> donneur_ordre
        # montant net ht -> montant_net_ht (MAX ou FIRST)
        # nombre dum -> nombre_um (SUM)
        # poids -> poids_kg (SUM -- ATTENTION: D'pres l'analyse, le poids est aussi répété ? A verifier.
        #    Dans le doute, l'analyse dit "Doublons apparents". 
        #    Si j'ai 3 palettes pour 1 envoi, est-ce que 'Poids' est le poids total ou le poids de la palette ?
        #    L'analyse suggère : "Agréger par bordereau... MAX(Montant Net HT)... SUM(Poids)?"
        #    Wait, si le CA est répété, le Poids l'est peut-être aussi ?
        #    Regardons l'analyse : "Lignes en apparence identiques (probablement 1 ligne par UM)"
        #    Si c'est "identique", alors le poids est aussi répété (c'est le poids total du lot).
        #    Hypothèse Sûre : On prend le MAX pour les montants financiers (CA, Coûts) et le MAX pour le Poids Total annoncé,
        #    SAUF si "Nombre d'UM" est 1 par ligne.
        #    L'analyse recommande :
        #    SUM("Nombre d'UM") AS total_um
        #    SUM("Poids") AS total_poids  <-- L'analyse dit SUM. C'est risqué si c'est dupliqué.
        #    MAIS l'analyse dit aussi "MAX("Montant Net HT")".
        #    Re-lecture : "Lignes identiques multiples". Si elles sont *identiques*, alors SUM(Poids) va multiplier le poids !
        #    Correction: Utilisons MAX pour Poids aussi si les lignes sont identiques.
        #    Si les lignes décrivent des colis différents (ex: Colis 1: 10kg, Colis 2: 20kg), alors SUM est bon.
        #    Si les lignes sont des copies conformes (ex: Ligne 1: Total 30kg, Ligne 2: Total 30kg), alors MAX est bon.
        #    DECISION: Le contexte "Doublons apparents" suggère MAX pour tout ce qui semble être un total "Envoi".
        #    Cependant, pour "Nombre d'UM", si chaque ligne est une UM, alors COUNT(*) ou SUM(1) est mieux.
        
        # Pour simplifier et suivre la reco "MAX" du CA, on va grouper par 'num_bordereau'
        # et prendre le PREMIER enregistrement pour toutes les infos descriptives,
        # et recalculer les montants si nécessaire.
        
        if 'num. de bordereau' not in df.columns:
             # Fallback si colonne pas trouvée, traitement ligne à ligne classique
             # Mais on va essayer de mapper proprement
             pass
        
        # Pour éviter une déduplication trop agressive, on utilise une clé composite : 
        # Bordereau + Récépissé + Montant HT (pour différencier des envois similaires mais distincts)
        group_cols = ['num. de bordereau', 'recepisse', 'montant net ht']
        
        # Vérification de l'existence des colonnes
        missing_cols = [col for col in group_cols if col not in df.columns]
        if missing_cols:
             print(f"⚠️ Colonnes pour déduplication manquantes : {missing_cols}. Fallback sur 'num. de bordereau' uniquement.")
             group_cols = ['num. de bordereau'] if 'num. de bordereau' in df.columns else []

        # On itère sur les groupes
        grouped = df.groupby(group_cols) if group_cols else df.iterrows()

        # Si groupement, 'grouped' est un (name, group_df)
        is_grouped = isinstance(grouped, pd.core.groupby.DataFrameGroupBy) 
        
        count_inserted = 0
        items_to_create = []

        for key, group in (grouped if is_grouped else df.iterrows()):
            # Si is_grouped, 'group' est un DataFrame des lignes du bordereau
            # Si !is_grouped, 'group' est une Series (ligne)
            
            row = group.iloc[0] if is_grouped else group # On prend la première ligne du groupe comme référence
            
            # Calculs
            # Pour le financier, on prend la valeur de la première ligne (car dupliqué)
            ca = clean_float(row.get('montant net ht', 0))
            achat_st = clean_float(row.get('montant achat sous-traitance', 0))
            achat_st_ext = clean_float(row.get('montant achat st sans cout interne', 0))
            cout_int = clean_float(row.get('cout interne', 0))
            
            # Pour le poids/UM
            # Si c'est groupé, est-ce qu'on somme les UM ?
            # Si "Nombre d'UM" est 1 partout, SUM = nbre de lignes.
            # Si "Nombre d'UM" est le total (ex: 3), MAX = 3.
            # On va suivre la logique : Poids & UM sont des attributs de l'Envoi (Bordereau), donc dupliqués.
            poids = clean_float(row.get('poids', 0))
            nb_um = clean_float(row.get('nombre dum', 0))
            
            # Marges
            cout_total = achat_st + cout_int
            marge = ca - cout_total
            taux = (marge / ca * 100) if ca != 0 else 0.0
            
            entry = TransportEntry(
                source_file_id=raw_import.id,
                
                # IDs
                num_bordereau=str(row.get('num. de bordereau', '')),
                num_recepisse=str(row.get('recepisse', '')),
                bordereau_edi=str(row.get('bordereau arrivee edi', '')),
                
                # Dates
                date_recepisse=parse_date(row.get('date de recepisse')),
                date_exploitation=parse_date(row.get('date dexploitation')),
                date_arrivage=parse_date(row.get('bordereau arrivage date')),
                date_depart=parse_date(row.get('date de depart')),
                
                # Tiers
                donneur_ordre=str(row.get('nom du donneur dordre', '')),
                type_donneur_ordre=str(row.get('type donneur dordre', '')),
                correspondant=str(row.get('nom du correspondant', '')),
                
                # Geo
                pays_depart=str(row.get('expediteur pays', '')),
                pays_arrivee=str(row.get('pays destinataire', '')),
                pays_remettant=str(row.get('pays du remettant', '')),
                code_ligne_depart=str(row.get('ligne depart code', '')),
                code_ligne_arrivee=str(row.get('code ligne arrivee', '')),
                
                # Produit
                libelle_produit=str(row.get('libelle produit vendu', '')),
                type_ligne_depart=str(row.get('ligne depart type', '')),
                incoterm=str(row.get('incoterm', '')),
                
                # Métriques
                nombre_um=nb_um,
                poids_kg=poids,
                montant_net_ht=ca,
                montant_achat_st=achat_st,
                montant_achat_st_hors_interne=achat_st_ext,
                cout_interne=cout_int,
                
                # Calculés
                marge_brute=marge,
                taux_marge=taux
            )
            items_to_create.append(entry)
            
            if len(items_to_create) >= 1000:
                db.bulk_save_objects(items_to_create)
                db.commit()
                items_to_create = []
        
        # Fin : sauvegarder le reste
        if items_to_create:
            db.bulk_save_objects(items_to_create)
            db.commit()
            
        print(f"✅ Import Transport terminé : {len(items_to_create) + count_inserted} entrées créées (Déduplication active)")
        
    except Exception as e:
        print(f"❌ Erreur parsing Transport: {str(e)}")
        raise e
