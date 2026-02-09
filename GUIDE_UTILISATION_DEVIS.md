# Guide d'Utilisation des Devis

## 📁 Fichiers Disponibles

Vous disposez maintenant de **3 versions du devis** :

### 1. DEVIS_APPLICATION_KPI.md (Version Complète)
- **Format :** Markdown
- **Pages :** 20+ pages
- **Usage :** Documentation complète, archivage
- **Contenu :** Tous les détails techniques, juridiques, conditions

### 2. DEVIS_SIMPLIFIE.md (Version 2 Pages)
- **Format :** Markdown
- **Pages :** 2 pages
- **Usage :** Présentation rapide client
- **Contenu :** Essentiel (prix, planning, livrables)

### 3. DEVIS_EXCEL.csv (Calculs Automatiques)
- **Format :** CSV (ouvrable dans Excel/LibreOffice)
- **Pages :** 1 feuille avec formules
- **Usage :** Calculs et personnalisation prix
- **Contenu :** Tous les postes avec formules automatiques

---

## 🔧 Comment Utiliser le Devis Excel

### Étape 1 : Ouvrir le Fichier

**Dans Excel :**
```
1. Ouvrir Microsoft Excel
2. Fichier → Ouvrir
3. Sélectionner DEVIS_EXCEL.csv
4. Choisir "Délimiteur : Point-virgule (;)"
5. ✅ Le fichier s'ouvre avec colonnes bien séparées
```

**Dans LibreOffice Calc :**
```
1. Ouvrir LibreOffice Calc
2. Fichier → Ouvrir
3. Sélectionner DEVIS_EXCEL.csv
4. Dans la fenêtre d'import :
   - Séparateur : Cocher "Point-virgule"
   - Cliquer OK
5. ✅ Le fichier s'ouvre
```

**Dans Google Sheets :**
```
1. Aller sur Google Sheets
2. Fichier → Importer
3. Upload DEVIS_EXCEL.csv
4. Séparateur : Point-virgule
5. ✅ Feuille créée
```

---

### Étape 2 : Configurer Votre Tarif

**Cellule Magique : B6**

```
┌─────────────────────────────┐
│ CONFIGURATION TARIF         │
├─────────────────────────────┤
│ Tarif Journalier (TJM) │450│  ← MODIFIEZ ICI
│ TVA                    │ 20│  ← Modifiable aussi
└─────────────────────────────┘
```

**Modifiez la cellule B6** avec votre tarif :
- 300 (Junior)
- 450 (Intermédiaire)
- 600 (Senior)
- Ou tout autre montant

**✨ TOUS les calculs se mettent à jour automatiquement !**

---

### Étape 3 : Voir les Résultats

**Section RÉCAPITULATIF FINANCIER** (lignes 105-115)

Les montants se calculent automatiquement :

```
TOTAL PHASE 1 + 2    : XX jours  │  X XXX€ HT  │  X XXX€ TTC
TOTAL COMPLET (1+2+3): XX jours  │  X XXX€ HT  │  X XXX€ TTC
```

**Section PAIEMENT ÉCHELONNÉ** (lignes 118-123)

Calculs automatiques 30/30/40 :

```
Acompte         : 30%  │  X XXX€ HT  │  X XXX€ TTC
Intermédiaire   : 30%  │  X XXX€ HT  │  X XXX€ TTC
Solde           : 40%  │  X XXX€ HT  │  X XXX€ TTC
```

**Section ROI** (lignes 126-138)

ROI calculé automatiquement :

```
TOTAL GAINS ANNUELS    : 45 300€
TOTAL INVESTISSEMENT   : X XXX€
ROI                    : XXX%
Amortissement          : XX jours
```

---

### Étape 4 : Personnaliser (Optionnel)

**Activer/Désactiver des options :**

1. **Phase 3 Optionnelle** (lignes 88-94)
   - Par défaut : Incluse dans calculs
   - Pour exclure : Supprimez les lignes ou mettez 0 jours

2. **Build macOS** (ligne 71)
   - Colonne C (Jours) : 1 = inclus, 0 = exclu

3. **Services complémentaires** (lignes 98-101)
   - Modifiez colonne C (Quantité)
   - Exemple : Certificat = 1, Support = 3 (mois)

**Exemple :**
```
SC.1  Certificat code signing    1    200€   = 200€
SC.2  Support maintenance        3    100€   = 300€
SC.3  Formation utilisateurs     2    150€   = 300€
```

