import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer

// IMPORTANT
// Ensure you set `contextIsolation: false,` inside background.js createWindow() webPreferences
// otherwise assigning window.ipcRenderer = ipcRenderer will work only inside the preload module only, 
// and window.ipcRenderer will become undefined again elsewhere.
