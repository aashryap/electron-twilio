const {app, BrowserWindow} = require('electron')      
const ipc = require("electron").ipcMain;
const path = require('path');

let window1;
let window2;
let window3;
let appLaunchParams;

ipc.on('reply', (event, message) => {
	console.log(event, message);
	window1.webContents.send('messageFromMain', `This is the message from the second window: ${message}`);
})

ipc.on('message', (event, data) => {
    // if (data.origin === 'main-window') {
    //     window2.webContents.send('message', data)
    // } else {
    //     window1.webContents.send('message', data);
    // }
    // window3.webContents.send("message", data);
});

function createWindow1 () {   
    // Create the browser window.   
    window1 = new BrowserWindow({width: 800, height: 600, 
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname,'/preload-main.js'),
            contextIsolation: false,
            enableRemoteModule: true
        }})          
    window1.loadURL('http://localhost:3002/');
    window1.setAlwaysOnTop(true, "floating");
    // win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    window1.webContents.openDevTools();    
} 

function createWindow3 () {   
    // Create the browser window.    
    window3 = new BrowserWindow({width: 800, height: 600, 
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname,'/preload-main.js'),
            contextIsolation: false,
            enableRemoteModule: true
        }})          
    window3.loadURL('http://localhost:3002/');
    // window3.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    window3.webContents.openDevTools();    
} 

function createWindow2 () {   
    // Create the browser window.     
    window2 = new BrowserWindow({width: 400, height: 600, 
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/preload-small-window.js',
            contextIsolation: false
        }})        
    // and load the index.html of the app.     
    // win.loadFile('index.html')   
    // window2.loadURL('http://localhost:3002/');
    window2.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

    // window2.webContents.openDevTools();    
}      

module.exports.getLaunchParams = () => appLaunchParams;

app.on('will-finish-launching',function() {
    app.on('open-url', function (event, data) {
        event.preventDefault();
        setTimeout(() => {
            window1.webContents.send('message', {type: "INIT_TWILIO", data});
        },3000);
        console.log("DATA ", data);
        appLaunchParams = data;
    });
})

app.on('open-url', function (event, data) {
    event.preventDefault();
    setTimeout(() => {
        window1.webContents.send('message', data);
    },3000);
    console.log("DATA ", data);
    appLaunchParams = data;
});

app.on('ready', createWindow1);
// app.on('ready', createWindow2);
// app.on('ready', createWindow3);
