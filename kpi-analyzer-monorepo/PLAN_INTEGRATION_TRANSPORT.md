# 📋 Plan d'Implémentation - Intégration Données Transport

Basé sur l'analyse du fichier `ANALYSE_KPI_TRANSPORT_IMPORT.md`, voici le plan technique pour intégrer ces données riches dans le KPI Analyzer.

---

## 🏗 Phase 1 : Backend & Modélisation (Python)

L'objectif est de structurer la base de données pour stocker les 25 colonnes brutes sans perte d'information, tout en permettant des requêtes rapides pour le dashboard.

### 1.1 Modélisation de Données (`models.py`)
- **Nouvelle Table `transport_entries`** :
    - Création d'un modèle SQLAlchemy dédié reflétant exactement la structure du CSV.
    - Champs clés : `kpi_transport_id` (PK), `num_bordereau`, `date_recepisse`, `donneur_ordre`, `pays_depart`, `pays_arrivee`, etc.
    - Champs calculés stockés : `marge_brute`, `duree_traitement`, `duree_transport`.
- **Index SQL** (pour garantir les performances sur 110k+ lignes) :
    - `date_recepisse` : requêtes temporelles et agrégations mensuelles
    - `num_bordereau` : déduplication et recherche rapide
    - `donneur_ordre` : agrégations clients (Top 10, CA par client)
    - `pays_depart`, `pays_arrivee` : analyses géographiques et routes
    - `source_file_id` : jointures avec `raw_imports`
- **Stratégie de Stockage** :
    - Conserver les données brutes dans `transport_entries`.
    - (Optionnel) Projeter les agrégats financiers mensuels vers la table existante `unified_kpi` pour la compatibilité avec le dashboard générique actuel.

### 1.2 Moteur d'Ingestion (`ingestion.py`)
- **Nouveau Parser `TransportCSVParser`** :
    - **Nettoyage** :
        - Suppression du BOM UTF-8 en début de fichier
        - Conversion des séparateurs (`;`)
        - Typage des nombres (virgule → point pour les décimaux)
        - **Normalisation des noms de colonnes** : suppression des accents, espaces → underscores, passage en minuscules (ex: `Date de récépissé` → `date_de_recepisse`)
    - **Déduplication** : Implémentation de la logique d'agrégation par `Num. de bordereau` pour éviter le double comptage des montants (CA, Poids) si plusieurs lignes (UM) existent pour un même bordereau.
    - **Calculs à la volée** : Calcul des marges et délais lors de l'insert.

### 1.3 API Endpoints (`endpoints.py`)
- **Mise à jour `/api/upload`** :
    - Détection automatique du format (si colonnes "Bordereau" et "Incoterm" présentes -> format Transport).
    - Dispatch vers le bon parser.
- **Nouveaux Endpoints Analytiques** :
    - `GET /api/transport/stats` : KPIs globaux (CA, Marge, Tonnage).
    - `GET /api/transport/graph/revenue` : Données pour le graph combiné CA/Marge.
    - `GET /api/transport/graph/geo` : Données pour la carte/répartition pays.
- **Mise à jour `/api/reset`** :
    - Ajouter la suppression de la table `transport_entries` pour la réinitialisation complète.

---

## 🎨 Phase 2 : Frontend & Visualisation (React)

Adapter l'interface pour exploiter la richesse des nouvelles données.

### 2.1 Adaptation Import
- Mise à jour de la page **"Mes Données"** pour afficher le type de fichier détecté ("Standard" vs "Transport").
- Affichage du nombre de bordereaux traités vs lignes ignorées (doublons).

### 2.2 Nouveaux Composants Graphiques (`KPIChart.tsx`)
- **ComposedChart** : Support pour afficher des Barres (CA) et une Ligne (Marge) sur le même graphique avec double axe Y.
- **BarChart Horizontal** : Pour le "Top 10 Clients" ou "Routes".
- **Heatmap (Optionnel)** : Pour la matrice Pays Départ / Pays Arrivée.

### 2.3 Dashboard Spécifique ("Vue Transport")
- Création d'un **Template de Dashboard** pré-configuré qui se charge quand des données Transport sont détectées.
- **Détection automatique** :
    - Appel à `GET /api/transport/stats` au chargement du Dashboard
    - Si `count > 0` → afficher la Vue Transport
    - Sinon → afficher la vue générique existante
    - Bouton de bascule manuel entre les deux vues si les deux types de données coexistent
- **Layout** :
    - **Haut** : Bandeau KPIs (CA Total, Marge %, Tonnage, Nb Envois).
    - **Centre** : Graphique Principal (Évolution Mensuelle CA vs Marge).
    - **Bas** : 
        - Gauche : Top Clients (Barres).
        - Droite : Répartition Géographique (Pie ou Liste).

---

## 🧪 Phase 3 : Validation & Performance

### 3.1 Tests de Cohérence
- Vérifier que la somme du CA correspond au total du fichier Excel source.
- Valider que la déduplication fonctionne (le CA ne doit pas être multiplié par le nombre d'UM).

### 3.2 Performance
- Le fichier contient ~110k lignes.
- Vérifier que l'import prend < 10 secondes.
- Vérifier que l'affichage du dashboard est instantané (< 1s) grâce aux index SQL appropriés.

---

## 📅 Planning Estimatif

| Tâche | Durée Est. |
|-------|------------|
| **1.1 Modèle DB** | 0.5 jour |
| **1.2 Ingestion & Déduplication** | 1 jour |
| **1.3 API Endpoints** | 0.5 jour |
| **2.1 & 2.2 UI & Graphs** | 1 jour |
| **2.3 Dashboard Template** | 0.5 jour |
| **Tests & Ajustements** | 0.5 jour |
| **TOTAL** | **4 jours** |
