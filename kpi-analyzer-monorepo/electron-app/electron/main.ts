import path from 'node:path'
import fs from 'node:fs'
import { spawn, ChildProcess } from 'node:child_process'

// Force CJS require pattern for Electron to avoid TS ESM interop issues
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

// In CommonJS, __dirname is available globally.
// However, since we are in a .ts file, we might need to rely on standard node types.
// If valid CJS, we don't need fileURLToPath logic.

let win: any
let pythonProcess: ChildProcess | null = null

process.env.DIST = path.join(__dirname, '../dist')
// Bypass app.isPackaged check to avoid crash if app is undefined
// We are in dev mode anyway.
process.env.VITE_PUBLIC = path.join(process.env.DIST, '../public')

// Print electron debug again
console.log('Electron require type:', typeof electron)
console.log('Electron keys:', Object.keys(electron))

// 🚧 Use ['npm', 'run', 'start'] for dev, or the executable for prod
const PY_DIST_FOLDER = 'python-engine' // TODO: Adjust for production packaging
const PY_MODULE = 'main' // main.py

const findEngineExecutable = (): string | null => {
    const isWindows = process.platform === 'win32'
    const executableName = isWindows ? 'engine.exe' : 'engine'
    const resourcesPath = (process as any).resourcesPath

    // Liste des chemins possibles à vérifier
    const possiblePaths = [
        path.join(resourcesPath, executableName),           // resources/engine.exe
        path.join(resourcesPath, 'resources', executableName), // resources/resources/engine.exe
        path.join(resourcesPath, '..', 'resources', executableName), // ../resources/engine.exe
        path.join(app.getAppPath(), 'resources', executableName),   // app/resources/engine.exe
        path.join(app.getAppPath(), '..', 'resources', executableName), // app/../resources/engine.exe
    ]

    console.log('=== Recherche de engine.exe ===')
    console.log(`resourcesPath: ${resourcesPath}`)
    console.log(`appPath: ${app.getAppPath()}`)
    console.log(`Platform: ${process.platform}`)

    for (const p of possiblePaths) {
        console.log(`Checking: ${p} -> ${fs.existsSync(p) ? 'FOUND' : 'not found'}`)
        if (fs.existsSync(p)) {
            return p
        }
    }

    // Lister le contenu du dossier resources pour debug
    console.log('=== Contenu du dossier resources ===')
    try {
        const files = fs.readdirSync(resourcesPath)
        console.log(`Files in ${resourcesPath}:`, files)
    } catch (e) {
        console.log(`Cannot read ${resourcesPath}:`, e)
    }

    return null
}

const startPythonSubprocess = () => {
    if (app.isPackaged) {
        // En production, rechercher l'exécutable
        const executablePath = findEngineExecutable()

        if (!executablePath) {
            const errorMsg = `Impossible de trouver engine.exe.\n\nVérifiez que le fichier a été correctement compilé et inclus dans le package.\n\nresourcesPath: ${(process as any).resourcesPath}`
            console.error(errorMsg)
            dialog.showErrorBox('Erreur de démarrage', errorMsg)
            app.quit()
            return
        }

        console.log(`Production mode: Starting engine from ${executablePath}`)

        pythonProcess = spawn(executablePath, ['8000'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true
        })

        pythonProcess.stdout?.on('data', (data) => {
            console.log(`[Engine]: ${data}`)
        })

        pythonProcess.stderr?.on('data', (data) => {
            console.error(`[Engine Error]: ${data}`)
        })

        pythonProcess.on('error', (err) => {
            console.error(`[Engine Spawn Error]: ${err.message}`)
            dialog.showErrorBox('Erreur Engine', `Impossible de démarrer le moteur:\n${err.message}`)
        })

        pythonProcess.on('exit', (code) => {
            console.log(`[Engine] Process exited with code ${code}`)
        })

    } else {
        // En développement, exécuter Python directement
        const isWindows = process.platform === 'win32'
        const pythonPath = isWindows
            ? path.join(__dirname, '../../python-engine/.venv/Scripts/python.exe')
            : path.join(__dirname, '../../python-engine/.venv/bin/python3')
        const scriptPath = path.join(__dirname, '../../python-engine/main.py')

        console.log(`Starting Python from: ${pythonPath} ${scriptPath}`)

        pythonProcess = spawn(pythonPath, [scriptPath, '8000'])

        pythonProcess.stdout?.on('data', (data) => {
            console.log(`[Python]: ${data}`)
        })

        pythonProcess.stderr?.on('data', (data) => {
            console.error(`[Python API Error]: ${data}`)
        })

        pythonProcess.on('error', (err) => {
            console.error(`[Python Spawn Error]: ${err.message}`)
        })
    }

    // Cleanup on exit
    app.on('will-quit', () => {
        pythonProcess?.kill()
    })
}


function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For MVP simplicity, we use direct IPC or just HTTP requests
            // In a real secure app, we'd use preload scripts and contextIsolation: true
        },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    startPythonSubprocess()
    createWindow()
})
