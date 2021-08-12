const {contextBridge, ipcRenderer} = require('electron');
console.log("INSIDE PRELOAD ");
contextBridge.exposeInMainWorld('api', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        receive: (channel, fn) => {
            console.log({channel, fn})
            ipcRenderer.on(channel, (event, ...args) => fn(...args));
        }
}) 

