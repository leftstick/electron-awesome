const { BrowserWindow } = require('electron')

const CUSTOM_PROTOCOL = 'electron-awesome'

/**
 *
 * @param {import('electron').App} app
 */
module.exports.supportURLScheme = function (app) {
  app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL)
  app.on('open-url', (e, data) => {
    e.preventDefault()

    if (app.isDefaultProtocolClient(CUSTOM_PROTOCOL)) {
      app.whenReady().then(() => {
        setTimeout(() => {
          const mainWindow = BrowserWindow.getAllWindows().find(
            (win) => win.webContents.getTitle() === 'Electron Awesome'
          )
          if (mainWindow) {
            mainWindow.webContents.send('change-tab-to', data)
          }
        }, 900)
      })
    }
  })
}
