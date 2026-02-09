# Proposition Technique Détaillée : Solution "KPI Analyzer"

Cette proposition technique affine l'approche initiale pour garantir la faisabilité dans le délai court (4-6 semaines) et la robustesse en production.

## 1. Stack Technologique (Recommandation)

Nous validons le couple **Electron + Python**, mais avec des choix spécifiques pour éviter les pièges classiques.

### Frontend (L'Interface)
*   **Framework :** Electron + React + Vite.
*   **UI Library :** **Shadcn/ui** (basé sur TailwindCSS & Radix). _Pourquoi ?_ Composants pro, accessibles et copy-pasteables, accélère drastiquement le dev UI vs partir de zéro.
*   **Graphiques :** **Recharts**.
*   **State :** **TanStack Query** (React Query). _Pourquoi ?_ Gestion parfaite des états de chargement/erreur lors des appels au backend Python.

### Backend (Le Moteur)
*   **Architecture :** **Python via "Sidecar"**. L'application Electron lance un exécutable Python (généré par PyInstaller) au démarrage.
*   **Communication :** **API REST locale (FastAPI/Uvicorn)** sur `localhost` (port aléatoire libre).
    *   _Avantage :_ Découplage total. Le React fait des `fetch('http://localhost:port/api/...')` standards. Plus robuste que de parser `stdin/stdout`.
    *   _Sécurité :_ Token d'authentification généré par Electron au lancement et passé au process Python en variable d'env. Le backend rejette tout appel sans ce token.
*   **Libs Data :** **Pandas** (Traitement), **SQLAlchemy + SQLCipher** (DB chiffrée).

### Packaging & Distribution
*   **Builder :** `electron-builder`.
*   **Mode :** **Portable** (`nsis-web` ou simplement Archive ZIP contenant l'exe et les dossiers).
*   **Python :** Compilé en "OneFile" via `pyinstaller` pour n'avoir qu'un seul fichier binaire `engine.exe` à côté de l'app principale.

---

## 2. Architecture des Données "Portable & Sécurisée"

Pour respecter la contrainte "Mise à jour facile sans perte de données" et "Portable" :

### Structure du Dossier Applicatif
L'utilisateur reçoit un ZIP. Une fois extrait, l'arborescence est :

```text
/KPI_Analyzer_v1.0/
├── KPI_Analyzer.exe       (L'application Electron)
├── resources/
│   └── engine.exe         (Le moteur Python)
└── data/                  (Dossier de données persistantes)
    ├── kpi.db             (Base SQLite chiffrée)
    ├── uploads/           (Fichiers bruts archivés)
    └── configs/           (Templates de mapping JSON)
```

### Stratégie de Persistance
*   Vérification au démarrage : L'app vérifie la présence du dossier `data/` relatif à l'exécutable. S'il n'existe pas, elle le crée.
*   **Mise à jour manuelle :** L'utilisateur télécharge `KPI_Analyzer_v1.1.zip`. Il extrait. Il **déplace** son dossier `data/` de l'ancienne version vers la nouvelle (ou copie simplement les nouveaux `.exe` dans son dossier actuel).
*   **Sécurité des Mises à jour :** Au lancement d'une nouvelle version, le moteur Python vérifie la version du schéma de la DB (`user_version` PRAGMA) et applique les migrations SQL automatiquement si besoin.

---

## 3. Stratégie "Fusion" (Révision pour Faisabilité)

Pour tenir le délai de 4 semaines, nous abandonnons l'idée d'une "IA" de fusion magique en V1.

**Approche "Templates Intelligents" :**
1.  **Dictionnaire de Colonnes (Alias) :** Le système contient une liste de synonymes (ex: `["CA", "Chiffre d'Affaire", "Revenue", "Sales"]` -> `revenue`).
2.  **Mapping Interactif :**
    *   À l'import, si une colonne n'est pas reconnue automatiquement via les alias, l'UI demande à l'utilisateur : *"La colonne 'Mnt_Total' correspond-elle à 'Revenue' ?"*.
    *   **Apprentissage :** Ce choix est sauvegardé dans `data/configs/mapping_memory.json`. La prochaine fois, ce sera automatique.
*   _Gain :_ Faisable en quelques jours, robuste, et l'utilisateur garde le contrôle.

---

## 4. Planning Technique "Réaliste" (Séquentiel)

*   **Semaine 1 : Le Squelette (Spike)**
    *   Setup Repo Monorepo (Electron + Python).
    *   Communication IPC (FastAPI <-> React) fonctionnelle.
    *   Création DB SQLCipher.

*   **Semaine 2 : Import & Visualisation (Core)**
    *   Drag & Drop fichiers.
    *   Parsing Pandas basique.
    *   Affichage "Raw Data" (Tableau).

*   **Semaine 3 : Logique Métier & Mapping**
    *   Implémentation du "Mapping Interactif".
    *   Calculs d'agrégation KPI.
    *   Graphiques Recharts dynamiques.

*   **Semaine 4 : Packaging & Polish**
    *   Génération des binaires (PyInstaller + Electron Builder).
    *   Tests sur machine vierge (Windows Sandbox).
    *   Corrections bugs & UI Polish.

---

## 5. Pré-requis Immédiats
1.  **Valider le choix FastAPI :** Plus lourd que `stdin/stdout` mais infiniment plus maintenable pour une app riche. Acceptez-vous ce léger overhead (~50MB RAM) ?
2.  **Maquette des KPI :** Il nous faut la liste EXACTE des 5 KPI prioritaires pour hard-coder leurs logiques de calcul en V1 si le moteur générique est trop complexe.
