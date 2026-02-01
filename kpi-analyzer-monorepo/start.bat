@echo off
echo ========================================
echo    KPI Analyzer - Demarrage
echo ========================================
echo.

REM Demarrage du backend Python
echo [1/2] Demarrage du backend Python...
cd /d "%~dp0python-engine"

if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    start "Python Backend" cmd /k "python main.py"
    echo       Backend demarre sur http://localhost:5000
) else (
    echo ERREUR: Environnement virtuel Python non trouve!
    echo Veuillez executer: cd python-engine ^&^& python -m venv .venv
    pause
    exit /b 1
)

REM Attendre que le backend soit pret
echo       Attente du backend...
timeout /t 3 /nobreak > nul

REM Demarrage du frontend Electron
echo [2/2] Demarrage du frontend Electron...
cd /d "%~dp0electron-app"

if exist "node_modules" (
    start "Electron Frontend" cmd /k "npm run electron:dev"
    echo       Frontend demarre sur http://localhost:5173
) else (
    echo ERREUR: node_modules non trouve!
    echo Veuillez executer: cd electron-app ^&^& npm install
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Application demarree avec succes!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Pour arreter: executez stop.bat
echo.