---

### Étape 5 : Exporter pour Client

**Option A : PDF depuis Excel**
```
1. Fichier → Exporter en PDF
2. Sélectionner zone d'impression
3. Enregistrer sous : DEVIS-CLIENT-[NOM].pdf
```

**Option B : Copier dans Word**
```
1. Sélectionner tableau récapitulatif
2. Copier (Ctrl+C)
3. Coller dans Word
4. Ajouter en-tête, logo, conditions
5. Exporter en PDF
```

**Option C : Imprimer**
```
1. Masquer colonnes avec formules (si besoin)
2. Fichier → Mise en page
3. Ajuster à 1 page de large
4. Imprimer ou PDF
```

---

## 📄 Comment Utiliser le Devis Simplifié

### Conversion en Word/PDF

**Avec Pandoc :**
```bash
cd /Users/tiengd/Documents/tuto/kpi

# Convertir en Word
pandoc DEVIS_SIMPLIFIE.md -o DEVIS_SIMPLIFIE.docx

# Convertir en PDF
pandoc DEVIS_SIMPLIFIE.md -o DEVIS_SIMPLIFIE.pdf
```

**Avec un éditeur Markdown :**
- Typora (Mac/Windows) : Ouvrir → Exporter PDF
- VS Code + extension : Markdown PDF

---

### Remplir les Champs

**Champs à compléter** (marqués `[xxx]`) :

```
[Votre Société]     → Remplacer par votre nom
[Adresse]           → Votre adresse
[SIRET]             → Votre SIRET
[Email]             → Votre email
[Tél]               → Votre téléphone

[Société Client]    → Nom du client
[Nom]               → Contact client
etc.

[Prix P1]€          → Prix Phase 1 (de l'Excel)
[Prix P2]€          → Prix Phase 2
[Total]€            → Total calculé
```

**Méthode rapide :**
1. Ouvrir dans Word
2. Ctrl+H (Rechercher/Remplacer)
3. Chercher : `[Votre Société]`
4. Remplacer par : `Votre vraie société`
5. Tout remplacer

---

## 🎨 Personnalisation Visuelle

### Dans Word (Devis Simplifié)

**Ajouter logo :**
```
1. Insertion → Image
2. Placer en haut à gauche
3. Taille : 3-4 cm de large
```

**Couleurs corporate :**
```
1. Sélectionner titres (## = H2)
2. Appliquer couleur entreprise
3. Format → Styles → Enregistrer style
```

**Mise en page :**
```
1. Marges : 2 cm partout
2. Police : Arial ou Calibri 10-11pt
3. En-tête : Logo + coordonnées
4. Pied de page : Numéro page
```

---

### Dans Excel

**Mise en forme conditionnelle :**
```
1. Sélectionner totaux (colonne E)
2. Mise en forme conditionnelle
3. Barres de données → Choisir couleur
```

**Protection des formules :**
```
1. Sélectionner cellules à protéger
2. Format → Protéger la cellule
3. Révision → Protéger la feuille
4. Laisser déverrouillé : B6, B7, Colonne C
```

**Zones d'impression :**
```
1. Mise en page → Zone d'impression
2. Sélectionner uniquement récapitulatif
3. Fichier → Imprimer → Aperçu
```

---

## 💡 Scénarios d'Utilisation

### Scénario 1 : Client Demande Prix Rapide

**Utilisez : DEVIS_SIMPLIFIE.md**

1. Ouvrir Excel → Définir TJM → Noter total
2. Ouvrir DEVIS_SIMPLIFIE.md
3. Remplir `[Total]€` avec montant Excel
4. Convertir en PDF
5. Envoyer au client

**Temps : 5 minutes**

---

### Scénario 2 : Négociation Détaillée

**Utilisez : DEVIS_EXCEL.csv**

1. Ouvrir dans Excel
2. Ajuster TJM selon négociation
3. Activer/désactiver options
4. Montrer tableau récapitulatif au client
5. Valider ensemble

**Temps : 15 minutes**
**Avantage : Calculs en temps réel**

---

### Scénario 3 : Appel d'Offres Formel

**Utilisez : DEVIS_APPLICATION_KPI.md**

1. Convertir en Word
2. Compléter TOUS les champs
3. Ajouter logo, mise en page
4. Exporter PDF final signé
5. Joindre annexes (CGV, RIB)

