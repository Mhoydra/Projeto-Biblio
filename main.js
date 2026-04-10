const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('window-maximized');
    });

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('window-restored'); 
    });
}

app.whenReady().then(createWindow);

// =========================
// CONTROLE DA JANELA
// =========================

ipcMain.on('fechar', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.on('minimizar', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximizar', () => {
    if (!mainWindow) return;

    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
});