# Documentation Technique - Génération des Graphiques

Ce document détaille le flux complet de génération des graphiques dans KPI Analyzer, du stockage en base de données jusqu'au rendu visuel dans le navigateur.

---

## 1. Architecture Globale

```
┌──────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                            │
│                                                                       │
│  ┌─────────────────────┐    ┌──────────────────────────────────────┐ │
│  │  TransportDashboard │───▶│           KPIChart.tsx               │ │
│  │  (Orchestration)    │    │  (Recharts: Bar, Line, Area, Pie,   │ │
│  └─────────────────────┘    │   Composed)                          │ │
│            │                └──────────────────────────────────────┘ │
│            │ fetch()                                                  │
└────────────┼─────────────────────────────────────────────────────────┘
             │
             ▼ HTTP GET
┌──────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                              │
│                                                                       │
│  endpoints.py                                                         │
│  ├── /transport/stats         → Agrégats globaux (SUM, COUNT)        │
│  ├── /transport/graph/revenue → Agrégation mensuelle (GROUP BY mois) │
│  └── /transport/graph/distribution → Top 10 (GROUP BY + ORDER BY)    │
│                                                                       │
└────────────────────────────────────────────────────────────────────────┘
             │
             │ SQLAlchemy ORM
             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        DATABASE (SQLite)                              │
│                                                                       │
│  Table: transport_entries                                             │
│  ├── date_recepisse (DateTime, indexed)                              │
│  ├── montant_net_ht (Float) ─────────────────▶ CA / Revenue          │
│  ├── marge_brute (Float) ────────────────────▶ Marge                 │
│  ├── poids_kg (Float) ───────────────────────▶ Tonnage               │
│  └── donneur_ordre (String, indexed) ────────▶ Client                │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend - Endpoints API

### 2.1 `/api/transport/stats` - KPIs Globaux

**Fichier** : `python-engine/api/endpoints.py:201-227`

**Objectif** : Fournir les 4 indicateurs du bandeau de stats.

**Requête SQL générée** :
```sql
SELECT
    SUM(montant_net_ht) AS ca_total,
    SUM(marge_brute) AS marge_total,
    SUM(poids_kg) AS poids_total,
    COUNT(id) AS nb_envois
FROM transport_entries;
```

**Code SQLAlchemy** :
```python
stats = db.query(
    func.sum(TransportEntry.montant_net_ht).label('ca_total'),
    func.sum(TransportEntry.marge_brute).label('marge_total'),
    func.sum(TransportEntry.poids_kg).label('poids_total'),
    func.count(TransportEntry.id).label('nb_envois')
).first()
```

**Réponse JSON** :
```json
{
    "count": 109542,
    "revenue": 15234567.89,
    "margin": 2345678.90,
    "tonnage": 12345.67,
    "shipments": 109542,
    "margin_rate": 15.4
}
```

**Calculs côté backend** :
| Champ | Formule |
|-------|---------|
| `tonnage` | `poids_total / 1000.0` (conversion kg → tonnes) |
| `margin_rate` | `(marge_total / ca_total) * 100` |

---

### 2.2 `/api/transport/graph/revenue` - Évolution Mensuelle

**Fichier** : `python-engine/api/endpoints.py:229-251`

**Objectif** : Fournir les données pour le graphique combiné CA/Marge par mois.

**Requête SQL générée** :
```sql
SELECT
    strftime('%Y-%m', date_recepisse) AS month,
    SUM(montant_net_ht) AS revenue,
    SUM(marge_brute) AS margin
FROM transport_entries
GROUP BY month
ORDER BY month;
```

**Code SQLAlchemy** :
```python
results = db.query(
    func.strftime('%Y-%m', TransportEntry.date_recepisse).label('month'),
    func.sum(TransportEntry.montant_net_ht).label('revenue'),
    func.sum(TransportEntry.marge_brute).label('margin')
).group_by('month').order_by('month').all()
```

**Réponse JSON** :
```json
[
    { "name": "2024-08", "revenue": 1234567.89, "margin": 234567.89 },
    { "name": "2024-09", "revenue": 1345678.90, "margin": 245678.90 },
    { "name": "2024-10", "revenue": 1456789.01, "margin": 256789.01 }
]
```

**Note** : Le champ `name` est utilisé par Recharts comme clé d'axe X.

---

### 2.3 `/api/transport/graph/distribution` - Top 10 Clients

**Fichier** : `python-engine/api/endpoints.py:253-276`

**Objectif** : Fournir le classement des 10 meilleurs clients par CA.

**Paramètre** : `type` (valeurs: `client` ou `country`)

**Requête SQL générée** (type=client) :
```sql
SELECT
    donneur_ordre AS name,
    SUM(montant_net_ht) AS value
