// preload.js  
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        // whitelist channels  
        let validChannels = ["close-window", "save-data", "restore-data", "set-restore-path"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, listener) => {
        ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },  
});