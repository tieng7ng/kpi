import path from 'node:path'
import { spawn, ChildProcess } from 'node:child_process'

// Force CJS require pattern for Electron to avoid TS ESM interop issues
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

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

const startPythonSubprocess = () => {
    if (app.isPackaged) {
        // In production, we assume an executable exists
        // On Windows: 'engine.exe', on Mac/Linux: 'engine'
        const isWindows = process.platform === 'win32'
        const executableName = isWindows ? 'engine.exe' : 'engine'
        const executablePath = path.join((process as any).resourcesPath, executableName)

        console.log(`Production mode: Starting engine from ${executablePath}`)
        console.log(`Platform: ${process.platform}`)
        pythonProcess = spawn(executablePath, ['8000'])
    } else {
        // In dev, we run python directly
        // We assume the venv is active or python is in path
        const pythonPath = path.join(__dirname, '../../python-engine/.venv/bin/python3')
        const scriptPath = path.join(__dirname, '../../python-engine/main.py')

        console.log(`Starting Python from: ${pythonPath} ${scriptPath}`)

        pythonProcess = spawn(pythonPath, [scriptPath, '8000']) // Hardcoded port 8000 for dev

        pythonProcess.stdout?.on('data', (data) => {
            console.log(`[Python]: ${data}`)
        })

        pythonProcess.stderr?.on('data', (data) => {
            console.error(`[Python API Error]: ${data}`)
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
