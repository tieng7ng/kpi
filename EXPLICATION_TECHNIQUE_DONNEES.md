# Explication Technique : Cycle de Vie de la Donnée

Ce document détaille le parcours complet de la donnée, de l'import d'un fichier CSV à l'affichage du graphique dans l'interface, en prenant pour exemple l'affichage de la courbe d'évolution "Région Nord / 2020".

---

## 🏗 Architecture des Données

Le système repose sur 3 tables SQLite principales :

1.  **`raw_imports`** : Le coffre-fort (Preuve juridique et historique).
2.  **`mapping_rules`** : L'intelligence (Mémoire des choix utilisateur).
3.  **`unified_kpi`** : Le moteur (Données normalisées pour l'affichage).

---

## 🔄 Processus Détaillé (Étape par Étape)

### Étape 1 : L'Ingestion (Stockage Brut)

**Action :** L'utilisateur glisse le fichier `ventes_2020.csv`.
*Contenu du fichier :*
```csv
date_contrat;region;montant_ht
15/01/2020;Nord;1500,00
12/02/2020;Nord;2000,50
```

**Action Système :**
Le moteur copie immédiatement ce fichier tel quel dans la base de données pour traçabilité.

**Table : `raw_imports`**
| id | filename | original_content (blob) | status |
| :--- | :--- | :--- | :--- |
| 101 | `ventes_2020.csv` | [Données Binaires...] | PENDING |

---

### Étape 2 : Le Raffinage (ETL & Mapping)

**Action :** Le moteur Python analyse les colonnes.

**1. Consultation du Mapping (`mapping_rules`)**
Le moteur vérifie la correspondance des noms de colonnes :
*   `date_contrat` -> `date` (Connu)
*   `region` -> `category` (Connu)
*   `montant_ht` -> **?**

*Si inconnu, le système demande à l'utilisateur et crée une règle :*

**Table : `mapping_rules`**
| incoming_col_name | target_kpi_field | created_at |
| :--- | :--- | :--- |
| `montant_ht` | `revenue` | 2024-01-14 |

**2. Transformation & Insertion (`unified_kpi`)**
Le moteur normalise les données (dates ISO, nombres float) et remplit la table centrale.

**Table : `unified_kpi`**
| id | date (ISO) | kpi_name | category | value (float) | source_id |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `2020-01-15` | `revenue` | `Nord` | 1500.00 | 101 |
| 2 | `2020-02-12` | `revenue` | `Nord` | 2000.50 | 101 |

---

### Étape 3 : La Requête (Extraction)

**Action :** L'interface demande "Chiffre d'Affaires / Nord / 2020".

**Action Système :**
Le backend génère et exécute la requête SQL optimisée :

```sql
SELECT 
    strftime('%Y-%m', date) as mois,   -- Coupe la date en "AAAA-MM"
    SUM(value) as total                -- Additionne les montants
FROM 
    unified_kpi
WHERE 
    kpi_name = 'revenue'               -- Filtre KPI
    AND category = 'Nord'              -- Filtre Région
    AND date BETWEEN '2020-01-01' AND '2020-12-31'
GROUP BY 
    mois                               -- Groupe par mois
ORDER BY 
    mois;
```

---

### Étape 4 : La Visualisation (Affichage)

**Action :** Le moteur renvoie le JSON au Frontend.

**Flux de Données :**
```json
[
  { "mois": "2020-01", "total": 15000.00 },
  { "mois": "2020-02", "total": 18200.50 },
  ...
  { "mois": "2020-12", "total": 24000.00 }
]
```

**Rendu Final :**
Le composant graphique (Recharts) dessine la courbe à partir de ces points.
- X : Mois
- Y : Montant Total

---

### ✅ Avantages de cette structure

1.  **Performance :** L'affichage ne recalcule pas tout le fichier CSV, il lit juste la table indexée `unified_kpi`.
2.  **Traçabilité :** On sait toujours que la ligne de CA vient du fichier ID 101 (`raw_imports`).
3.  **Intelligence :** Le système apprend via `mapping_rules` et ne pose plus de questions ensuite.