FROM transport_entries
GROUP BY donneur_ordre
ORDER BY SUM(montant_net_ht) DESC
LIMIT 10;
```

**Code SQLAlchemy** :
```python
field = TransportEntry.donneur_ordre  # ou pays_depart si type="country"

results = db.query(
    field.label('name'),
    func.sum(TransportEntry.montant_net_ht).label('value')
).group_by(field).order_by(
    func.sum(TransportEntry.montant_net_ht).desc()
).limit(10).all()
```

**Réponse JSON** :
```json
[
    { "name": "ACME LOGISTICS", "value": 2345678.90 },
    { "name": "GLOBAL FREIGHT", "value": 1987654.32 },
    { "name": "EURO TRANSPORT", "value": 1654321.09 }
]
```

---

## 3. Frontend - Orchestration

### 3.1 TransportDashboard.tsx

**Fichier** : `electron-app/src/components/dashboard/TransportDashboard.tsx`

**Rôle** : Orchestrer les appels API et distribuer les données aux composants.

#### 3.1.1 Chargement des données (lignes 22-45)

```typescript
useEffect(() => {
    async function fetchData() {
        // Appels parallèles pour optimiser le chargement
        const [statsRes, revRes, clientRes] = await Promise.all([
            fetch(`${API_URL}/transport/stats`),
            fetch(`${API_URL}/transport/graph/revenue`),
            fetch(`${API_URL}/transport/graph/distribution?type=client`)
        ]);

        const statsData = await statsRes.json();
        const revData = await revRes.json();
        const clientData = await clientRes.json();

        setStats(statsData);       // → StatsCards
        setRevenueData(revData);   // → ComposedChart
        setClientData(clientData); // → BarChart
    }
    fetchData();
}, []);
```

#### 3.1.2 Interface des données Stats

```typescript
interface TransportStats {
    count: number;      // Nombre total de lignes
    revenue: number;    // CA total (€)
    margin: number;     // Marge brute totale (€)
    tonnage: number;    // Poids total (tonnes)
    shipments: number;  // Nombre d'envois
    margin_rate: number; // Taux de marge (%)
}
```

---

### 3.2 Cartes de Statistiques (StatsCard)

**Lignes** : 53-78, 127-140

**Structure** :
```
┌─────────────────────────────┐
│  Titre            [Icône]   │
│                             │
│  VALEUR PRINCIPALE          │
│  sous-texte                 │
└─────────────────────────────┘
```

**Mapping des données** :

| Carte | Source | Formatage | Sous-texte |
|-------|--------|-----------|------------|
| Chiffre d'Affaires | `stats.revenue` | `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })` | "Total importé" |
| Marge Brute | `stats.margin` | Idem | `${stats.margin_rate.toFixed(1)}% du CA` |
| Volume | `stats.tonnage` | `${tonnage.toFixed(0)} T` | `${stats.shipments} expéditions` |
| Performance | `stats.revenue / stats.shipments` | `${value.toFixed(0)} €` | "Panier moyen par envoi" |

---

## 4. Frontend - Composant KPIChart

**Fichier** : `electron-app/src/components/KPIChart.tsx`

**Librairie** : Recharts (https://recharts.org)

### 4.1 Props du composant

```typescript
interface KPIChartProps {
    data: any[];           // Données à afficher
    title: string;         // Titre du graphique
    type: ChartType;       // 'bar' | 'line' | 'area' | 'pie' | 'composed'
    kpiKeys?: string[];    // Clés des séries de données
    colors?: string[];     // Couleurs personnalisées
    formatter?: any;       // Fonction de formatage des valeurs
    height?: number;       // Hauteur du graphique
}
```

### 4.2 Types de graphiques

#### 4.2.1 ComposedChart (CA vs Marge)

**Lignes** : 31-55

**Utilisation** :
```tsx
<KPIChart
    type="composed"
    data={revenueData}
    kpiKeys={['revenue', 'margin']}
    colors={['#3b82f6', '#10b981']}
    formatter={(val) => `${(val / 1000).toFixed(0)}k€`}
