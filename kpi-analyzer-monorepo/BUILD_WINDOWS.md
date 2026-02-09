# Guide de Build Windows - KPI Analyzer

Ce guide explique comment compiler l'application KPI Analyzer en fichier exécutable Windows (.exe).

---

## Prérequis

### 1. Logiciels requis sur Windows

| Logiciel | Version | Téléchargement |
|----------|---------|----------------|
| **Node.js** | >= 18.x | https://nodejs.org/ |
| **Python** | >= 3.10 | https://www.python.org/downloads/ |
| **Git** | Dernière | https://git-scm.com/download/win |

### 2. Vérification de l'installation

Ouvrir **PowerShell** ou **Command Prompt** et vérifier :

```powershell
node --version      # Doit afficher v18.x ou supérieur
npm --version       # Doit afficher 9.x ou supérieur
python --version    # Doit afficher Python 3.10+
git --version       # Doit afficher git version 2.x
```

---

## Étapes de Build

### Étape 1 : Cloner ou copier le projet

```powershell
# Si vous clonez depuis Git
git clone <url-du-repo> kpi-analyzer-monorepo
cd kpi-analyzer-monorepo

# OU si vous copiez le dossier, naviguez simplement dedans
cd C:\chemin\vers\kpi-analyzer-monorepo
```

### Étape 2 : Configurer l'environnement Python

```powershell
# Naviguer vers le dossier python-engine
cd python-engine

# Créer un environnement virtuel
python -m venv .venv

# Activer l'environnement virtuel
.venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Installer PyInstaller pour la compilation
pip install pyinstaller

# Retourner à la racine
cd ..
```

### Étape 3 : Installer les dépendances Node.js

```powershell
# Naviguer vers le dossier electron-app
cd electron-app

# Installer les dépendances
npm install
```

### Étape 4 : Compiler le moteur Python

```powershell
# Depuis le dossier electron-app
cd ..\python-engine

# Activer l'environnement virtuel (si pas déjà fait)
.venv\Scripts\activate

# Compiler avec PyInstaller
pyinstaller --onefile --name engine --distpath ..\electron-app\resources --clean main.py

# Vérifier que engine.exe existe
dir ..\electron-app\resources\engine.exe
```

### Étape 5 : Compiler l'application Electron

```powershell
# Retourner au dossier electron-app
cd ..\electron-app

# Compiler le frontend (Vite + React)
npm run build

# Compiler le code Electron (TypeScript)
npm run build:electron

# Créer l'exécutable Windows
npx electron-builder --win
```

### Étape 6 : Récupérer l'exécutable

L'exécutable se trouve dans :
```
electron-app/dist-app/KPI Analyzer.exe
```

---

## Commande Unique (Raccourci)

Si tout est déjà configuré, vous pouvez exécuter une seule commande :

```powershell
cd electron-app
npm run package:win
```

**Note :** Cette commande nécessite que l'environnement Python soit correctement configuré.

---

## Script de Build Automatisé

Créez un fichier `build-windows.bat` à la racine du projet :

```batch
@echo off
echo ========================================
echo    KPI Analyzer - Build Windows
echo ========================================
echo.

REM 1. Setup Python
echo [1/5] Configuration Python...
cd python-engine
if not exist ".venv" (
    python -m venv .venv
)
call .venv\Scripts\activate
pip install -r requirements.txt
pip install pyinstaller

REM 2. Build Python Engine
echo [2/5] Compilation du moteur Python...
pyinstaller --onefile --name engine --distpath ..\electron-app\resources --clean main.py
if errorlevel 1 (
    echo ERREUR: Echec de la compilation Python
    pause
    exit /b 1
)

REM 3. Setup Node.js
echo [3/5] Installation des dependances Node.js...
cd ..\electron-app
call npm install

REM 4. Build Frontend
echo [4/5] Compilation du frontend...
call npm run build
call npm run build:electron

REM 5. Package Electron
echo [5/5] Creation de l'executable...
call npx electron-builder --win

echo.
echo ========================================
echo    BUILD TERMINE !
echo ========================================
echo L'executable se trouve dans:
echo    electron-app\dist-app\
echo ========================================
pause
```