**Temps : 1-2 heures**
**Avantage : Professionnel complet**

---

## 🔄 Workflows Recommandés

### Workflow A : Du Plus Simple au Plus Complet

```
1. Email initial client
   ↓
2. Envoyer DEVIS_SIMPLIFIE (2 pages)
   ↓ Client intéressé ?
3. Réunion avec DEVIS_EXCEL (ajustements)
   ↓ Client valide ?
4. Envoyer DEVIS_COMPLET officiel (signature)
```

---

### Workflow B : Direct Professionnel

```
1. Demande client
   ↓
2. DEVIS_EXCEL (calculer prix)
   ↓
3. DEVIS_COMPLET (personnalisé)
   ↓
4. Envoi PDF signé
```

---

## 📊 Tableaux de Tarification

### Selon Profil Prestataire

| Profil | TJM | Phase 1+2 (HT) | Avec Phase 3 (HT) |
|--------|-----|----------------|-------------------|
| **Freelance Junior** | 300€ | 6 900€ | 8 400€ |
| **Freelance Confirmé** | 450€ | 10 350€ | 12 600€ |
| **Freelance Senior** | 600€ | 13 800€ | 16 800€ |
| **Agence** | 800€ | 18 400€ | 22 400€ |

### Selon Géographie

| Région | TJM Moyen | Phase 1+2 (HT) |
|--------|-----------|----------------|
| **Province** | 350€ | 8 050€ |
| **Paris** | 550€ | 12 650€ |
| **Suisse** | 900€ | 20 700€ |

---

## ✅ Checklist Avant Envoi

### Devis Simplifié

- [ ] Remplacer tous les `[xxx]` par vraies valeurs
- [ ] Vérifier montants (HT, TVA, TTC)
- [ ] Vérifier dates (émission, validité)
- [ ] Numéro de devis unique
- [ ] Coordonnées bancaires (RIB)
- [ ] Logo ajouté
- [ ] Relu (orthographe, cohérence)
- [ ] Converti en PDF
- [ ] Testé ouverture PDF

### Devis Excel

- [ ] TJM configuré (cellule B6)
- [ ] TVA correcte (20% en France)
- [ ] Options activées/désactivées selon besoin
- [ ] Formules non cassées (vérifier totaux)
- [ ] Mise en forme appliquée
- [ ] Zone d'impression définie
- [ ] Testé export PDF

### Devis Complet

- [ ] Toutes sections complétées
- [ ] Informations juridiques (SIRET, etc.)
- [ ] Conditions générales relues
- [ ] Annexes jointes (RIB, CGV)
- [ ] Numérotation pages
- [ ] Table des matières (si > 10 pages)
- [ ] Signature prévue

---

## 🎯 Conseils Professionnels

### Tarification

✅ **À faire :**
- Aligner TJM sur expérience réelle
- Inclure marge pour imprévus (10-20%)
- Proposer 2-3 options (MVP, Standard, Premium)
- Transparence sur décomposition

❌ **À éviter :**
- Sous-évaluer (difficile à augmenter après)
- Prix au hasard (calculer réellement)
- Comparaison directe concurrent (valeur unique)

### Communication

✅ **À faire :**
- Expliquer valeur (pas juste prix)
- Mettre en avant ROI (15 000% !)
- Délais réalistes avec buffer
- Disponible pour questions

❌ **À éviter :**
- Envoyer devis sans contexte
- Pression commerciale
- Promesses irréalistes
- Manque de suivi

### Négociation

✅ **Stratégies gagnantes :**
- Jouer sur scope (ajouter/retirer fonctionnalités)
- Proposer paiement échelonné (flexibilité)
- Bonus si paiement rapide (-2% si 7 jours)
- Package maintenance (récurrent)

❌ **À éviter :**
- Baisser TJM (dévalue expertise)
- Accepter conditions défavorables
- Dire oui à tout
- Négliger contrat écrit

---

## 📞 Support

**Questions sur l'utilisation des devis :**

- Excel ne calcule pas ? → Vérifier formules (cellule B6)
- PDF mal formaté ? → Ajuster mise en page avant export
- Conversion markdown ? → Installer Pandoc
- Personnalisation avancée ? → Me contacter

---

**Bon succès avec vos devis !** 🚀

*Guide créé le 14 janvier 2024*
