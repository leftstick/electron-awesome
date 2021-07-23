const { app } = require('electron')
const { initializeLaunch } = require('./setup/launchy')
const { initializeMenu } = require('./setup/menu')
const { supportURLScheme } = require('./setup/urlSchemeHandler')
const pie = require('puppeteer-in-electron')

const { setTerminalUICommandListener } = require('./workers/terminal')
const { bingSearchRunner } = require('./workers/bingProxy')

app.on('window-all-closed', app.quit)
pie
  .initialize(app)
  .then(() => {
    initializeMenu(app)
    supportURLScheme(app)
    return initializeLaunch(app)
  })
  .then((browser) => {
    setTerminalUICommandListener()
    bingSearchRunner(browser)
  })