### Utilisation du script

```powershell
# Double-cliquer sur build-windows.bat
# OU depuis PowerShell :
.\build-windows.bat
```

---

## Structure des fichiers générés

```
electron-app/
├── dist-app/
│   ├── KPI Analyzer.exe          # ← EXECUTABLE PORTABLE
│   ├── win-unpacked/             # Version non-packagée (debug)
│   └── builder-effective-config.yaml
├── resources/
│   └── engine.exe                # Moteur Python compilé
└── dist/
    └── ...                       # Frontend compilé
```

---

## Résolution de problèmes

### Erreur : "python n'est pas reconnu"

**Solution :** Ajouter Python au PATH Windows :
1. Rechercher "Variables d'environnement" dans Windows
2. Modifier la variable `Path`
3. Ajouter le chemin vers Python (ex: `C:\Python310\`)

### Erreur : "npm n'est pas reconnu"

**Solution :** Réinstaller Node.js en cochant "Add to PATH"

### Erreur : PyInstaller "No module named..."

**Solution :** Installer les dépendances manquantes :
```powershell
pip install <module-manquant>
```

### Erreur : electron-builder échoue

**Solution :** Vider le cache et réessayer :
```powershell
rmdir /s /q node_modules
rmdir /s /q dist
rmdir /s /q dist-app
npm install
npm run package:win
```

### L'application démarre mais l'API ne répond pas

**Cause possible :** Le pare-feu Windows bloque le port 8000

**Solution :**
1. Autoriser l'application dans le pare-feu
2. Ou désactiver temporairement le pare-feu pour tester

---

## Configuration Avancée

### Changer l'icône de l'application

1. Créer un fichier `icon.ico` (256x256 pixels minimum)
2. Placer dans `electron-app/build/icon.ico`
3. Mettre à jour `package.json` :

```json
"build": {
  "win": {
    "target": "portable",
    "icon": "build/icon.ico"
  }
}
```

### Créer un installateur (au lieu de portable)

Modifier `package.json` :

```json
"build": {
  "win": {
    "target": "nsis"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

### Signer l'application (certificat)

Pour éviter les avertissements Windows SmartScreen :

```json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "password"
  }
}
```

---

## Build depuis macOS (Cross-compilation)

**Important :** La cross-compilation depuis macOS vers Windows a des limitations :

1. **Le moteur Python (engine.exe) ne peut PAS être compilé depuis macOS**
   - PyInstaller ne supporte pas la cross-compilation
   - Vous devez compiler `engine.exe` sur Windows

2. **Solution recommandée :**
   - Utiliser une VM Windows ou un PC Windows
   - OU utiliser GitHub Actions pour le build automatisé

### Alternative : GitHub Actions

Créez `.github/workflows/build-windows.yml` :

```yaml
name: Build Windows

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: windows-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Python dependencies
        run: |
          cd python-engine
          pip install -r requirements.txt
          pip install pyinstaller

      - name: Build Python Engine
        run: |
          cd python-engine
          pyinstaller --onefile --name engine --distpath ../electron-app/resources --clean main.py

      - name: Install Node dependencies
        run: |
          cd electron-app
          npm install

      - name: Build Application
        run: |
          cd electron-app
          npm run build
          npm run build:electron
          npx electron-builder --win

      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: KPI-Analyzer-Windows
          path: electron-app/dist-app/*.exe
```

---

## Vérification finale

Après le build, testez l'application :

1. Double-cliquer sur `KPI Analyzer.exe`
2. L'application doit démarrer sans erreur
3. Vérifier que l'API répond : ouvrir http://localhost:8000/api/health dans un navigateur
4. Importer un fichier CSV de test

---

**Version :** 1.0
**Date :** Janvier 2026
