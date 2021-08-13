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

ipc.on('react-ready', () => {
    win.webContents.send('message', {type: "INIT_TWILIO", data: process.argv});
})

ipc.on('react-close', () => {
    app.quit();
})

function createWindow() {
    win = new BrowserWindow({width: 1000, height: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname,'/preload-main.js'),
            enableRemoteModule: true
        }})
    win.setAlwaysOnTop(true, "floating");
    win.loadURL(isDev ?'http://localhost:3000/':`file://${path.join(__dirname, '../build/index.html')}`);
    win.removeMenu();
    if (isDev) win.webContents.openDevTools();
}

const listenOpenUrl = ()=>{
    app.on('open-url', function (event, data) {
        event.preventDefault();
        params = data;
        win.webContents.send('message', {type: "INIT_TWILIO", data});
    });
}

app.on('will-finish-launching' ,listenOpenUrl);

listenOpenUrl();

const gotTheLock  = app.requestSingleInstanceLock();

if (gotTheLock ) {
    app.on('second-instance', (event, args) => {
        params = args[args.length-1];
        console.log(params);
        win.webContents.send('message', {type: "INIT_TWILIO", data: params});
    });
    app.on('ready', createWindow);
}else{
    app.quit();
}






