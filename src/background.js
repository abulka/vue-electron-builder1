'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import { autoUpdater } from 'electron-updater'

// const {ipcMain} = require('electron')
import { ipcMain } from 'electron'
import path from 'path'
import os from 'os'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,

      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false,  // <--- ANDY NEEDED! otherwise assigning window.ipcRenderer = ipcRenderer will work inside the preload module only, then disappear

      preload: path.join(__dirname, 'preload.js')  // ANDY ADDED TO ALLOW EVENT COMMS
    }
  })
  console.log('ANDY SAYS devel mode is', process.env.NODE_ENV)
  console.log('ANDY SAYS contextIsolation normally would be', !process.env.ELECTRON_NODE_INTEGRATION, 'but I have forced it to be', false)
  console.log('ANDY SAYS preload path is', path.join(__dirname, 'preload.js'))
  console.log('ANDY SAYS preload path is', path.join(app.getAppPath(), 'preload.js'))

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  autoUpdater.checkForUpdatesAndNotify()  // is an async call
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// Event Communication

// Event handler for synchronous incoming messages
ipcMain.on('synchronous-message', (event, arg) => {
  console.log('background.js event handler got arg', arg) 

  // Synchronous event emmision
  // event.returnValue = 'sync pong'
  // event.returnValue = `sync pong ${app.getVersion()}`
  event.returnValue = app.getVersion()

  // Taken from https://www.electronjs.org/docs/latest/api/process#processversionschrome-readonly
  let VersionInfo = {
    version: app.getVersion(),
    arch: os.arch(),
    platform: process.platform,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
    systemVersion: process.getSystemVersion(),
    other: {
      contextIsolation: process.contextIsolated,  // It is undefined in the main process
      resourcesPath: process.resourcesPath
    }
   };
   console.log('ANDY SAYS VersionInfo is', VersionInfo)
})

