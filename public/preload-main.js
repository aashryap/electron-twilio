const electron = require('electron');
console.log("ELECTRON ", electron.remote);
window.windowType = 'main-window';
window.ipcRenderer = electron.ipcRenderer;
window.remote = electron.remote;