/>
```

**Structure du graphique** :
```
                 Axe Y Gauche (CA)              Axe Y Droit (Marge)
                      │                              │
    2M€ ──────────────┼──────────────────────────────┼────── 400k€
                      │    ████                      │
    1.5M€ ────────────┼────████─────────────●────────┼────── 300k€
                      │    ████            / \       │
    1M€ ──────────────┼────████───●───────●───●──────┼────── 200k€
                      │    ████  / \     /           │
    500k€ ────────────┼────████─●───────●────────────┼────── 100k€
                      │    ████                      │
    0 ────────────────┴────────────────────────────────────── 0
                     2024-08  09    10    11    12
```

**Logique de rendu** :
```typescript
{kpiKeys.map((key, index) => {
    if (index === 0) {
        // Premier indicateur = Barres (axe gauche)
        return <Bar yAxisId="left" dataKey={key} fill={colors[0]} />;
    } else {
        // Autres indicateurs = Lignes (axe droit)
        return <Line yAxisId="right" dataKey={key} stroke={colors[1]} />;
    }
})}
```

#### 4.2.2 BarChart (Top Clients)

**Lignes** : 56-83

**Utilisation** :
```tsx
<KPIChart
    type="bar"
    data={clientData}
    kpiKeys={['value']}
    colors={['#8b5cf6']}
    formatter={(val) => `${(val / 1000).toFixed(0)}k€`}
/>
```

**Structure du graphique** :
```
    2.5M€ ─────────────────────────────────────
          │ ████████████████████████████████
    2M€   │ ████████████████████████████
          │ ██████████████████████████
    1.5M€ │ ████████████████████████
          │ ██████████████████████
    1M€   │ ████████████████████
          │ ██████████████████
          │ ████████████████
    500k€ │ ██████████████
          │ ████████████
    0 ────┴─────────────────────────────────────
          Client1  Client2  Client3  ...  Client10
```

**Détection automatique des clés** :
```typescript
const barKeys = kpiKeys.length > 0
    ? kpiKeys
    : Object.keys(data[0]).filter(k => k !== 'date' && k !== 'name');
```

#### 4.2.3 LineChart

**Lignes** : 84-108

**Structure** : Courbe continue avec points de données visibles.

```typescript
<Line
    type="monotone"        // Courbe lissée
    dataKey={key}
    stroke={color}
    strokeWidth={2}
    dot={{ r: 4 }}         // Points visibles
/>
```

#### 4.2.4 AreaChart

**Lignes** : 135-145

**Structure** : Zone colorée sous la courbe.

```typescript
<Area
    type="monotone"
    dataKey="value"
    stroke={color}
    fill={color}
    fillOpacity={0.2}      // Transparence de la zone
/>
```

#### 4.2.5 PieChart (Camembert)

**Lignes** : 109-134

**Structure** : Anneau avec labels en pourcentage.

```typescript
<Pie
    data={data}
    dataKey="value"
    nameKey="name"
    innerRadius={60}       // Crée un "donut"
    outerRadius={80}
    paddingAngle={5}       // Espacement entre segments
    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
