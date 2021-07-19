const { BrowserWindow } = require('electron')
const { resolve } = require('path')

/**
 *
 * @param {import("electron").App} app
 * @returns {Promise<BrowserWindow>}
 */
module.exports.initializeLaunch = function (app) {
  return app.whenReady().then(() => {
    let mainWindow = new BrowserWindow({
      useContentSize: true,
      width: 800,
      minWidth: 700,
      height: 700,
      minHeight: 600,
      center: true,
      resizable: true,
      alwaysOnTop: false,
      fullscreen: false,
      skipTaskbar: false,
      kiosk: false,
      title: '',
      show: false,
      frame: true,
      disableAutoHideCursor: false,
      autoHideMenuBar: false,
      titleBarStyle: 'default',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    })

    if (process.env.NODE_ENV === 'dev') {
      setTimeout(function () {
        mainWindow.loadURL('http://localhost:8000/')
      }, 5000)
    } else {
      mainWindow.loadURL('file://' + resolve(__dirname, '..', '..', '..', 'output', 'index.html'))
    }

    mainWindow.on('closed', function () {
      mainWindow = null
      app.quit()
    })

    mainWindow.show()

    return mainWindow
  })
}
