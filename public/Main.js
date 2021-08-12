const {app, BrowserWindow} = require('electron')      
const ipc = require("electron").ipcMain;
const path = require('path');
const isDev = require("electron-is-dev");
const {getDeeplinkUrl} = require('./deeplinkingurl');
const electronReload = require("electron-reload");

let window1;
let appLaunchParams;

ipc.on('app-ready', () => {
    window1.webContents.send('message', {type: "INIT_TWILIO", data: appLaunchParams});
})

function createWindow1 () {   
    // Create the browser window.   
    window1 = new BrowserWindow({width: 800, height: 600, 
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname,'/preload-main.js'),
            // contextIsolation: false,
            enableRemoteModule: true
        }})          
    window1.setAlwaysOnTop(true, "floating");
    window1.loadURL(isDev ? 'http://localhost:3002/' :
        `file://${path.join(__dirname, '../build/index.html')}`);
    window1.webContents.openDevTools();    
} 


app.on('open-url', function (event, data) {
    event.preventDefault();
    appLaunchParams = data;
});

app.on('ready', createWindow1);

getDeeplinkUrl.then((data) => {
    console.log("DATAA ", data);
    appLaunchParams = data;
})







