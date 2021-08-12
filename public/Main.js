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
    win.loadURL(isDev ?'http://localhost:3000/':{
        pathname:path.join(__dirname, '../build/index.html'),
        protocol:"file:",
        slashes:true
    });
    win.webContents.openDevTools();
}

const listenOpenUrl = ()=>{
    app.on('open-url', function (event, data) {
        event.preventDefault();
        console.log(data);
        params = data;
    });
}

app.on ('will-finish-launching' , listenOpenUrl);

listenOpenUrl();

const primaryInstance = app.requestSingleInstanceLock();
if (!primaryInstance) {
    app.quit();
    return;
}

app.on('second-instance', (event, args) => {
    params = args[args.length-1];
    win.webContents.send('message', {type: "INIT_TWILIO", data: params});
});


app.on('ready', createWindow);






