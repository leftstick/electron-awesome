const { initializeLaunch } = require('./launchy')
const { initializeMenu } = require('./menu')
const { supportURLScheme } = require('./urlSchemeHandler')

/**
 *
 * @param {import("electron").App} app
 */
module.exports.setup = function (app) {
  app.on('window-all-closed', app.quit)

  initializeMenu(app)
  initializeLaunch(app)
  supportURLScheme(app)
}