/>
```

---

## 5. Formatage des Données

### 5.1 Format attendu par Recharts

**Pour graphiques temporels (Line, Bar, Area, Composed)** :
```json
[
    { "name": "2024-08", "revenue": 1234567, "margin": 234567 },
    { "name": "2024-09", "revenue": 1345678, "margin": 245678 }
]
```

**Pour graphiques de distribution (Pie, Bar horizontal)** :
```json
[
    { "name": "Client A", "value": 2345678 },
    { "name": "Client B", "value": 1987654 }
]
```

### 5.2 Formatter personnalisé

**Utilisation** :
```typescript
formatter={(val: any) => `${(Number(val) / 1000).toFixed(0)}k€`}
```

**Transformations** :
| Valeur brute | Après formatage |
|--------------|-----------------|
| 1234567 | "1235k€" |
| 2345678.90 | "2346k€" |

### 5.3 Formatage monétaire (StatsCards)

```typescript
new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
}).format(stats.revenue)
```

**Résultat** : `15 234 567,89 €`

---

## 6. Palette de Couleurs

### 6.1 Couleurs par défaut

```typescript
const defaultColors = [
    "#3b82f6",  // Bleu (primary)
    "#10b981",  // Vert (success)
    "#f59e0b",  // Orange (warning)
    "#ef4444",  // Rouge (danger)
    "#8b5cf6",  // Violet
    "#ec4899",  // Rose
    "#6366f1",  // Indigo
    "#14b8a6"   // Teal
];
```

### 6.2 Utilisation dans Transport Dashboard

| Graphique | Couleur(s) | Code |
|-----------|------------|------|
| CA (Barres) | Bleu | `#3b82f6` |
| Marge (Ligne) | Vert | `#10b981` |
| Top Clients | Violet | `#8b5cf6` |

---

## 7. Composants Recharts Utilisés

| Composant | Rôle |
|-----------|------|
| `ResponsiveContainer` | Adaptation automatique à la taille du parent |
| `XAxis` | Axe horizontal (dates, noms) |
| `YAxis` | Axe vertical (valeurs), supporte double axe |
| `CartesianGrid` | Grille de fond |
| `Tooltip` | Info-bulle au survol |
| `Legend` | Légende des séries |
| `Bar` | Barres du graphique |
| `Line` | Lignes du graphique |
| `Area` | Zone colorée |
| `Pie` / `Cell` | Segments du camembert |

---

## 8. Flux de Données Complet

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. IMPORT CSV                                                        │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ extract_377_71_260114_1428 - 2025 ROUTE IMPORT.csv          │  │
│    │ 109 542 lignes, 25 colonnes                                 │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼ process_transport_file()              │
│ 2. ETL & STOCKAGE                                                    │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ Table: transport_entries                                     │  │
│    │ - Nettoyage BOM, séparateurs                                │  │
│    │ - Calcul marge_brute = CA - ST - Coût interne               │  │
│    │ - Stockage 109 542 entrées                                  │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼ Requêtes SQL agrégées                 │
│ 3. API ENDPOINTS                                                     │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ /transport/stats      → { revenue, margin, tonnage, ... }   │  │
│    │ /transport/graph/revenue → [{ name, revenue, margin }, ...] │  │
│    │ /transport/graph/distribution → [{ name, value }, ...]      │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼ fetch() + JSON.parse()                │
│ 4. FRONTEND STATE                                                    │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ TransportDashboard.tsx                                       │  │
│    │ - stats: TransportStats                                      │  │
│    │ - revenueData: Array<{name, revenue, margin}>               │  │
│    │ - clientData: Array<{name, value}>                          │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼ Props                                 │
│ 5. RENDU GRAPHIQUE                                                   │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ KPIChart.tsx → Recharts                                      │  │
│    │ - ComposedChart (CA bars + Margin line)                     │  │
│    │ - BarChart (Top 10 clients)                                 │  │
│    │ - ResponsiveContainer → SVG → DOM                           │  │
│    └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance

### 9.1 Optimisations Backend

| Technique | Implémentation |
|-----------|----------------|
| Index SQL | `date_recepisse`, `donneur_ordre`, `pays_depart` |
| Agrégation en base | `GROUP BY` plutôt que traitement Python |
| Limit | `LIMIT 10` pour le Top clients |

### 9.2 Optimisations Frontend

| Technique | Implémentation |
|-----------|----------------|
| Appels parallèles | `Promise.all([...])` |
| ResponsiveContainer | Évite les re-renders inutiles |
| Données pré-agrégées | Pas de calcul côté client |

---

**Version** : 1.0
**Dernière mise à jour** : Janvier 2026
