const { app } = require('electron')
const { initializeLaunch } = require('./setup/launchy')
const { initializeMenu } = require('./setup/menu')
const { supportURLScheme } = require('./setup/urlSchemeHandler')

app.on('window-all-closed', app.quit)

initializeMenu(app)
initializeLaunch(app)
supportURLScheme(app)
