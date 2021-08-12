const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        receive: (channel, fn) => {
            ipcRenderer.on(channel, (event, ...args) => fn(...args));
        }
}) 

