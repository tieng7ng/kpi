@echo off
echo ========================================
echo    KPI Analyzer - Arret
echo ========================================
echo.

echo [1/3] Arret du serveur Vite (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [2/3] Arret du backend Python (port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [3/3] Arret des processus Electron...
taskkill /IM electron.exe /F >nul 2>&1

echo.
echo ========================================
echo    Application arretee avec succes!
echo ========================================
echo.
