const { BrowserWindow } = require('electron')

/**
 *
 * @param {import('electron').App} app
 */
module.exports.supportURLScheme = function (app) {
  app.setAsDefaultProtocolClient('electron-awesome')

  app.on('open-url', (e, data) => {
    e.preventDefault()
    app.whenReady().then(() => {
      setTimeout(() => {
        const mainWindow = BrowserWindow.getAllWindows().find((win) => win.webContents.getTitle() === 'Coding Cell')
        if (mainWindow) {
          mainWindow.webContents.send('change-tab-to', data)
        }
      }, 100)
    })
  })
}
