const { app } = require('electron')
const { initializeLaunch } = require('./setup/launchy')
const { initializeMenu } = require('./setup/menu')
const { supportURLScheme } = require('./setup/urlSchemeHandler')

const { bingSearchRunner } = require('./workers/bingProxy')

app.on('window-all-closed', app.quit)

initializeMenu(app)
supportURLScheme(app)
initializeLaunch(app).then((browser) => {
  bingSearchRunner(browser)
})
