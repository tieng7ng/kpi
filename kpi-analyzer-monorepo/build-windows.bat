@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    KPI Analyzer - Build Windows
echo    Version 2.0
echo ========================================
echo.

REM Sauvegarder le repertoire de depart
set "ROOT_DIR=%cd%"

REM ========================================
REM ETAPE 0: Verification des prerequis
REM ========================================
echo [0/7] Verification des prerequis...
echo.

REM Verifier Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo    [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH
    echo    Telechargez Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    [OK] Node.js %NODE_VERSION%

REM Verifier npm
where npm >nul 2>&1
if errorlevel 1 (
    echo    [ERREUR] npm n'est pas installe
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo    [OK] npm %NPM_VERSION%

REM Verifier Python
where python >nul 2>&1
if errorlevel 1 (
    echo    [ERREUR] Python n'est pas installe ou n'est pas dans le PATH
    echo    Telechargez Python depuis: https://www.python.org/downloads/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo    [OK] %PYTHON_VERSION%

REM Verifier la structure du projet
if not exist "python-engine" (
    echo    [ERREUR] Dossier python-engine introuvable
    echo    Assurez-vous d'executer ce script depuis la racine du projet
    pause
    exit /b 1
)
echo    [OK] Structure du projet validee

if not exist "electron-app" (
    echo    [ERREUR] Dossier electron-app introuvable
    pause
    exit /b 1
)

echo.

REM ========================================
REM ETAPE 1: Nettoyage des anciens builds
REM ========================================
echo [1/7] Nettoyage des anciens builds...

cd electron-app

if exist "dist" (
    echo    Suppression de dist/...
    rmdir /s /q dist 2>nul
)

if exist "dist-app" (
    echo    Suppression de dist-app/...
    rmdir /s /q dist-app 2>nul
)

if exist "dist-electron" (
    echo    Suppression de dist-electron/...
    rmdir /s /q dist-electron 2>nul
)

REM Creer le dossier resources s'il n'existe pas
if not exist "resources" (
    echo    Creation du dossier resources/...
    mkdir resources
)

if exist "resources\engine.exe" (
    echo    Suppression de l'ancien engine.exe...
    del /f /q resources\engine.exe 2>nul
)

echo    [OK] Nettoyage termine
echo.

cd "%ROOT_DIR%"

REM ========================================
REM ETAPE 2: Configuration Python
REM ========================================
echo [2/7] Configuration de l'environnement Python...

cd python-engine

if not exist ".venv" (
    echo    Creation de l'environnement virtuel...
    python -m venv .venv
    if errorlevel 1 (
        echo    [ERREUR] Impossible de creer l'environnement virtuel
        pause
        exit /b 1
    )
)

echo    Activation de l'environnement virtuel...
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo    [ERREUR] Impossible d'activer l'environnement virtuel
    pause
    exit /b 1
)

echo    Installation des dependances Python...
pip install -r requirements.txt -q
if errorlevel 1 (
    echo    [ERREUR] Impossible d'installer les dependances Python
    pause
    exit /b 1
)

echo    Installation de PyInstaller...
pip install pyinstaller -q
if errorlevel 1 (
    echo    [ERREUR] Impossible d'installer PyInstaller
    pause
    exit /b 1
)

echo    [OK] Environnement Python configure
echo.

REM ========================================
REM ETAPE 3: Compilation du moteur Python
REM ========================================
echo [3/7] Compilation du moteur Python (engine.exe)...
echo    Cela peut prendre plusieurs minutes...

pyinstaller --onefile --name engine --distpath ..\electron-app\resources --clean --log-level WARN main.py
if errorlevel 1 (
    echo    [ERREUR] Echec de la compilation PyInstaller
    pause
    exit /b 1
)

REM Verification que engine.exe existe
if not exist "..\electron-app\resources\engine.exe" (
    echo    [ERREUR] engine.exe n'a pas ete cree!
    echo    Verifiez les erreurs PyInstaller ci-dessus
    pause
    exit /b 1
)

REM Afficher la taille du fichier
for %%I in ("..\electron-app\resources\engine.exe") do (
    set SIZE=%%~zI
    set /a SIZE_MB=!SIZE!/1048576
    echo    [OK] engine.exe cree ^(!SIZE_MB! MB^)
)

echo.

cd "%ROOT_DIR%"

REM ========================================
REM ETAPE 4: Installation des dependances Node.js
REM ========================================
echo [4/7] Installation des dependances Node.js...

cd electron-app

if not exist "node_modules" (
    echo    Installation complete des modules...
    call npm install
) else (
    echo    Verification des modules...
    call npm install --silent
)

if errorlevel 1 (
    echo    [ERREUR] Echec de npm install
    pause
    exit /b 1
)

echo    [OK] Dependances Node.js installees
echo.

REM ========================================
REM ETAPE 5: Compilation du frontend React
REM ========================================
echo [5/7] Compilation du frontend React (Vite)...

call npm run build
if errorlevel 1 (
    echo    [ERREUR] Echec de la compilation Vite
    pause
    exit /b 1
)

REM Verification que dist/ existe
if not exist "dist\index.html" (
    echo    [ERREUR] dist/index.html non trouve
    pause
    exit /b 1
)

echo    [OK] Frontend compile
echo.

REM ========================================
REM ETAPE 6: Compilation du code Electron
REM ========================================
echo [6/7] Compilation du code Electron (TypeScript)...

call npm run build:electron
if errorlevel 1 (
    echo    [ERREUR] Echec de la compilation TypeScript Electron
    pause
    exit /b 1
)

REM Verification que dist-electron/ existe
if not exist "dist-electron\main.js" (
    echo    [ERREUR] dist-electron/main.js non trouve
    pause
    exit /b 1
)

echo    [OK] Code Electron compile
echo.

REM ========================================
REM ETAPE 7: Creation de l'executable Windows
REM ========================================
echo [7/7] Creation de l'executable Windows (Electron Builder)...
echo    Cela peut prendre plusieurs minutes...

REM Verification finale avant packaging
echo.
echo    === Verification pre-packaging ===
echo    - dist/index.html:
if exist "dist\index.html" (echo      [OK]) else (echo      [MANQUANT])
echo    - dist-electron/main.js:
if exist "dist-electron\main.js" (echo      [OK]) else (echo      [MANQUANT])
echo    - resources/engine.exe:
if exist "resources\engine.exe" (echo      [OK]) else (echo      [MANQUANT])
echo.

set CSC_IDENTITY_AUTO_DISCOVERY=false
call npx electron-builder --win
if errorlevel 1 (
    echo    [ERREUR] Echec du packaging Electron Builder
    pause
    exit /b 1
)

REM Verification que l'executable a ete cree
set "EXE_FOUND=0"
for %%f in (dist-app\*.exe) do (
    set "EXE_FOUND=1"
    set "EXE_NAME=%%~nxf"
    set "EXE_PATH=%%f"
    for %%I in ("%%f") do (
        set SIZE=%%~zI
        set /a SIZE_MB=!SIZE!/1048576
    )
)

if "!EXE_FOUND!"=="0" (
    echo    [ERREUR] Aucun fichier .exe trouve dans dist-app/
    pause
    exit /b 1
)

echo    [OK] Executable cree: !EXE_NAME! ^(!SIZE_MB! MB^)
echo.

cd "%ROOT_DIR%"

REM ========================================
REM RESUME FINAL
REM ========================================
echo.
echo ========================================
echo    BUILD TERMINE AVEC SUCCES !
echo ========================================
echo.
echo    Fichiers generes:
echo    -----------------
echo.
echo    Executable Windows:
echo    %ROOT_DIR%\electron-app\dist-app\!EXE_NAME!
echo.
echo    Taille: !SIZE_MB! MB
echo.
echo    Pour tester l'application:
echo    1. Double-cliquez sur le fichier .exe ci-dessus
echo    2. Attendez quelques secondes le demarrage
echo    3. L'application devrait s'ouvrir
echo.
echo    En cas de probleme:
echo    - Verifiez que le port 8000 n'est pas utilise
echo    - Desactivez temporairement l'antivirus
echo    - Executez en tant qu'administrateur
echo.
echo ========================================
echo.

REM Proposer d'ouvrir le dossier
set /p OPEN_FOLDER="Ouvrir le dossier contenant l'executable? (O/N): "
if /i "!OPEN_FOLDER!"=="O" (
    explorer "%ROOT_DIR%\electron-app\dist-app"
)

pause
