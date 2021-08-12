const isDev = require("electron-is-dev");
const {app} = require('electron');     


module.exports.getDeeplinkUrl = new Promise((resolve) => {
  if (isDev && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    // Setting this is required to get this working in dev mode.
    app.setAsDefaultProtocolClient('electron-twilio', process.execPath, [
      resolve(process.argv[1])
    ]);
  } else {
    app.setAsDefaultProtocolClient('electron-twilio');
  }
  
  app.on('open-url', function (event, url) {
    event.preventDefault();
    resolve(url);
  });
  
  // Force single application instance
  const gotTheLock = app.requestSingleInstanceLock();
  
  if (!gotTheLock) {
    app.quit();
    return;
  } else {
    app.on('second-instance', (e, argv) => {
      if (process.platform !== 'darwin') {
        // Find the arg that is our custom protocol url and store it
        resolve(argv.find((arg) => arg.startsWith('electron-twilio://')));
      }
    });
  }
});

