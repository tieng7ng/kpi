# Guide d'Utilisation - Application Analyseur KPI
## Manuel Utilisateur Complet

**Version** : MVP v0.1.0
**Date** : 2024-01-14
**Public** : Utilisateurs finaux et administrateurs

---

## 📋 Table des Matières

1. [Introduction](#1-introduction)
2. [Prérequis Système](#2-prérequis-système)
3. [Installation](#3-installation)
4. [Premier Démarrage](#4-premier-démarrage)
5. [Utilisation de l'Application](#5-utilisation-de-lapplication)
6. [Formats de Fichiers Supportés](#6-formats-de-fichiers-supportés)
7. [Dépannage](#7-dépannage)
8. [Limitations Connues](#8-limitations-connues)
9. [FAQ](#9-faq)

---

## 1. Introduction

### 1.1 Qu'est-ce que l'Analyseur KPI ?

L'Analyseur KPI est une application desktop qui permet de :
- ✅ Importer des fichiers de données (CSV, Excel, JSON)
- ✅ Visualiser vos KPI sous forme de graphiques
- ✅ Analyser vos données de manière simple et rapide
- ✅ Tout cela **localement**, sans connexion internet

### 1.2 À qui s'adresse cette application ?

- Analystes métier souhaitant visualiser des KPI
- Équipes ayant des données dans plusieurs fichiers à consolider
- Utilisateurs ayant besoin d'une solution **simple** et **locale**

### 1.3 Ce que l'application N'EST PAS

⚠️ **Cette version MVP n'est PAS :**
- Une solution de production sécurisée (voir RAPPORT_AUDIT_CODE.md)
- Un outil pour données très sensibles
- Une application multi-utilisateurs
- Un outil de BI complet (comme Power BI ou Tableau)

---

## 2. Prérequis Système

### 2.1 Configuration Minimale

| Composant | Minimum Requis | Recommandé |
|-----------|----------------|------------|
| **Système d'exploitation** | Windows 10, macOS 10.14+ | Windows 11, macOS 12+ |
| **Processeur** | Intel i3 (2015+) | Intel i5 ou Apple Silicon |
| **Mémoire RAM** | 4 GB | 8 GB |
| **Espace disque** | 500 MB | 2 GB |
| **Résolution écran** | 1280x720 | 1920x1080 |

### 2.2 Logiciels Nécessaires

**Pour l'installation :**
- **Node.js** : Version 20.x ou supérieure
  - Télécharger : https://nodejs.org/
  - Vérifier : `node --version` dans un terminal

- **Python** : Version 3.11 ou supérieure
  - Télécharger : https://www.python.org/downloads/
  - Vérifier : `python --version` ou `python3 --version`

- **Git** (optionnel, pour cloner le projet)
  - Télécharger : https://git-scm.com/

---

## 3. Installation

### 3.1 Téléchargement du Projet

**Option A : Cloner avec Git**

```bash
git clone https://github.com/votre-repo/kpi-analyzer-monorepo.git
cd kpi-analyzer-monorepo
```

**Option B : Télécharger le ZIP**

1. Télécharger le ZIP du projet
2. Extraire dans un dossier de votre choix
3. Ouvrir un terminal dans ce dossier

### 3.2 Installation du Backend Python

**Étapes :**

```bash
# Naviguer vers le dossier Python
cd python-engine

# Créer un environnement virtuel
python -m venv .venv

# Activer l'environnement virtuel
# Sur macOS/Linux :
source .venv/bin/activate

# Sur Windows :
.venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

**Vérification :**

```bash
# Tester le backend manuellement
python main.py

# Vous devriez voir :
# INFO:     Started server process
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

Appuyez sur `Ctrl+C` pour arrêter le serveur de test.

### 3.3 Installation du Frontend Electron

**Étapes :**

```bash
# Naviguer vers le dossier Electron (depuis la racine du projet)
cd electron-app

# Installer les dépendances Node.js
npm install
```

**Temps d'installation** : 2-5 minutes selon votre connexion internet

### 3.4 Vérification de l'Installation

✅ **Checklist d'installation complète :**

- [ ] Node.js installé et version ≥ 20.x
- [ ] Python installé et version ≥ 3.11
- [ ] Dossier `python-engine/.venv/` créé
- [ ] Dossier `electron-app/node_modules/` créé
- [ ] Aucune erreur lors de `npm install`
- [ ] Aucune erreur lors de `pip install`

---

## 4. Premier Démarrage

### 4.1 Lancement de l'Application

**Mode Développement (recommandé pour tester) :**

**Option 1 : Lancement automatique (depuis electron-app)**

```bash
cd electron-app
npm run dev
```

Cette commande :
1. Démarre le backend Python automatiquement
2. Lance le serveur de développement Vite
3. Ouvre l'application Electron

**Option 2 : Lancement manuel (2 terminaux)**

**Terminal 1 - Backend Python :**

```bash
cd python-engine
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python main.py
```

Vous devriez voir :
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2 - Frontend Electron :**

```bash
cd electron-app
npm run dev
```

L'application Electron s'ouvre automatiquement.

### 4.2 Interface de Démarrage

Au premier démarrage, vous verrez :

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              📊 Analyseur KPI                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │   📂 Glissez-déposez vos fichiers ici           │  │
│  │                                                   │  │
│  │   ou cliquez pour sélectionner                   │  │
│  │                                                   │  │
│  │   Formats acceptés : CSV, Excel, JSON            │  │
│  │                                                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Aucune donnée pour le moment                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Utilisation de l'Application

### 5.1 Importer des Fichiers

#### Méthode 1 : Glisser-Déposer

1. **Préparez votre fichier** (CSV, Excel ou JSON)
2. **Glissez-le** dans la zone de dépôt
3. **Relâchez** le fichier

L'application affiche :
```
⏳ Import en cours...
Fichier : ventes_2024.csv
```

Puis :
```
✅ Import réussi !
50,000 lignes importées
```

#### Méthode 2 : Sélection Manuelle

1. **Cliquez** sur la zone de dépôt
2. **Sélectionnez** votre fichier dans l'explorateur
3. **Validez**

### 5.2 Visualiser les Données

Une fois le fichier importé, le **Tableau de Bord** s'affiche automatiquement :

```
┌─────────────────────────────────────────────────────────┐
│  📊 Tableau de Bord KPI                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📈 Statistiques Globales                               │
│  ┌──────────────┬──────────────┬──────────────┐       │
│  │ Total KPIs   │ Dernière MAJ │ Sources      │       │
│  │ 3            │ 14/01/2024   │ 1 fichier    │       │
│  └──────────────┴──────────────┴──────────────┘       │
│                                                         │
│  📊 Graphique - Évolution des KPI                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │   [Graphique en courbes affiché ici]             │  │
│  │                                                   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Naviguer dans l'Interface

**Sections disponibles :**

1. **Import** (icône 📂)
   - Zone de glisser-déposer
   - Sélection manuelle de fichiers
   - Historique des imports

2. **Dashboard** (icône 📊)
   - Vue d'ensemble des KPIs
   - Statistiques globales
   - Graphiques principaux

3. **Graphiques** (icône 📈)
   - Visualisations détaillées
   - Types de graphiques variés

### 5.4 Interagir avec les Graphiques

**Actions disponibles :**

- **Survoler** un point → Affiche les détails (tooltip)
- **Zoomer** → Molette de la souris (selon le graphique)
- **Légende** → Cliquer pour masquer/afficher une série

---

## 6. Formats de Fichiers Supportés

### 6.1 CSV (Comma-Separated Values)

**Extension** : `.csv`

**Format attendu :**

```csv
date,kpi_name,value
2024-01-01,Chiffre d'affaires,125000
2024-01-02,Chiffre d'affaires,130000
2024-01-01,Nombre de clients,450
```

**Caractéristiques :**
- ✅ Délimiteurs : `,` (virgule), `;` (point-virgule), `\t` (tabulation)
- ✅ Encodage : UTF-8, ISO-8859-1 (détection automatique)
- ✅ Première ligne = en-têtes de colonnes

**Exemple de fichier CSV valide :**

```csv
date,kpi_name,value,category
2024-01-15,CA,125000.50,Ventes
2024-01-15,Clients,450,Commercial
2024-01-15,Marge,15.5,Finance
```

### 6.2 Excel

**Extensions** : `.xlsx`, `.xls`

**Format attendu :**

| date       | kpi_name            | value    | category |
|------------|---------------------|----------|----------|
| 2024-01-15 | Chiffre d'affaires | 125000.5 | Ventes   |
| 2024-01-15 | Nombre de clients  | 450      | Commercial |

**Caractéristiques :**
- ✅ Première ligne = en-têtes
- ✅ Multi-feuilles supporté (toutes les feuilles sont importées)
- ✅ Formules Excel sont converties en valeurs

**Note :** Si votre fichier Excel contient plusieurs feuilles, elles seront toutes importées et fusionnées.

### 6.3 JSON

**Extension** : `.json`

**Format attendu :**

```json
[
    {
        "date": "2024-01-15",
        "kpi_name": "Chiffre d'affaires",
        "value": 125000.5,
        "category": "Ventes"
    },
    {
        "date": "2024-01-15",
        "kpi_name": "Nombre de clients",
        "value": 450,
        "category": "Commercial"
    }
]
```

**Ou format objet unique :**

```json
{
    "date": "2024-01-15",
    "kpi_name": "Chiffre d'affaires",
    "value": 125000.5,
    "category": "Ventes"
}
```

**Caractéristiques :**
- ✅ Format JSON valide
- ✅ Tableau d'objets ou objet unique
- ✅ Structures imbriquées sont "aplaties" automatiquement

### 6.4 Colonnes Recommandées

Pour une meilleure expérience, vos fichiers devraient contenir :

| Colonne | Type | Obligatoire | Description |
|---------|------|-------------|-------------|
| `date` | Date | ✅ Oui | Date du KPI (format : YYYY-MM-DD) |
| `kpi_name` | Texte | ✅ Oui | Nom du KPI |
| `value` | Nombre | ✅ Oui | Valeur numérique du KPI |
| `category` | Texte | ❌ Non | Catégorie (Ventes, Finance, etc.) |
| `unit` | Texte | ❌ Non | Unité (€, %, unités, etc.) |

**Formats de date acceptés :**
- `2024-01-15` (ISO 8601 - recommandé)
- `15/01/2024` (format français)
- `01/15/2024` (format américain)
- `15-01-2024`

---

## 7. Dépannage

### 7.1 L'application ne démarre pas

**Problème** : L'application Electron ne s'ouvre pas

**Solutions :**

1. **Vérifier que le backend Python est démarré**

```bash
# Vérifier si le port 8000 est utilisé
# Sur macOS/Linux :
lsof -i :8000

# Sur Windows :
netstat -ano | findstr :8000
```

Si rien n'apparaît, le backend n'est pas démarré.

**Action** : Démarrer manuellement le backend :

```bash
cd python-engine
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python main.py
```

2. **Vérifier les logs dans le terminal**

Cherchez les erreurs de type :
- `Error: Cannot find module`
- `ModuleNotFoundError`
- `Port 8000 already in use`

### 7.2 Erreur "Upload failed"

**Problème** : Le fichier ne s'importe pas

**Causes possibles :**

1. **Fichier trop volumineux**
   - ⚠️ Limite actuelle : Aucune (problème de sécurité)
   - Recommandation : < 50 MB

2. **Format de fichier incorrect**
   - Vérifier l'extension : `.csv`, `.xlsx`, `.xls`, `.json`
   - Ouvrir le fichier pour vérifier sa structure

3. **Fichier corrompu**
   - Réenregistrer le fichier
   - Vérifier qu'il s'ouvre dans Excel/Notepad

**Actions de dépannage :**

```bash
# Vérifier les logs du backend Python
# Dans le terminal où tourne Python, chercher :
# ERROR: ...
# Exception: ...
```

### 7.3 Graphiques ne s'affichent pas

**Problème** : Le tableau de bord est vide

**Solutions :**

1. **Vérifier qu'un fichier est bien importé**
   - Retourner à la section Import
   - Réimporter le fichier

2. **Vérifier les données dans le backend**

Ouvrir dans un navigateur : http://localhost:8000/api/kpi/summary

Vous devriez voir :
```json
{
    "message": "No data yet",
    "count": 0
}
```

Ou une liste de KPIs si des données existent.

3. **Rafraîchir l'application**
   - Appuyer sur `Ctrl+R` (Windows/Linux) ou `Cmd+R` (Mac)

### 7.4 Port 8000 déjà utilisé

**Problème** : `Address already in use: 127.0.0.1:8000`

**Solution :**

**Option A : Tuer le processus existant**

```bash
# Sur macOS/Linux :
lsof -ti:8000 | xargs kill -9

# Sur Windows :
netstat -ano | findstr :8000
# Noter le PID (dernière colonne)
taskkill /PID <PID> /F
```

**Option B : Changer le port**

Éditer `python-engine/main.py` :

```python
# Ligne 38 environ
if __name__ == "__main__":
    import uvicorn
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001  # Changer 8000 → 8001
    uvicorn.run(app, host="127.0.0.1", port=port)
```

Puis éditer `electron-app/src/components/Dashboard.tsx` et `DropZone.tsx` :

```typescript
const API_URL = 'http://localhost:8001/api';  // Changer 8000 → 8001
```

### 7.5 Module Python manquant

**Problème** : `ModuleNotFoundError: No module named 'fastapi'`

**Solution :**

```bash
cd python-engine
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Si le problème persiste :

```bash
# Réinstaller l'environnement virtuel
rm -rf .venv  # Windows: rmdir /s .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 7.6 Erreur de permission (macOS)

**Problème** : `Permission denied` lors du lancement

**Solution :**

```bash
# Donner les permissions d'exécution
chmod +x python-engine/.venv/bin/python3
chmod +x electron-app/node_modules/.bin/*
```

---

## 8. Limitations Connues

### 8.1 Limitations Fonctionnelles

| Limitation | Description | Workaround |
|------------|-------------|------------|
| **Pas d'authentification** | Aucune sécurité d'accès | Utiliser uniquement en local |
| **Pas de multi-utilisateurs** | Un seul utilisateur à la fois | Installer sur chaque poste |
| **Fichiers en base de données** | Limite de taille implicite | Fichiers < 50 MB recommandé |
| **Pas de pagination** | Charge tous les KPIs | Limiter à < 10,000 KPIs |
| **Pas d'export** | Impossible d'exporter les graphiques | Capture d'écran manuelle |

### 8.2 Limitations de Sécurité

⚠️ **ATTENTION - UTILISATION EN DEV UNIQUEMENT**

Cette version MVP présente des **failles de sécurité critiques** :

1. **nodeIntegration = true** dans Electron
   - Risque XSS → RCE (exécution de code)
   - NE PAS utiliser avec des données publiques

2. **Pas d'authentification**
   - Toute personne sur le réseau local peut accéder à l'API
   - NE PAS exposer sur un réseau non sécurisé

3. **Pas de validation de fichiers**
   - Risque d'upload de fichiers malveillants
   - NE PAS utiliser avec des fichiers non fiables

**Voir** : `RAPPORT_AUDIT_CODE.md` pour la liste complète

### 8.3 Limitations de Performance

| Opération | Limite | Impact |
|-----------|--------|--------|
| Import CSV | < 50 MB | Lenteur au-delà |
| Nombre de KPIs | < 10,000 | Graphiques ralentis |
| Requêtes simultanées | 1 seule | Backend bloqué |

---

## 9. FAQ

### 9.1 Général

**Q : Mes données sont-elles envoyées sur Internet ?**

R : **Non**, toutes les données restent sur votre ordinateur. L'application fonctionne 100% en local.

---

**Q : Puis-je utiliser l'application sans Internet ?**

R : **Oui**, aucune connexion Internet n'est requise (sauf pour l'installation initiale des dépendances).

---

**Q : Combien de fichiers puis-je importer ?**

R : Autant que vous voulez, mais ils sont tous fusionnés en une seule base de données.

---

**Q : Les fichiers originaux sont-ils modifiés ?**

R : **Non**, les fichiers originaux ne sont jamais modifiés. Une copie est stockée dans la base de données.

---

### 9.2 Données

**Q : Où sont stockées mes données ?**

R : Dans le fichier `python-engine/kpi.db` (base de données SQLite).

---

**Q : Comment supprimer toutes mes données ?**

R : Supprimer le fichier `python-engine/kpi.db` et redémarrer l'application.

```bash
rm python-engine/kpi.db  # macOS/Linux
del python-engine\kpi.db  # Windows
```

---

**Q : Puis-je exporter mes données ?**

R : Pas dans cette version. Workaround : utiliser un client SQLite pour lire `kpi.db`.

Outil recommandé : [DB Browser for SQLite](https://sqlitebrowser.org/)

---

**Q : Les données sont-elles chiffrées ?**

R : **Non**, la base de données n'est pas chiffrée dans cette version MVP.

---

### 9.3 Utilisation

**Q : Puis-je importer des fichiers Excel avec plusieurs feuilles ?**

R : **Oui**, toutes les feuilles seront importées et fusionnées.

---

**Q : Quel format de date dois-je utiliser ?**

R : Format recommandé : `YYYY-MM-DD` (ex: `2024-01-15`)

Autres formats acceptés : `DD/MM/YYYY`, `MM/DD/YYYY`, `DD-MM-YYYY`

---

**Q : Puis-je importer des fichiers en français avec des accents ?**

R : **Oui**, l'encodage UTF-8 est détecté automatiquement.

---

**Q : Que se passe-t-il si j'importe deux fois le même fichier ?**

R : Les données sont dupliquées (pas de détection de doublons dans cette version).

---

### 9.4 Technique

**Q : Sur quel port tourne l'application ?**

R : Backend Python : `http://localhost:8000`

---

**Q : Puis-je changer le port ?**

R : Oui, voir section [7.4 Port 8000 déjà utilisé](#74-port-8000-déjà-utilisé)

---

**Q : L'application fonctionne-t-elle sur Linux ?**

R : Pas testée officiellement, mais devrait fonctionner avec quelques ajustements.

---

**Q : Puis-je compiler l'application en .exe/.dmg ?**

R : Oui, utiliser :

```bash
cd electron-app
npm run package
```

Le fichier sera dans `electron-app/dist/`.

---

## 📞 Support

### Ressources

- **Documentation technique** : `DOCUMENTATION_TECHNIQUE.md`
- **Rapport d'audit** : `RAPPORT_AUDIT_CODE.md`
- **Guide devis** : `GUIDE_UTILISATION_DEVIS.md`

### Contact

Pour toute question ou problème :
1. Vérifier cette FAQ
2. Consulter les logs du terminal
3. Lire `RAPPORT_AUDIT_CODE.md` section Dépannage

---

## 🔄 Historique des Versions

### v0.1.0 - MVP (2024-01-14)

**Fonctionnalités :**
- ✅ Import CSV, Excel, JSON
- ✅ Visualisation graphiques basiques
- ✅ Tableau de bord KPI
- ✅ Stockage local SQLite

**Limitations :**
- ❌ Pas de sécurité
- ❌ Pas de tests
- ❌ Pas d'export

---

**FIN DU GUIDE UTILISATEUR**

**Date** : 2024-01-14
**Version** : 1.0
**Application** : Analyseur KPI MVP v0.1.0
