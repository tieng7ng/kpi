# Documentation Technique - KPI Analyzer

## Version 2.1

**Date :** 2026-01-16
**Projet :** Application d'Analyse KPI avec support Transport
**Stack :** Electron 28.x + React 18.x + Python 3.11 (FastAPI) + SQLite 3.x

---

## Table des Matières

1. [Architecture Globale](#1-architecture-globale)
2. [Base de Données SQLite](#2-base-de-données-sqlite)
3. [Backend Python (FastAPI)](#3-backend-python-fastapi)
4. [Frontend Electron/React](#4-frontend-electronreact)
5. [API REST](#5-api-rest)
6. [Flux de Données](#6-flux-de-données)
7. [Module Transport](#7-module-transport)

---

## 1. Architecture Globale

### 1.1 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ELECTRON APP (Desktop)                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Main Process (electron/main.ts)                                 │ │
│  │  • Window management                                             │ │
│  │  • Python subprocess spawn (port 8000)                          │ │
│  │  • IPC handlers                                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                              │                                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Renderer Process (React App)                                    │ │
│  │                                                                   │ │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐   │ │
│  │  │  Dashboard  │  │ TransportDashboard│  │     DataPage      │   │ │
│  │  │  (Général)  │  │   (Transport)     │  │  (Import/Reset)   │   │ │
│  │  └──────┬──────┘  └────────┬─────────┘  └─────────┬─────────┘   │ │
│  │         │                  │                      │              │ │
│  │         └──────────────────┼──────────────────────┘              │ │
│  │                            │                                      │ │
│  │                    ┌───────▼───────┐                             │ │
│  │                    │   KPIChart    │  (Recharts)                 │ │
│  │                    └───────────────┘                             │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTP (localhost:8000)
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                     PYTHON BACKEND (FastAPI)                         │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  main.py                                                         │ │
│  │  • FastAPI app initialization                                    │ │
│  │  • CORS middleware                                               │ │
│  │  • Router mounting (/api)                                        │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  api/endpoints.py                                                │ │
│  │  • /health          - Status check                               │ │
│  │  • /upload          - File import (CSV/Excel/JSON)              │ │
│  │  • /kpi/summary     - Generic KPI data                          │ │
│  │  • /upload/files    - List imported files                       │ │
│  │  • /reset           - Reset all data                            │ │
│  │  • /transport/stats - Transport KPIs                            │ │
│  │  • /transport/graph/* - Transport charts data                   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  database/                                                        │ │
│  │  • connection.py    - SQLAlchemy engine & session               │ │
│  │  • models.py        - ORM models (3 tables)                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  ingestion.py                                                     │ │
│  │  • process_transport_file() - Transport CSV ETL                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ SQLAlchemy ORM
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                        SQLite Database                               │
│                     (python-engine/data/kpi.db)                      │
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────────┐│
│  │  raw_imports   │  │  unified_kpi   │  │   transport_entries     ││
│  │  (fichiers)    │  │  (KPI generic) │  │   (données transport)   ││
│  └────────────────┘  └────────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Technologies et Versions

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Desktop** | Electron | 28.x | Conteneur application |
| **UI** | React | 18.2+ | Interface utilisateur |
| **Charts** | Recharts | 2.x | Visualisations graphiques |
| **Styling** | TailwindCSS | 3.x | Styles CSS |
| **Icons** | Lucide React | - | Icônes UI |
| **Backend** | FastAPI | 0.100+ | API REST |
| **ORM** | SQLAlchemy | 2.0+ | Abstraction BDD |
| **Data** | Pandas | 2.1+ | Traitement données |
| **Database** | SQLite | 3.x | Base embarquée |

### 1.3 Structure des Fichiers

```
kpi-analyzer-monorepo/
├── electron-app/
│   ├── electron/
│   │   └── main.ts              # Process principal Electron
│   ├── src/
│   │   ├── App.tsx              # Entry point React
│   │   ├── components/
│   │   │   ├── Dashboard.tsx    # Dashboard principal + toggle
│   │   │   ├── DataPage.tsx     # Page import + reset
│   │   │   ├── DropZone.tsx     # Zone drag & drop
│   │   │   ├── KPIChart.tsx     # Composant graphique unifié
│   │   │   └── dashboard/
│   │   │       ├── TransportDashboard.tsx  # Vue Transport
│   │   │       ├── ChartCard.tsx
│   │   │       ├── ChartConfigModal.tsx
│   │   │       ├── ChartDetailModal.tsx
│   │   │       └── DashboardGrid.tsx
│   │   └── types/
│   │       └── dashboard.ts     # Types TypeScript
│   └── package.json
│
├── python-engine/
│   ├── main.py                  # Entry point FastAPI
│   ├── ingestion.py             # ETL Transport
│   ├── api/
│   │   └── endpoints.py         # Tous les endpoints
│   ├── database/
│   │   ├── connection.py        # Engine SQLAlchemy
│   │   └── models.py            # Modèles ORM
│   └── data/
│       └── kpi.db               # Base SQLite
│
├── GUIDE_UTILISATION.md
├── DOCUMENTATION_TECHNIQUE.md
├── DOCUMENTATION_TECHNIQUE_GRAPHIQUES.md
└── PLAN_INTEGRATION_TRANSPORT.md
```

---

## 2. Base de Données SQLite

### 2.1 Schéma des Tables

#### 2.1.1 Table: `raw_imports`

**Description :** Stocke les fichiers importés avec leur contenu binaire.

**Fichier :** `python-engine/database/models.py:8-16`

```python
class RawImport(Base):
    __tablename__ = "raw_imports"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    checksum = Column(String, unique=True, index=True, nullable=False)  # SHA256
    import_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="PENDING")  # PENDING, PROCESSED, ERROR
    content_blob = Column(LargeBinary, nullable=True)
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INTEGER | Clé primaire auto-incrémentée |
| `filename` | VARCHAR | Nom du fichier original |
| `checksum` | VARCHAR(64) | Hash SHA256 (déduplication) |
| `import_date` | DATETIME | Date d'import |
| `status` | VARCHAR | Statut: PENDING, PROCESSED, ERROR |
| `content_blob` | BLOB | Contenu binaire du fichier |

---

#### 2.1.2 Table: `unified_kpi`

**Description :** Données KPI génériques (format pivot).

**Fichier :** `python-engine/database/models.py:26-36`

```python
class UnifiedKPI(Base):
    __tablename__ = "unified_kpi"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, index=True, nullable=False)
    kpi_name = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=True)
    value = Column(Float, nullable=False)
    source_file_id = Column(Integer, ForeignKey("raw_imports.id"))
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INTEGER | Clé primaire |
| `date` | DATETIME | Date de la mesure |
| `kpi_name` | VARCHAR | Nom du KPI (revenue, margin, etc.) |
| `category` | VARCHAR | Catégorie (Nord, Sud, Global, etc.) |
| `value` | FLOAT | Valeur numérique |
| `source_file_id` | INTEGER | FK vers raw_imports |

---

#### 2.1.3 Table: `transport_entries`

**Description :** Données transport détaillées (25 champs).

**Fichier :** `python-engine/database/models.py:38-91`

```python
class TransportEntry(Base):
    __tablename__ = "transport_entries"

    id = Column(Integer, primary_key=True, index=True)

    # Dates
    date_recepisse = Column(DateTime, index=True)
    date_exploitation = Column(DateTime)
    date_arrivage = Column(DateTime)
    date_depart = Column(DateTime)

    # Identifiants
    num_recepisse = Column(String)
    num_bordereau = Column(String, index=True)  # Clé de déduplication
    bordereau_edi = Column(String)

    # Client
    donneur_ordre = Column(String, index=True)
    type_donneur_ordre = Column(String)
    correspondant = Column(String)

    # Géographie
    pays_depart = Column(String, index=True)
    pays_arrivee = Column(String, index=True)
    pays_remettant = Column(String)

    # Volumétrie
    nombre_um = Column(Float, default=0.0)
    poids_kg = Column(Float, default=0.0)

    # Financier
    montant_net_ht = Column(Float, default=0.0)      # CA
    montant_achat_st = Column(Float, default=0.0)    # Sous-traitance
    cout_interne = Column(Float, default=0.0)

    # Calculés
    marge_brute = Column(Float, default=0.0)         # CA - ST - Interne
    taux_marge = Column(Float, default=0.0)

    source_file_id = Column(Integer, ForeignKey("raw_imports.id"), index=True)
```

**Index pour performance :**
- `date_recepisse` : Requêtes temporelles
- `num_bordereau` : Déduplication
- `donneur_ordre` : Agrégations clients
- `pays_depart`, `pays_arrivee` : Analyses géographiques

---

### 2.2 Relations

```
raw_imports (1) ──────< (N) unified_kpi
     │
     └──────────────< (N) transport_entries
```

---

### 2.3 Requêtes SQL Principales

#### Stats Transport globales
```sql
SELECT
    SUM(montant_net_ht) AS ca_total,
    SUM(marge_brute) AS marge_total,
    SUM(poids_kg) / 1000.0 AS tonnage,
    COUNT(id) AS nb_envois
FROM transport_entries;
```

#### Évolution mensuelle CA/Marge
```sql
SELECT
    strftime('%Y-%m', date_recepisse) AS month,
    SUM(montant_net_ht) AS revenue,
    SUM(marge_brute) AS margin
FROM transport_entries
GROUP BY month
ORDER BY month;
```

#### Top 10 clients
```sql
SELECT
    donneur_ordre AS name,
    SUM(montant_net_ht) AS value
FROM transport_entries
GROUP BY donneur_ordre
ORDER BY value DESC
LIMIT 10;
```

---

## 3. Backend Python (FastAPI)

### 3.1 Point d'entrée

**Fichier :** `python-engine/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import router
from database.connection import init_db

app = FastAPI(title="KPI Analyzer Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
def startup():
    init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 3.2 Connexion Base de Données

**Fichier :** `python-engine/database/connection.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kpi.db")

engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
```

### 3.3 Détection Format Transport

**Fichier :** `python-engine/api/endpoints.py:44-59`

```python
# Détection automatique du format Transport
is_transport_file = False
try:
    preview = content.decode('utf-8-sig', errors='ignore')[:1000]
    if "Num. de bordereau" in preview and "Incoterm" in preview:
        is_transport_file = True
except:
    pass

if is_transport_file:
    process_transport_file(content, file.filename, db, db_file)
    return {"status": "Imported (Transport Mode)"}
```

---

## 4. Frontend Electron/React

### 4.1 Process Principal Electron

**Fichier :** `electron-app/electron/main.ts`

```typescript
import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

let pythonProcess: any = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Spawn Python backend
    const pythonPath = path.join(__dirname, '../../python-engine/main.py');
    pythonProcess = spawn('python', [pythonPath]);

    pythonProcess.stdout.on('data', (data: Buffer) => {
        console.log(`Python: ${data}`);
    });

    win.loadURL('http://localhost:5173'); // Vite dev server
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (pythonProcess) pythonProcess.kill();
    app.quit();
});
```

### 4.2 Composant Dashboard Principal

**Fichier :** `electron-app/src/components/Dashboard.tsx`

**Fonctionnalités :**
- Toggle entre vue "Général" et "Transport"
- Détection automatique des données Transport
- Gestion des graphiques personnalisés
- Sauvegarde layout dans localStorage

```typescript
const [viewMode, setViewMode] = useState<'kpi' | 'transport'>('kpi');
const [hasTransportData, setHasTransportData] = useState(false);

useEffect(() => {
    // Détection données Transport
    fetch(`${API_URL}/transport/stats`)
        .then(res => res.json())
        .then(data => {
            if (data.count > 0) setHasTransportData(true);
        });
}, []);

// Rendu conditionnel
if (viewMode === 'transport') {
    return <TransportDashboard />;
}
```

### 4.3 Composant KPIChart

**Fichier :** `electron-app/src/components/KPIChart.tsx`

**Types supportés :**

| Type | Composant Recharts | Usage |
|------|-------------------|-------|
| `bar` | BarChart + Bar | Distributions, comparaisons |
| `line` | LineChart + Line | Évolutions temporelles |
| `area` | AreaChart + Area | Tendances avec volume |
| `pie` | PieChart + Pie | Répartitions |
| `composed` | ComposedChart | CA (Bar) + Marge (Line) |

**Props :**
```typescript
interface KPIChartProps {
    data: any[];           // Données JSON
    type: ChartType;       // 'bar' | 'line' | 'area' | 'pie' | 'composed'
    kpiKeys?: string[];    // Clés des séries
    colors?: string[];     // Palette couleurs
    formatter?: Function;  // Formatage valeurs
    height?: number;
}
```

---

## 5. API REST

### 5.1 Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Status du serveur |
| POST | `/api/upload` | Import fichier (multipart) |
| GET | `/api/upload/files` | Liste fichiers importés |
| GET | `/api/kpi/summary` | Données KPI génériques |
| POST | `/api/reset` | Réinitialisation complète |
| GET | `/api/transport/stats` | KPIs globaux Transport |
| GET | `/api/transport/graph/revenue` | Évolution CA/Marge |
| GET | `/api/transport/graph/distribution` | Top clients/pays |

### 5.2 Détails des Endpoints

#### POST `/api/upload`

**Request :**
```
Content-Type: multipart/form-data
Body: file=<binary>
```

**Response (Transport) :**
```json
{
    "filename": "data.csv",
    "id": 1,
    "status": "Imported (Transport Mode)"
}
```

#### GET `/api/transport/stats`

**Response :**
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

#### GET `/api/transport/graph/revenue`

**Response :**
```json
[
    { "name": "2024-08", "revenue": 1234567, "margin": 234567 },
    { "name": "2024-09", "revenue": 1345678, "margin": 245678 }
]
```

#### GET `/api/transport/graph/distribution?type=client`

**Paramètres :** `type` = `client` | `country`

**Response :**
```json
[
    { "name": "ACME LOGISTICS", "value": 2345678.90 },
    { "name": "GLOBAL FREIGHT", "value": 1987654.32 }
]
```

#### POST `/api/reset`

**Response :**
```json
{
    "status": "success",
    "message": "Toutes les données (Unified + Transport) ont été réinitialisées"
}
```

---

## 6. Flux de Données

### 6.1 Import Fichier

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  DropZone   │────▶│ POST /upload│────▶│  Détection  │────▶│   ETL       │
│  (React)    │     │  (FastAPI)  │     │   Format    │     │  Process    │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                    ┌─────────────────────────────────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ Transport?          │
         │ "Num. de bordereau" │
         │ + "Incoterm"        │
         └──────────┬──────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│ unified_kpi   │       │transport_entry│
│ (Générique)   │       │ (Transport)   │
└───────────────┘       └───────────────┘
```

### 6.2 Affichage Dashboard Transport

```
┌─────────────────┐
│ TransportDash   │
│ useEffect()     │
└────────┬────────┘
         │
         │ Promise.all()
         │
         ├──────────────────┬──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│/transport/stats │ │/transport/graph │ │/transport/graph │
│                 │ │   /revenue      │ │  /distribution  │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   StatsCards    │ │  ComposedChart  │ │    BarChart     │
│  (4 KPIs)       │ │  (CA + Marge)   │ │  (Top Clients)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 7. Module Transport

### 7.1 ETL Transport

**Fichier :** `python-engine/ingestion.py`

**Étapes :**

1. **Lecture CSV** : Encodage UTF-8-sig, séparateur `;`
2. **Nettoyage colonnes** : Suppression BOM, normalisation noms
3. **Conversion types** : Virgules → points pour décimaux
4. **Calculs** : `marge_brute = CA - ST - Cout_interne`
5. **Insertion** : Bulk insert SQLAlchemy

### 7.2 Colonnes Mappées

| Colonne CSV | Champ BDD | Type |
|-------------|-----------|------|
| Date de récépissé | date_recepisse | DateTime |
| Num. de bordereau | num_bordereau | String |
| Nom du Donneur d'ordre | donneur_ordre | String |
| Expéditeur Pays | pays_depart | String |
| Pays destinataire | pays_arrivee | String |
| Nombre d'UM | nombre_um | Float |
| Poids | poids_kg | Float |
| Montant Net HT | montant_net_ht | Float |
| Montant achat sous-traitance | montant_achat_st | Float |
| Coût interne | cout_interne | Float |

### 7.3 Formules Calculées (ETL)

Lors de l'import du fichier CSV, ces valeurs sont calculées pour chaque ligne :

```python
marge_brute = montant_net_ht - montant_achat_st - cout_interne
taux_marge = (marge_brute / montant_net_ht) * 100  # Si CA > 0
```

---

### 7.4 Calcul des Statistiques Transport (API)

Cette section détaille comment chaque statistique affichée dans le Dashboard Transport est calculée.

#### 7.4.1 Endpoint `/api/transport/stats` - KPIs Globaux

**Fichier :** `python-engine/api/endpoints.py:201-227`

**Code SQLAlchemy :**
```python
stats = db.query(
    func.sum(TransportEntry.montant_net_ht).label('ca_total'),
    func.sum(TransportEntry.marge_brute).label('marge_total'),
    func.sum(TransportEntry.poids_kg).label('poids_total'),
    func.count(TransportEntry.id).label('nb_envois')
).first()
```

**Requête SQL générée :**
```sql
SELECT
    SUM(montant_net_ht) AS ca_total,
    SUM(marge_brute) AS marge_total,
    SUM(poids_kg) AS poids_total,
    COUNT(id) AS nb_envois
FROM transport_entries;
```

**Calculs de transformation :**

| Statistique | Formule | Code Python |
|-------------|---------|-------------|
| **CA Total** | Somme directe | `stats.ca_total` |
| **Marge Brute** | Somme directe | `stats.marge_total` |
| **Tonnage** | Poids total ÷ 1000 | `stats.poids_total / 1000.0` |
| **Nb Expéditions** | Count direct | `stats.nb_envois` |
| **Taux de Marge** | Marge ÷ CA × 100 | `(marge_total / ca_total) * 100` |
| **Panier Moyen** | CA ÷ Nb envois | Calculé côté frontend |

**Réponse JSON :**
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

---

#### 7.4.2 Endpoint `/api/transport/graph/revenue` - Évolution Mensuelle

**Fichier :** `python-engine/api/endpoints.py:229-251`

**Code SQLAlchemy :**
```python
results = db.query(
    func.strftime('%Y-%m', TransportEntry.date_recepisse).label('month'),
    func.sum(TransportEntry.montant_net_ht).label('revenue'),
    func.sum(TransportEntry.marge_brute).label('margin')
).group_by('month').order_by('month').all()
```

**Requête SQL générée :**
```sql
SELECT
    strftime('%Y-%m', date_recepisse) AS month,
    SUM(montant_net_ht) AS revenue,
    SUM(marge_brute) AS margin
FROM transport_entries
GROUP BY strftime('%Y-%m', date_recepisse)
ORDER BY month ASC;
```

**Explication :**
- `strftime('%Y-%m', date_recepisse)` : Extrait l'année et le mois (ex: "2024-08")
- `GROUP BY month` : Agrège toutes les lignes du même mois
- `ORDER BY month` : Trie chronologiquement

**Réponse JSON :**
```json
[
    { "name": "2024-08", "revenue": 1234567.89, "margin": 234567.89 },
    { "name": "2024-09", "revenue": 1345678.90, "margin": 245678.90 },
    { "name": "2024-10", "revenue": 1456789.01, "margin": 256789.01 }
]
```

---

#### 7.4.3 Endpoint `/api/transport/graph/distribution` - Top 10

**Fichier :** `python-engine/api/endpoints.py:253-276`

**Paramètre :** `type` = `client` ou `country`

**Code SQLAlchemy :**
```python
# Sélection du champ selon le type
field = TransportEntry.donneur_ordre      # si type="client"
# ou
field = TransportEntry.pays_depart        # si type="country"

results = db.query(
    field.label('name'),
    func.sum(TransportEntry.montant_net_ht).label('value')
).group_by(field).order_by(
    func.sum(TransportEntry.montant_net_ht).desc()
).limit(10).all()
```

**Requête SQL générée (type=client) :**
```sql
SELECT
    donneur_ordre AS name,
    SUM(montant_net_ht) AS value
FROM transport_entries
GROUP BY donneur_ordre
ORDER BY SUM(montant_net_ht) DESC
LIMIT 10;
```

**Explication :**
- `GROUP BY donneur_ordre` : Agrège par client
- `ORDER BY ... DESC` : Trie du plus gros CA au plus petit
- `LIMIT 10` : Ne garde que les 10 premiers

**Réponse JSON :**
```json
[
    { "name": "BIANCHI TRASPORTI", "value": 160907.39 },
    { "name": "SALVAT LOGISTICA", "value": 30076.06 },
    { "name": "LABORATOIRES ASEPTA", "value": 18138.01 }
]
```

---

#### 7.4.4 Schéma récapitulatif des calculs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TABLE: transport_entries                          │
│                                                                          │
│  ┌──────────────┬───────────────┬──────────────┬───────────────────┐    │
│  │ date_recep.  │ donneur_ordre │ montant_net  │ marge_brute       │    │
│  ├──────────────┼───────────────┼──────────────┼───────────────────┤    │
│  │ 2024-08-01   │ ACME          │ 1500.00      │ 300.00            │    │
│  │ 2024-08-02   │ GLOBAL        │ 2000.00      │ 400.00            │    │
│  │ 2024-09-01   │ ACME          │ 1800.00      │ 350.00            │    │
│  │ ...          │ ...           │ ...          │ ...               │    │
│  └──────────────┴───────────────┴──────────────┴───────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ /transport/stats  │ │ /transport/graph  │ │ /transport/graph  │
│                   │ │    /revenue       │ │  /distribution    │
├───────────────────┤ ├───────────────────┤ ├───────────────────┤
│                   │ │                   │ │                   │
│ SUM(montant_net)  │ │ GROUP BY mois     │ │ GROUP BY client   │
│ SUM(marge_brute)  │ │ SUM(montant_net)  │ │ SUM(montant_net)  │
│ SUM(poids_kg)     │ │ SUM(marge_brute)  │ │ ORDER BY DESC     │
│ COUNT(*)          │ │ ORDER BY mois     │ │ LIMIT 10          │
│                   │ │                   │ │                   │
├───────────────────┤ ├───────────────────┤ ├───────────────────┤
│                   │ │                   │ │                   │
│ CA: 15.2 M€       │ │ 2024-08: 1.2M€    │ │ ACME: 160k€       │
│ Marge: 2.3 M€     │ │ 2024-09: 1.3M€    │ │ GLOBAL: 30k€      │
│ Tonnage: 12 345 T │ │ 2024-10: 1.4M€    │ │ ASEPTA: 18k€      │
│ Envois: 109 542   │ │ ...               │ │ ...               │
│ Taux: 15.4%       │ │                   │ │                   │
│                   │ │                   │ │                   │
└───────────────────┘ └───────────────────┘ └───────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│   4 StatsCards    │ │  ComposedChart    │ │    BarChart       │
│   (Frontend)      │ │  Barres + Ligne   │ │  Top 10 Clients   │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

---

#### 7.4.5 Calcul du Panier Moyen (Frontend)

Ce calcul est effectué côté frontend dans `TransportDashboard.tsx:74` :

```typescript
const panierMoyen = stats.revenue / (stats.shipments || 1);
```

**Formule :** `CA Total ÷ Nombre d'expéditions`

**Exemple :** `15 234 567 € ÷ 109 542 = 139 €`

---

#### 7.4.6 Formatage des valeurs (Frontend)

**Montants en euros :**
```typescript
new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
}).format(value)
// Résultat: "15 234 567,89 €"
```

**Valeurs en k€ (graphiques) :**
```typescript
formatter={(val) => `${(Number(val) / 1000).toFixed(0)}k€`}
// Résultat: "1235k€"
```

**Tonnage :**
```typescript
`${stats.tonnage.toFixed(0)} T`
// Résultat: "12 345 T"
```

**Taux de marge :**
```typescript
`${stats.margin_rate.toFixed(1)}% du CA`
// Résultat: "15.4% du CA"
```

---

## 8. Configuration

### 8.1 Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `API_PORT` | 8000 | Port du backend Python |
| `VITE_PORT` | 5173 | Port du serveur Vite (dev) |

### 8.2 localStorage (Frontend)

| Clé | Contenu |
|-----|---------|
| `kpi_dashboard_layout` | Configuration des graphiques (JSON) |

---

## 9. Démarrage

### 9.1 Développement

```bash
# Terminal 1 - Backend
cd python-engine
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend
cd electron-app
npm install
npm run dev
```

### 9.2 Production (Electron)

```bash
cd electron-app
npm run build
npm run electron:build
```

---

**Version** : 2.2 (Calculs statistiques détaillés)
**Dernière mise à jour** : Janvier 2026
