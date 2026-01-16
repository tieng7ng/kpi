# Diagnostic et Correction - Erreur Upload JSON

**Date** : 2024-01-14
**Problème** : Erreur lors de l'upload de fichiers JSON
**Sévérité** : Bloquant pour JSON et Excel

---

## 🔴 PROBLÈME IDENTIFIÉ

### Code Actuel (Ligne 49-80 de `endpoints.py`)

```python
if file.filename.endswith('.csv'):
    # Traitement CSV uniquement
    df = pd.read_csv(io.BytesIO(content), sep=';')
    # ... traitement KPI
```

**Le problème** :
- ✅ Les fichiers CSV sont traités
- ❌ Les fichiers JSON ne sont **PAS traités**
- ❌ Les fichiers Excel ne sont **PAS traités**

Le fichier est bien uploadé en base de données, mais **aucune donnée KPI n'est créée** car l'ETL ignore les formats JSON/Excel.

---

## 🔍 VÉRIFICATION DU PROBLÈME

### Étape 1 : Vérifier les logs du backend

Dans le terminal où tourne Python (`python main.py`), tu devrais voir :

```
ETL Error: ...
```

C'est l'exception capturée ligne 82-84 qui indique que l'ETL a échoué.

### Étape 2 : Vérifier que le fichier est bien en BD

```bash
cd /Users/tiengd/Documents/tuto/kpi/kpi-analyzer-monorepo/python-engine
sqlite3 data/kpi.db

# Dans SQLite :
SELECT filename, checksum, status FROM raw_imports;
```

Tu devrais voir ton fichier JSON listé, mais avec 0 KPIs associés.

### Étape 3 : Vérifier qu'aucun KPI n'a été créé

```sql
SELECT COUNT(*) FROM unified_kpis;
-- Devrait retourner 0 si seul un JSON a été uploadé
```

---

## ✅ SOLUTION - Ajout Support JSON et Excel

### Option A : Correction Rapide (Recommandée)

Éditer le fichier : `/Users/tiengd/Documents/tuto/kpi/kpi-analyzer-monorepo/python-engine/api/endpoints.py`

**Remplacer les lignes 44-85 par :**

```python
# --- ETL Process (Basic) ---
try:
    import pandas as pd
    import io
    import json

    df = None

    # Détection du format de fichier
    if file.filename.endswith('.csv'):
        # CSV : détection automatique du séparateur
        content_str = content.decode('utf-8')
        # Essayer différents séparateurs
        for sep in [';', ',', '\t', '|']:
            try:
                df = pd.read_csv(io.StringIO(content_str), sep=sep)
                if len(df.columns) > 1:  # Si plus d'une colonne, c'est bon
                    break
            except:
                continue

    elif file.filename.endswith(('.xlsx', '.xls')):
        # Excel
        df = pd.read_excel(io.BytesIO(content))

    elif file.filename.endswith('.json'):
        # JSON
        json_data = json.loads(content.decode('utf-8'))

        # Si c'est une liste d'objets
        if isinstance(json_data, list):
            df = pd.DataFrame(json_data)
        # Si c'est un objet unique
        elif isinstance(json_data, dict):
            df = pd.DataFrame([json_data])
        else:
            raise ValueError("Format JSON non supporté")

    else:
        raise ValueError(f"Format de fichier non supporté: {file.filename}")

    # Traitement des KPIs (commun à tous les formats)
    if df is not None:
        kpi_entries = []

        # Normaliser les noms de colonnes (minuscules, sans espaces)
        df.columns = df.columns.str.lower().str.strip()

        # Identifier les colonnes importantes
        date_col = None
        for col in ['date', 'datetime', 'timestamp', 'jour']:
            if col in df.columns:
                date_col = col
                break

        if date_col is None:
            raise ValueError("Aucune colonne 'date' trouvée dans le fichier")

        # Parcourir chaque ligne
        for _, row in df.iterrows():
            row_date = pd.to_datetime(row[date_col])

            # Pour chaque colonne numérique, créer un KPI
            for col in df.columns:
                if col == date_col:
                    continue

                # Vérifier si c'est une valeur numérique
                try:
                    value = float(row[col])

                    # Créer le KPI
                    kpi_entries.append(UnifiedKPI(
                        date=row_date,
                        kpi_name=col,
                        category=row.get('region', row.get('category', 'Global')),
                        value=value,
                        source_file_id=db_file.id
                    ))
                except (ValueError, TypeError):
                    # Cette colonne n'est pas numérique, on l'ignore
                    pass

        # Sauvegarder les KPIs en base
        if kpi_entries:
            db.bulk_save_objects(kpi_entries)
            db.commit()
            print(f"✅ {len(kpi_entries)} KPIs créés depuis {file.filename}")
        else:
            print(f"⚠️ Aucun KPI créé depuis {file.filename}")

except Exception as e:
    print(f"❌ ETL Error: {e}")
    import traceback
    traceback.print_exc()
    # On ne fail pas l'upload, juste on log l'erreur
```

