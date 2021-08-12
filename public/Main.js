const {app, BrowserWindow} = require('electron')
const ipc = require("electron").ipcMain;
const path = require('path');
const isDev = require("electron-is-dev");

require("electron-reload");

const PROTOCOL_NAME = "electron-twilio";

let win;
let params;

if (isDev && process.platform === 'win32') {
    app.setAsDefaultProtocolClient(PROTOCOL_NAME, process.execPath, [path.resolve(process.argv[1])]);
} else {
    app.setAsDefaultProtocolClient(PROTOCOL_NAME);
}

const gotTheLock = app.requestSingleInstanceLock();
console.log(gotTheLock);
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (e, argv) => {
        if (process.platform !== 'darwin') {
            params = argv.find((arg) => arg.startsWith('electron-twilio://'));
        }
        console.log(params);
    });
}


ipc.on('react-ready', () => {
    win.webContents.send('message', {type: "INIT_TWILIO", data: params});
})

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname,'/preload-main.js'),
            enableRemoteModule: true
        }})
    win.setAlwaysOnTop(true, "floating");
    win.loadURL(isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, '../build/index.html')}`);
    win.webContents.openDevTools();
} 


app.on('open-url', function (event, data) {
    event.preventDefault();
    console.log(data);
    params = data;
});

app.on('ready', createWindow);






