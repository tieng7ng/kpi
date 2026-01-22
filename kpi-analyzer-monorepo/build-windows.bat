@echo off
chcp 65001 >nul
echo ========================================
echo    KPI Analyzer - Build Windows
echo ========================================
echo.

REM Verifier les prerequis
echo [0/5] Verification des prerequis...
where node >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Telechargez Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe ou n'est pas dans le PATH
    echo Telechargez Python depuis: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Node.js et Python detectes.
echo.

REM 1. Setup Python
echo [1/5] Configuration de l'environnement Python...
cd python-engine
if not exist ".venv" (
    echo    Creation de l'environnement virtuel...
    python -m venv .venv
)
call .venv\Scripts\activate
echo    Installation des dependances Python...
pip install -r requirements.txt -q
pip install pyinstaller -q

REM 2. Build Python Engine
echo [2/5] Compilation du moteur Python (engine.exe)...
if exist "..\electron-app\resources\engine.exe" del "..\electron-app\resources\engine.exe"
pyinstaller --onefile --name engine --distpath ..\electron-app\resources --clean --log-level WARN main.py
if errorlevel 1 (
    echo ERREUR: Echec de la compilation Python
    pause
    exit /b 1
)
echo    engine.exe cree avec succes !

REM 3. Setup Node.js
echo [3/5] Installation des dependances Node.js...
cd ..\electron-app
call npm install --silent

REM 4. Build Frontend
echo [4/5] Compilation du frontend React...
call npm run build
if errorlevel 1 (
    echo ERREUR: Echec de la compilation du frontend
    pause
    exit /b 1
)

echo    Compilation du code Electron...
call npm run build:electron
if errorlevel 1 (
    echo ERREUR: Echec de la compilation Electron
    pause
    exit /b 1
)

REM 5. Package Electron
echo [5/5] Creation de l'executable Windows...
call npx electron-builder --win
if errorlevel 1 (
    echo ERREUR: Echec du packaging Electron
    pause
    exit /b 1
)

echo.
echo ========================================
echo    BUILD TERMINE AVEC SUCCES !
echo ========================================
echo.
echo L'executable se trouve dans:
echo    %cd%\dist-app\
echo.
echo Fichiers generes:
dir /b dist-app\*.exe 2>nul
echo.
echo ========================================
pause
