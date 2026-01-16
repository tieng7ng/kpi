import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { spawn, ChildProcess } from 'node:child_process'

import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
let pythonProcess: ChildProcess | null = null

// 🚧 Use ['npm', 'run', 'start'] for dev, or the executable for prod
const PY_DIST_FOLDER = 'python-engine' // TODO: Adjust for production packaging
const PY_MODULE = 'main' // main.py

const startPythonSubprocess = () => {
    if (app.isPackaged) {
        // In production, we assume an executable exists
        const executablePath = path.join((process as any).resourcesPath, 'engine') // 'engine' on mac/linux, 'engine.exe' might need detection on windows but pyinstaller handles name
        // On Mac it might be just 'engine'. On Windows 'engine.exe'. 
        // Electron builder copies it to resources.

        console.log(`Production mode: Starting engine from ${executablePath}`)
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