### Option B : Workaround Temporaire (Si tu ne veux pas modifier le code)

**Convertir ton JSON en CSV** :

Si ton fichier JSON ressemble à :
```json
[
    {"date": "2024-01-01", "revenue": 1000, "margin": 15},
    {"date": "2024-01-02", "revenue": 1200, "margin": 18}
]
```

Convertis-le en CSV :
```csv
date;revenue;margin
2024-01-01;1000;15
2024-01-02;1200;18
```

Puis upload le CSV au lieu du JSON.

---

## 🔧 ÉTAPES DE CORRECTION

### 1. Arrêter le backend Python

Dans le terminal où tourne `python main.py`, appuyer sur `Ctrl+C`

### 2. Éditer le fichier

```bash
cd /Users/tiengd/Documents/tuto/kpi/kpi-analyzer-monorepo/python-engine
nano api/endpoints.py
# Ou utiliser ton éditeur préféré (VS Code, etc.)
```

Remplacer les lignes 44-85 par le code de l'Option A ci-dessus.

### 3. Redémarrer le backend

```bash
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python main.py
```

### 4. Réessayer l'upload

Dans l'application Electron, retourner à l'écran d'import et réessayer d'uploader ton fichier JSON.

---

## 📋 FORMAT JSON ATTENDU

Pour que le nouveau code fonctionne, ton fichier JSON doit avoir cette structure :

### Option 1 : Liste d'objets (recommandé)

```json
[
    {
        "date": "2024-01-01",
        "revenue": 1000.50,
        "margin": 15.5,
        "category": "Ventes"
    },
    {
        "date": "2024-01-02",
        "revenue": 1200.75,
        "margin": 18.2,
        "category": "Ventes"
    }
]
```

### Option 2 : Objet unique

```json
{
    "date": "2024-01-01",
    "revenue": 1000.50,
    "margin": 15.5,
    "category": "Ventes"
}
```

### Colonnes obligatoires

- `date` (ou `datetime`, `timestamp`, `jour`) : Date au format ISO (YYYY-MM-DD)
- Au moins une colonne numérique (revenue, margin, etc.)

### Colonnes optionnelles

- `category` ou `region` : Catégorie du KPI
- Toute autre colonne numérique sera transformée en KPI

---

## 🧪 TESTER LA CORRECTION

### Fichier JSON de test

Créer un fichier `test_kpi.json` :

```json
[
    {"date": "2024-01-01", "revenue": 1000, "margin": 15},
    {"date": "2024-01-02", "revenue": 1200, "margin": 18},
    {"date": "2024-01-03", "revenue": 1100, "margin": 16}
]
```

### Upload et vérification

1. Uploader `test_kpi.json`
2. Vérifier dans le terminal backend :
   ```
   ✅ 6 KPIs créés depuis test_kpi.json
   ```
   (2 KPIs par ligne : revenue + margin = 6 total)

3. Aller dans le Dashboard
4. Tu devrais voir les graphiques avec les données

---

## 🐛 SI ÇA NE MARCHE TOUJOURS PAS

### Vérifier les logs détaillés

Le nouveau code affiche plus d'informations :
- `✅ X KPIs créés` si succès
- `⚠️ Aucun KPI créé` si aucune colonne numérique
- `❌ ETL Error: ...` + stacktrace complète si erreur

### Erreurs possibles

**Erreur : "Aucune colonne 'date' trouvée"**
- Ton JSON n'a pas de champ `date`
- Solution : Renommer ton champ en `date`

**Erreur : "Format JSON non supporté"**
- Ton JSON n'est ni liste ni objet
- Solution : Vérifier la structure avec https://jsonlint.com

**Aucun KPI créé (⚠️)**
- Aucune colonne numérique trouvée
- Solution : Vérifier que tes valeurs sont des nombres, pas des strings

---

## 📞 DEBUG AVANCÉ

Si le problème persiste, exécuter dans le terminal Python :

```python
# Dans python-engine/
python

# Puis :
import pandas as pd
import json

# Charger ton fichier JSON
with open('ton_fichier.json', 'r') as f:
    data = json.load(f)

# Créer DataFrame
df = pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])

# Afficher
print(df)
print(df.dtypes)
```

Cela te montrera comment Pandas interprète ton fichier.

---

## ✅ CHECKLIST POST-CORRECTION

- [ ] Code modifié dans `endpoints.py`
- [ ] Backend redémarré
- [ ] Upload JSON réussi
- [ ] Message `✅ X KPIs créés` dans logs
- [ ] Graphiques affichés dans Dashboard

---

**FIN DU DIAGNOSTIC**

Si tu as besoin d'aide pour appliquer la correction, partage-moi ton fichier JSON (ou un extrait) et je t'aiderai à le diagnostiquer.
