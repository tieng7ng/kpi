# Propositions d'Intégration - Fichier Transport Import

**Fichier source** : extract_377_71_260114_1428 - 2025 ROUTE IMPORT.csv
**Date** : 2026-01-15
**Version** : 1.0
**Objectif** : Intégrer ce fichier CSV complexe dans l'application KPI Analyzer

---

## 📋 Table des Matières

1. [Analyse du Problème](#analyse-du-problème)
2. [Proposition 1 : Import Direct Simple](#proposition-1--import-direct-simple)
3. [Proposition 2 : Mapping Assisté](#proposition-2--mapping-assisté)
4. [Proposition 3 : Import avec Transformation](#proposition-3--import-avec-transformation)
5. [Proposition 4 : Import Avancé Multi-KPIs](#proposition-4--import-avancé-multi-kpis)
6. [Proposition 5 : Import avec Règles Métier](#proposition-5--import-avec-règles-métier)
7. [Comparaison des Propositions](#comparaison-des-propositions)
8. [Recommandation](#recommandation)
9. [Plan d'Implémentation](#plan-dimplémentation)

---

## 🔍 Analyse du Problème

### Spécificités du Fichier

**Complexités identifiées** :

1. ✅ **Format** : CSV avec séparateur `;` (non standard)
2. ✅ **Encodage** : UTF-8 avec BOM (﻿)
3. ✅ **Volume** : 109 542 lignes
4. ✅ **Colonnes** : 25 colonnes dont 3 contiennent des KPIs numériques
5. ✅ **Doublons** : Lignes multiples pour le même bordereau
6. ✅ **Dates** : 3 colonnes de dates différentes
7. ✅ **Valeurs numériques** : Virgule comme séparateur décimal
8. ✅ **Champs vides** : Certaines colonnes ont des valeurs manquantes

### Problématiques à Résoudre

| Problème | Impact | Solution Requise |
|----------|--------|------------------|
| BOM UTF-8 | Erreur parsing colonnes | Détecter et retirer BOM |
| Séparateur `;` | Pandas ne le détecte pas auto | Forcer séparateur |
| Virgules décimales | Valeurs non reconnues comme numériques | Remplacer `,` par `.` |
| Doublons | KPIs multipliés (faux totaux) | Agrégation par bordereau |
| 25 colonnes | Trop de KPIs dans le dashboard | Sélection intelligente |
| Noms de colonnes longs | Interface encombrée | Alias/renommage |

---

## 📊 Proposition 1 : Import Direct Simple

### Concept

**Approche** : Importer le fichier "tel quel" sans transformation, laisser l'ETL actuel gérer.

### Workflow

```
1. Utilisateur uploade le CSV
2. Backend détecte automatiquement :
   - Séparateur (essaie ;)
   - Encodage (UTF-8)
   - Colonnes numériques
3. Crée 1 KPI par colonne numérique
4. Utilise la première colonne date trouvée
```

### Modifications Backend Requises

**python-engine/api/endpoints.py**

```python
# Ligne 53 - Améliorer la détection CSV
if file.filename.endswith('.csv'):
    content_str = content.decode('utf-8-sig')  # Retire BOM automatiquement

    # Essayer différents séparateurs
    for sep in [';', ',', '\t', '|']:
        try:
            df = pd.read_csv(
                io.StringIO(content_str),
                sep=sep,
                decimal=',',  # NOUVEAU : Support virgule décimale
                thousands=' ',  # NOUVEAU : Support espace comme milliers
                encoding='utf-8'
            )
            if len(df.columns) > 1:
                break
        except:
            continue
```

### Avantages

✅ **Simplicité** : Aucune interface supplémentaire
✅ **Rapide** : Pas de dev frontend
✅ **Universel** : Fonctionne avec tout CSV

### Inconvénients

❌ **Doublons** : Ne gère pas l'agrégation
❌ **Colonnes inutiles** : Importe tout
❌ **Pas de contrôle** : Utilisateur ne choisit pas les KPIs
❌ **Noms de colonnes** : Garde les noms longs (ex: "Montant achat sous-traitance sans coût interne")

### Résultat Attendu

**KPIs créés** (automatiquement) :
- Date de récépissé (utilisée comme date)
- Récépissé (texte → ignoré)
- Nombre d'UM (KPI)
- Poids (KPI)
- Montant Net HT (KPI)
- Montant achat sous-traitance (KPI)
- Montant achat sous-traitance sans coût interne (KPI)
- Coût interne (KPI)

**Total** : 6 KPIs créés × 109K lignes = **654K entrées en base** ⚠️

### Wireframe

```
┌────────────────────────────────────────┐
│ 📥 Importer des Données                │
├────────────────────────────────────────┤
│ [Parcourir] ou Glisser-déposer         │
│                                        │
│ ✅ extract_377_71_260114_1428.csv      │
│ • 109,542 lignes                       │
│ • 6 KPIs détectés                      │
│ • 654,252 entrées créées               │
│                                        │
│ ⚠️ Attention: Doublons détectés        │
│                                        │
│ [Importer quand même]                  │
└────────────────────────────────────────┘
```

---

## 📊 Proposition 2 : Mapping Assisté

### Concept

**Approche** : Après upload, afficher un assistant permettant de mapper les colonnes et choisir les KPIs.

### Workflow

```
1. Upload du fichier
2. Backend analyse le fichier
3. Frontend affiche un modal de mapping :
   ├─ Sélectionner la colonne DATE
   ├─ Sélectionner les colonnes KPIs
   ├─ Renommer les KPIs
   └─ Choisir la stratégie de doublons
4. Backend traite selon les choix
5. Import final
```

### Interface Utilisateur

**Modal de Mapping (après upload)**

```
┌─────────────────────────────────────────────────────────┐
│  📋 Configuration de l'Import                       [✕] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Fichier : extract_377_71_260114_1428.csv               │
│  109,542 lignes • 25 colonnes • 2.3 MB                  │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                          │
│  📅 Colonne Date (obligatoire)                          │
│  [Date de récépissé ▼]                                  │
│                                                          │
│  Autres colonnes date disponibles :                     │
│  ☐ Date d'exploitation                                  │
│  ☐ Date de départ (création du bordereau)              │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                          │
│  📊 Sélection des KPIs (6 colonnes numériques trouvées) │
│  ┌────────────────────────────────────────────────┐    │
│  │ ☑ Nombre d'UM                   → [Nombre UM]  │    │
│  │ ☑ Poids                         → [Poids (kg)] │    │
│  │ ☑ Montant Net HT                → [CA HT]      │    │
│  │ ☑ Montant achat sous-traitance → [Coût ST]    │    │
│  │ ☐ Montant achat ST sans CI      → [...]        │    │
│  │ ☑ Coût interne                  → [Coût Int]  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  4 KPIs sélectionnés                                    │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                          │
│  🔧 Options Avancées                               [▼]  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Gestion des doublons :                         │    │
│  │ ⚫ Garder toutes les lignes (aucune agrégation) │    │
│  │ ⚪ Agréger par Num. de bordereau (recommandé)   │    │
│  │                                                 │    │
│  │ Colonne catégorie (optionnel) :                │    │
│  │ [Nom du Donneur d'ordre ▼]                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                          │
│  👁️ Aperçu (5 premières lignes après transformation)   │
│  ┌────────────────────────────────────────────────┐    │
│  │ date       │ CA HT   │ Coût ST │ Poids │ UM    │    │
│  ├────────────┼─────────┼─────────┼───────┼───────┤    │
│  │ 07/08/2024 │ 86.94   │ 109.15  │ 568   │ 2     │    │
│  │ 02/12/2024 │ 464.99  │ 366.56  │ 1200  │ 9     │    │
│  │ 13/12/2024 │ 39.73   │ 83.90   │ 127   │ 3     │    │
│  └────────────┴─────────┴─────────┴───────┴───────┘    │
│                                                          │
│  ℹ️ 437,168 entrées seront créées (4 KPIs × 109K lignes)│
│                                                          │
│  [Annuler]                    [Importer 🚀]             │
└─────────────────────────────────────────────────────────┘
```

### Modifications Backend Requises

**Nouveau endpoint : POST /api/analyze-file**

```python
@router.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    """Analyse un fichier et retourne sa structure"""
    content = await file.read()

    # Détecter séparateur
    content_str = content.decode('utf-8-sig')
    for sep in [';', ',', '\t', '|']:
        try:
            df = pd.read_csv(io.StringIO(content_str), sep=sep, nrows=100)
            if len(df.columns) > 1:
                break
        except:
            continue

    # Analyser les colonnes
    columns_info = []
    for col in df.columns:
        col_type = "text"
        sample_values = df[col].dropna().head(3).tolist()

        # Détecter type
        if pd.api.types.is_numeric_dtype(df[col]):
            col_type = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            col_type = "date"
        else:
            # Essayer de parser en date
            try:
                pd.to_datetime(df[col].dropna().head(10))
                col_type = "date"
            except:
                pass

        columns_info.append({
            "name": col,
            "type": col_type,
            "samples": sample_values,
            "null_count": df[col].isnull().sum()
        })

    return {
        "filename": file.filename,
        "total_rows": len(df),
        "columns": columns_info,
        "separator": sep,
        "preview": df.head(5).to_dict('records')
    }
```

**Modifier POST /api/upload pour accepter config**

```python
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    config: str = Form(None),  # JSON config du mapping
    db: Session = Depends(get_db)
):
    # Si config fournie, l'utiliser
    if config:
        import json
        mapping = json.loads(config)
        date_column = mapping.get('date_column')
        selected_kpis = mapping.get('kpis', [])
        category_column = mapping.get('category_column')
        aggregate_by = mapping.get('aggregate_by')
    else:
        # Comportement par défaut (auto)
        date_column = None
        selected_kpis = None
        category_column = None
        aggregate_by = None

    # ... reste du code avec utilisation de la config
```

### Composant Frontend

**components/DataImport/MappingModal.tsx**

```typescript
interface ColumnInfo {
  name: string;
  type: 'text' | 'numeric' | 'date';
  samples: any[];
  null_count: number;
}

interface MappingConfig {
  date_column: string;
  kpis: Array<{ column: string; alias: string }>;
  category_column?: string;
  aggregate_by?: string;
}

export const MappingModal: React.FC<{
  fileAnalysis: FileAnalysis;
  onConfirm: (config: MappingConfig) => void;
  onCancel: () => void;
}> = ({ fileAnalysis, onConfirm, onCancel }) => {
  const [dateColumn, setDateColumn] = useState<string>('');
  const [selectedKPIs, setSelectedKPIs] = useState<Map<string, string>>(new Map());
  const [categoryColumn, setCategoryColumn] = useState<string>('');
  const [aggregateBy, setAggregateBy] = useState<string>('none');

  const dateColumns = fileAnalysis.columns.filter(c => c.type === 'date');
  const numericColumns = fileAnalysis.columns.filter(c => c.type === 'numeric');

  const handleConfirm = () => {
    const config: MappingConfig = {
      date_column: dateColumn,
      kpis: Array.from(selectedKPIs.entries()).map(([col, alias]) => ({
        column: col,
        alias
      })),
      category_column: categoryColumn || undefined,
      aggregate_by: aggregateBy !== 'none' ? aggregateBy : undefined
    };
    onConfirm(config);
  };

  return (
    <div className="modal">
      {/* Interface comme dans le wireframe */}
    </div>
  );
};
```

### Avantages

✅ **Contrôle utilisateur** : Choisit exactement quoi importer
✅ **Renommage** : Noms de KPIs courts et clairs
✅ **Aperçu** : Voit le résultat avant import
✅ **Flexibilité** : Options avancées disponibles

### Inconvénients

❌ **Complexité** : Plus de dev (frontend + backend)
❌ **UX** : Étape supplémentaire pour l'utilisateur
❌ **Maintenance** : Plus de code à maintenir

### Timeline d'Implémentation

- **Sprint 1** : Endpoint `/analyze-file` + modal basique
- **Sprint 2** : Options avancées + aperçu
- **Sprint 3** : Polish + tests

---

## 📊 Proposition 3 : Import avec Transformation

### Concept

**Approche** : Créer automatiquement des **KPIs calculés** en plus des colonnes brutes.

### Exemple de Transformation

**Données brutes** :
- Montant Net HT : 86.94 €
- Montant achat sous-traitance : 109.15 €
- Coût interne : 0.00 €

**KPIs calculés automatiquement** :
- **Marge Brute** = 86.94 - 109.15 - 0.00 = **-22.21 €** ⚠️
- **Taux de Marge** = (-22.21 / 86.94) × 100 = **-25.55%** ⚠️
- **Coût Total** = 109.15 + 0.00 = **109.15 €**

### Configuration des Transformations

**Modal avec règles de calcul**

```
┌─────────────────────────────────────────────────────────┐
│  🧮 KPIs Calculés (optionnel)                       [✕] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ☑ Créer des KPIs calculés automatiquement             │
│                                                          │
│  📊 Règles de Calcul Prédéfinies                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ ☑ Marge Brute                                  │    │
│  │   = CA HT - Coût ST - Coût Interne             │    │
│  │                                                 │    │
│  │ ☑ Taux de Marge (%)                            │    │
│  │   = (Marge Brute / CA HT) × 100                │    │
│  │                                                 │    │
│  │ ☑ Coût Total                                   │    │
│  │   = Coût ST + Coût Interne                     │    │
│  │                                                 │    │
│  │ ☑ Poids par UM                                 │    │
│  │   = Poids / Nombre UM                          │    │
│  │                                                 │    │
│  │ ☑ CA par UM                                    │    │
│  │   = CA HT / Nombre UM                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  + Ajouter une règle personnalisée                      │
│                                                          │
│  5 KPIs calculés seront créés                           │
│                                                          │
│  [Précédent]                    [Continuer]             │
└─────────────────────────────────────────────────────────┘
```

### Backend - Calculs

```python
def create_calculated_kpis(df, config):
    """Crée des KPIs calculés selon la config"""
    calculated = []

    # Marge Brute
    if 'marge_brute' in config.get('calculated_kpis', []):
        df['Marge Brute'] = (
            df['Montant Net HT']
            - df['Montant achat sous-traitance']
            - df['Coût interne']
        )
        calculated.append('Marge Brute')

    # Taux de Marge
    if 'taux_marge' in config.get('calculated_kpis', []):
        df['Taux de Marge %'] = (
            (df['Marge Brute'] / df['Montant Net HT']) * 100
        ).fillna(0)
        calculated.append('Taux de Marge %')

    # Coût Total
    if 'cout_total' in config.get('calculated_kpis', []):
        df['Coût Total'] = (
            df['Montant achat sous-traitance'] + df['Coût interne']
        )
        calculated.append('Coût Total')

    return df, calculated
```

### Avantages

✅ **KPIs métier** : Indicateurs directement exploitables
✅ **Gain de temps** : Pas besoin de calculs manuels
✅ **Cohérence** : Formules standardisées
✅ **Richesse** : Plus d'analyses possibles

### Inconvénients

❌ **Complexité technique** : Logique de calcul à maintenir
❌ **Erreurs possibles** : Division par zéro, valeurs nulles
❌ **Performance** : Calculs sur 109K lignes
❌ **Flexibilité** : Formules figées

---

## 📊 Proposition 4 : Import Avancé Multi-KPIs

### Concept

**Approche** : Au lieu de créer une ligne par (date, KPI), créer **une seule ligne par date** avec **tous les KPIs en colonnes**.

### Comparaison Structure

**Actuel (normalisé)** :
```
date       | kpi_name  | value | category
-----------|-----------|-------|----------
07/08/2024 | CA HT     | 86.94 | BIANCHI
07/08/2024 | Coût ST   | 109.15| BIANCHI
07/08/2024 | Poids     | 568   | BIANCHI
07/08/2024 | UM        | 2     | BIANCHI
```
**4 lignes** par envoi

**Proposé (dénormalisé)** :
```
date       | ca_ht | cout_st | poids | um | category
-----------|-------|---------|-------|----|---------
07/08/2024 | 86.94 | 109.15  | 568   | 2  | BIANCHI
```
**1 ligne** par envoi

### Avantages

✅ **Performance** : 4× moins de lignes en base
✅ **Requêtes** : Plus simple (1 SELECT au lieu de JOIN)
✅ **Agrégations** : Faciles (SUM par ligne)
✅ **Export** : Format naturel pour Excel

### Inconvénients

❌ **Schéma rigide** : Colonnes fixes
❌ **Évolutivité** : Ajouter un KPI = ALTER TABLE
❌ **Incompatibilité** : Change le modèle de données actuel
❌ **Graphiques** : Recharts attend format normalisé

### Modification BDD Requise

**Nouvelle table `unified_kpis_wide`**

```sql
CREATE TABLE unified_kpis_wide (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    category VARCHAR(100),
    source_file_id INTEGER NOT NULL,

    -- KPIs financiers
    ca_ht DECIMAL(15,2),
    cout_st DECIMAL(15,2),
    cout_interne DECIMAL(15,2),
    marge_brute DECIMAL(15,2),
    taux_marge DECIMAL(5,2),

    -- KPIs opérationnels
    nombre_um INTEGER,
    poids DECIMAL(10,2),

    -- Dimensions
    donneur_ordre VARCHAR(255),
    pays_origine VARCHAR(2),
    pays_destination VARCHAR(2),
    type_service VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_file_id) REFERENCES raw_imports(id)
);
```

### Non Recommandé pour MVP

❌ Change trop l'architecture existante
❌ Nécessite refonte complète
❌ Complexifie le code graphiques

---

## 📊 Proposition 5 : Import avec Règles Métier

### Concept

**Approche** : Définir des **profils d'import** réutilisables pour différents types de fichiers.

### Profils Prédéfinis

**1. Profil "Transport Import"**

```json
{
  "name": "Transport Import",
  "description": "Fichiers de facturation transport",
  "file_pattern": "extract_*_ROUTE_IMPORT.csv",
  "separator": ";",
  "decimal": ",",
  "encoding": "utf-8-sig",
  "date_column": "Date de récépissé",
  "category_column": "Nom du Donneur d'ordre",
  "kpis": [
    {
      "column": "Montant Net HT",
      "alias": "CA HT",
      "type": "currency"
    },
    {
      "column": "Montant achat sous-traitance",
      "alias": "Coût Sous-Traitance",
      "type": "currency"
    },
    {
      "column": "Coût interne",
      "alias": "Coût Interne",
      "type": "currency"
    },
    {
      "column": "Nombre d'UM",
      "alias": "Unités Manutention",
      "type": "integer"
    },
    {
      "column": "Poids",
      "alias": "Poids (kg)",
      "type": "decimal"
    }
  ],
  "calculated_kpis": [
    {
      "name": "Marge Brute",
      "formula": "{CA HT} - {Coût Sous-Traitance} - {Coût Interne}",
      "type": "currency"
    },
    {
      "name": "Taux de Marge %",
      "formula": "({Marge Brute} / {CA HT}) * 100",
      "type": "percentage"
    }
  ],
  "aggregation": {
    "by": "Num. de bordereau",
    "method": "sum"
  },
  "filters": {
    "remove_rows_where": [
      {"column": "Montant Net HT", "condition": "is_null"}
    ]
  }
}
```

**2. Profil "Ventes Simples"** (autre exemple)

```json
{
  "name": "Ventes Simples",
  "description": "Export comptabilité ventes",
  "separator": ",",
  "date_column": "date",
  "kpis": [
    {"column": "revenue", "alias": "Chiffre Affaires"},
    {"column": "quantity", "alias": "Quantité"}
  ]
}
```

### Interface - Sélection Profil

```
┌─────────────────────────────────────────────────────────┐
│  📋 Choisir un Profil d'Import                      [✕] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Fichier détecté : extract_377_71_260114_1428.csv       │
│                                                          │
│  ✅ Profil recommandé : Transport Import                │
│  Correspondance : 95% (nom, séparateur, colonnes)       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📦 Transport Import (Recommandé)               │    │
│  │ • Séparateur: ;                                │    │
│  │ • 5 KPIs + 2 KPIs calculés                     │    │
│  │ • Agrégation par bordereau                     │    │
│  │                                                 │    │
│  │ [Utiliser ce profil]                           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Autres profils disponibles :                           │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📊 Ventes Simples                              │    │
│  │ • Séparateur: ,                                │    │
│  │ • Correspondance: 12%                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  [Import manuel (sans profil)]  [Créer nouveau profil]  │
└─────────────────────────────────────────────────────────┘
```

### Stockage des Profils

**Base de données - Table `import_profiles`**

```sql
CREATE TABLE import_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    config JSON NOT NULL,  -- Le JSON complet du profil
    is_system BOOLEAN DEFAULT 0,  -- Profil système ou utilisateur
    created_by INTEGER,  -- NULL pour système
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP
);
```

**Fichier - JSON dans /profiles/**

```
python-engine/
└── profiles/
    ├── transport-import.json
    ├── ventes-simples.json
    └── custom-user-1.json
```

### Matching Automatique

**Algorithme de détection**

```python
def match_profile(file_analysis, profiles):
    """Trouve le profil le plus adapté"""
    scores = []

    for profile in profiles:
        score = 0

        # Check filename pattern
        if profile.get('file_pattern'):
            import re
            if re.match(profile['file_pattern'], file_analysis.filename):
                score += 30

        # Check separator
        if profile['separator'] == file_analysis.separator:
            score += 20

        # Check columns présence
        profile_columns = [kpi['column'] for kpi in profile['kpis']]
        file_columns = [c['name'] for c in file_analysis.columns]

        matching_cols = len(set(profile_columns) & set(file_columns))
        score += (matching_cols / len(profile_columns)) * 50

        scores.append({
            'profile': profile,
            'score': score,
            'percentage': int(score)
        })

    # Trier par score
    scores.sort(key=lambda x: x['score'], reverse=True)
    return scores
```

### Avantages

✅ **Réutilisabilité** : Import en 1 clic pour fichiers récurrents
✅ **Standardisation** : Toujours les mêmes KPIs
✅ **Gain de temps** : Pas de configuration répétitive
✅ **Partage** : Profils exportables/importables
✅ **Évolutivité** : Facile d'ajouter de nouveaux profils

### Inconvénients

❌ **Complexité initiale** : Créer le 1er profil prend du temps
❌ **Maintenance** : Profils à mettre à jour si format change
❌ **Stockage** : Table + fichiers JSON supplémentaires

---

## 📊 Comparaison des Propositions

| Critère | Prop 1<br>Simple | Prop 2<br>Mapping | Prop 3<br>Transform | Prop 4<br>Multi-KPIs | Prop 5<br>Profils |
|---------|------------------|-------------------|---------------------|----------------------|-------------------|
| **Facilité MVP** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐ |
| **Contrôle Utilisateur** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Gestion Doublons** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **KPIs Calculés** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Réutilisabilité** | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐ |
| **Effort Dev (jours)** | 1 | 5 | 7 | 10 | 8 |

### Légende
- ⭐⭐⭐⭐⭐ : Excellent
- ⭐⭐⭐⭐ : Très bon
- ⭐⭐⭐ : Bon
- ⭐⭐ : Acceptable
- ⭐ : Faible

---

## 🏆 Recommandation

### Approche Hybride Recommandée

**Combiner Proposition 2 + Proposition 3 + Proposition 5**

### Phase 1 : MVP (2 semaines)

**Implémenter Proposition 2 (Mapping Assisté)**
- ✅ Endpoint `/analyze-file`
- ✅ Modal de mapping basique
- ✅ Sélection date + KPIs
- ✅ Renommage des KPIs
- ✅ Aperçu des données

### Phase 2 : Enhanced (1 semaine)

**Ajouter Proposition 3 (Transformations)**
- ✅ KPIs calculés (Marge, Taux, etc.)
- ✅ Règles prédéfinies
- ✅ Validation des formules

### Phase 3 : Advanced (2 semaines)

**Ajouter Proposition 5 (Profils)**
- ✅ Stockage profils (JSON + BDD)
- ✅ Détection automatique
- ✅ Import/Export profils
- ✅ Bibliothèque de profils

### Pourquoi Hybride ?

**Avantages** :
1. ✅ **MVP rapide** avec Proposition 2 (utilisable en 2 semaines)
2. ✅ **Évolutivité** : Chaque phase ajoute de la valeur
3. ✅ **Flexibilité** : Mapping manuel OU profil automatique
4. ✅ **ROI progressif** : Utilisable dès Phase 1

**Évite** :
1. ❌ Import "bête" sans contrôle (Prop 1)
2. ❌ Refonte architecture (Prop 4)

---

## 🚀 Plan d'Implémentation

### Sprint 1 : Analyse & Mapping (Semaine 1)

**Backend**

```bash
# Fichiers à créer/modifier
python-engine/
├── api/
│   └── endpoints.py
│       ├── POST /api/analyze-file (NOUVEAU)
│       └── POST /api/upload (MODIFIER - accepter config)
└── utils/
    └── file_analyzer.py (NOUVEAU)
        ├── detect_separator()
        ├── detect_encoding()
        ├── analyze_columns()
        └── preview_data()
```

**Code : file_analyzer.py**

```python
import pandas as pd
import io
from typing import Dict, List

def analyze_file(content: bytes, filename: str) -> Dict:
    """Analyse complète d'un fichier"""

    # Détecter encodage
    encodings = ['utf-8-sig', 'utf-8', 'latin-1', 'cp1252']
    content_str = None
    for enc in encodings:
        try:
            content_str = content.decode(enc)
            break
        except:
            continue

    if not content_str:
        raise ValueError("Encodage non supporté")

    # Détecter séparateur
    separators = [';', ',', '\t', '|']
    df = None
    sep_used = None

    for sep in separators:
        try:
            df_test = pd.read_csv(
                io.StringIO(content_str),
                sep=sep,
                nrows=100,
                decimal=','  # Tenter virgule d'abord
            )
            if len(df_test.columns) > 1:
                df = df_test
                sep_used = sep
                break
        except:
            continue

    if df is None:
        raise ValueError("Format de fichier non reconnu")

    # Analyser chaque colonne
    columns = []
    for col in df.columns:
        col_info = {
            'name': col,
            'type': 'text',
            'samples': df[col].dropna().head(3).tolist(),
            'null_count': int(df[col].isnull().sum()),
            'null_percentage': round(df[col].isnull().sum() / len(df) * 100, 2)
        }

        # Déterminer le type
        if pd.api.types.is_numeric_dtype(df[col]):
            col_info['type'] = 'numeric'
            col_info['min'] = float(df[col].min())
            col_info['max'] = float(df[col].max())
            col_info['mean'] = float(df[col].mean())
        else:
            # Tester si c'est une date
            try:
                pd.to_datetime(df[col].dropna().head(20), dayfirst=True)
                col_info['type'] = 'date'
            except:
                pass

        columns.append(col_info)

    return {
        'filename': filename,
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'separator': sep_used,
        'columns': columns,
        'preview': df.head(5).to_dict('records')
    }
```

**Frontend**

```bash
electron-app/src/components/
├── DataImport/
│   ├── DataImportZone.tsx (EXISTANT)
│   ├── MappingModal.tsx (NOUVEAU)
│   ├── ColumnSelector.tsx (NOUVEAU)
│   └── PreviewTable.tsx (NOUVEAU)
```

**Tâches** :
- [ ] Créer `file_analyzer.py`
- [ ] Endpoint `/analyze-file`
- [ ] Composant `MappingModal`
- [ ] Workflow : Upload → Analyze → Mapping → Import
- [ ] Tests unitaires

**Livrable** : Import avec mapping fonctionnel

---

### Sprint 2 : KPIs Calculés (Semaine 2)

**Backend**

```bash
python-engine/
└── utils/
    └── calculated_kpis.py (NOUVEAU)
        ├── available_formulas()
        ├── validate_formula()
        ├── apply_formula()
        └── create_calculated_column()
```

**Code : calculated_kpis.py**

```python
from typing import Dict, List
import pandas as pd
import re

# Formules prédéfinies
PREDEFINED_FORMULAS = {
    'marge_brute': {
        'name': 'Marge Brute',
        'formula': '{ca} - {cout_st} - {cout_interne}',
        'required': ['ca', 'cout_st', 'cout_interne'],
        'description': 'Chiffre d\'affaires moins coûts totaux'
    },
    'taux_marge': {
        'name': 'Taux de Marge %',
        'formula': '({marge_brute} / {ca}) * 100',
        'required': ['marge_brute', 'ca'],
        'description': 'Pourcentage de marge sur CA'
    },
    'cout_total': {
        'name': 'Coût Total',
        'formula': '{cout_st} + {cout_interne}',
        'required': ['cout_st', 'cout_interne'],
        'description': 'Somme de tous les coûts'
    }
}

def apply_calculated_kpis(df: pd.DataFrame, config: Dict) -> pd.DataFrame:
    """Applique les KPIs calculés selon config"""

    # Créer un mapping des alias vers colonnes réelles
    column_map = {}
    for kpi in config.get('kpis', []):
        column_map[kpi['alias']] = kpi['column']

    # Appliquer chaque formule
    for calc_kpi in config.get('calculated_kpis', []):
        formula = calc_kpi['formula']

        # Remplacer les placeholders par les noms de colonnes
        for alias, col_name in column_map.items():
            formula = formula.replace(f'{{{alias}}}', f'df["{col_name}"]')

        try:
            # Évaluer la formule
            df[calc_kpi['name']] = eval(formula)

            # Gérer les divisions par zéro
            if calc_kpi.get('type') == 'percentage':
                df[calc_kpi['name']] = df[calc_kpi['name']].fillna(0)
        except Exception as e:
            print(f"Erreur calcul {calc_kpi['name']}: {e}")
            continue

    return df
```

**Frontend : Ajout dans MappingModal**

```typescript
// Section KPIs Calculés
<section className="calculated-kpis">
  <h3>🧮 KPIs Calculés (optionnel)</h3>
  <label>
    <input
      type="checkbox"
      checked={enableCalculated}
      onChange={(e) => setEnableCalculated(e.target.checked)}
    />
    Créer des KPIs calculés automatiquement
  </label>

  {enableCalculated && (
    <div className="formulas">
      {PREDEFINED_FORMULAS.map(formula => (
        <label key={formula.id}>
          <input
            type="checkbox"
            checked={selectedFormulas.includes(formula.id)}
            onChange={() => toggleFormula(formula.id)}
          />
          <strong>{formula.name}</strong>
          <div className="formula-desc">{formula.description}</div>
          <code>{formula.formula}</code>
        </label>
      ))}
    </div>
  )}
</section>
```

**Tâches** :
- [ ] Créer `calculated_kpis.py`
- [ ] Interface sélection formules
- [ ] Validation des formules
- [ ] Gestion erreurs (div/0, null)
- [ ] Tests avec fichier réel

**Livrable** : KPIs calculés fonctionnels

---

### Sprint 3 : Profils (Semaine 3-4)

**Backend**

```bash
python-engine/
├── profiles/
│   └── transport-import.json (NOUVEAU)
├── database/
│   └── models.py
│       └── ImportProfile (NOUVEAU MODEL)
└── api/
    └── endpoints.py
        ├── GET /api/profiles (NOUVEAU)
        ├── POST /api/profiles (NOUVEAU)
        └── POST /api/match-profile (NOUVEAU)
```

**Frontend**

```bash
electron-app/src/components/
└── DataImport/
    ├── ProfileSelector.tsx (NOUVEAU)
    └── ProfileEditor.tsx (NOUVEAU)
```

**Tâches** :
- [ ] Table `import_profiles`
- [ ] CRUD profils
- [ ] Algorithme matching
- [ ] Interface sélection profil
- [ ] Sauvegarde profil après import réussi
- [ ] Export/Import profils (JSON)

**Livrable** : Système de profils complet

---

## ✅ Critères de Succès

### Phase 1 (MVP)

- [ ] Upload fichier 109K lignes en < 10 secondes
- [ ] Modal mapping s'affiche correctement
- [ ] Sélection de 4 KPIs fonctionne
- [ ] Aperçu affiche 5 lignes
- [ ] Import crée les KPIs en base
- [ ] Graphique affiche les données

### Phase 2 (Enhanced)

- [ ] 3 formules prédéfinies disponibles
- [ ] KPIs calculés corrects (validation manuelle)
- [ ] Pas d'erreur sur division par zéro
- [ ] Performance < 15 secondes pour 109K lignes

### Phase 3 (Advanced)

- [ ] Détection profil > 80% de précision
- [ ] Import en 1 clic avec profil
- [ ] Sauvegarde profil fonctionne
- [ ] Export/Import profil JSON

---

## 📝 Notes d'Implémentation

### Gestion des Erreurs

**Cas à gérer** :
1. Fichier vide
2. Format invalide
3. Colonnes manquantes
4. Types incompatibles
5. Mémoire insuffisante (très gros fichiers)

**Messages d'erreur explicites** :
```typescript
const ERROR_MESSAGES = {
  'EMPTY_FILE': 'Le fichier est vide',
  'INVALID_FORMAT': 'Format de fichier non reconnu. Formats acceptés : CSV, Excel, JSON',
  'MISSING_DATE': 'Aucune colonne de date trouvée. Le fichier doit contenir une colonne date.',
  'NO_NUMERIC': 'Aucune colonne numérique trouvée. Impossible de créer des KPIs.',
  'TOO_LARGE': 'Fichier trop volumineux (> 50 MB). Veuillez diviser le fichier.'
};
```

### Performance

**Optimisations** :
- Chunking pour gros fichiers (traiter par lots de 10K lignes)
- Index sur colonnes date et category
- Bulk insert au lieu de INSERT ligne par ligne
- Cache des profils en mémoire

**Code : Chunking**

```python
# Traiter par chunks de 10K lignes
chunk_size = 10000
for chunk in pd.read_csv(file, chunksize=chunk_size):
    # Traiter le chunk
    kpi_entries = process_chunk(chunk, config)
    # Bulk insert
    db.bulk_save_objects(kpi_entries)
    db.commit()
```

---

## 🎉 Conclusion

### Roadmap Finale

```
Semaine 1-2 : Phase 1 (MVP) - Mapping Assisté
   ↓ Utilisable avec mapping manuel

Semaine 3 : Phase 2 - KPIs Calculés
   ↓ Marge, ratios disponibles

Semaine 4-5 : Phase 3 - Profils
   ↓ Import automatique en 1 clic
```

### ROI Utilisateur

**Sans cette fonctionnalité** :
- ⏱️ Traiter manuellement le CSV dans Excel (2h)
- ⏱️ Calculer les marges manuellement (1h)
- ⏱️ Créer les graphiques (1h)
- **Total : 4 heures**

**Avec Phase 1 (MVP)** :
- ⏱️ Upload + Mapping (5 min)
- ⏱️ Vérification aperçu (2 min)
- ⏱️ Import (30s)
- **Total : 8 minutes** → **Gain : 3h52**

**Avec Phase 3 (Profils)** :
- ⏱️ Upload + Auto-détection profil (30s)
- ⏱️ Import (30s)
- **Total : 1 minute** → **Gain : 3h59**

---

**Prochaine étape** : Valider l'approche hybride et démarrer Sprint 1 !

**Auteur** : Claude Code
**Date** : 2026-01-15
**Version** : 1.0
