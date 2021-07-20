const electron = require('electron')
const path = require('path')
const pty = require('node-pty')
const { shell, makeId } = require('../util')

/**
 * @type {{[id: string]: {pty: pty.IPty, browserWindow: electron.BrowserWindow}}}
 */
const terminalMap = {}

module.exports.setTerminalUICommandListener = function () {
  // terminal: accept user input
  electron.ipcMain.on('write-to-pty', (e, id, data) => {
    if (!terminalMap[id] || !terminalMap[id].pty) {
      return
    }
    terminalMap[id].pty.write(data)
  })

  // terminal: resize
  electron.ipcMain.on('terminal-resize', (e, id, data) => {
    if (!terminalMap[id] || !terminalMap[id].pty) {
      return
    }
    terminalMap[id].pty.resize(data.cols, data.rows)
  })
}

module.exports.openTerminal = function () {
  const id = makeId(10)
  terminalMap[id] = {
    id: id,
    browserWindow: new electron.BrowserWindow({
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
      title: 'Terminal',
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
    }),
  }

  if (process.env.NODE_ENV === 'dev') {
    terminalMap[id].browserWindow.loadURL('http://localhost:8000/#/terminal')
  } else {
    terminalMap[id].browserWindow.loadURL(
      `file://${path.resolve(__dirname, '..', '..', '..', 'output', 'index.html')}#/terminal`
    )
  }

  terminalMap[id].browserWindow.webContents.once('did-finish-load', () => {
    terminalMap[id].browserWindow.webContents.send('open-terminal-in-view', id)

    // init pty
    terminalMap[id].pty = pty.spawn(shell, [], {
      name: process.env.TERM || 'xterm-color',
      cwd: process.env.HOME,
      // @ts-ignore
      env: process.env,
    })

    // terminal: init pty
    terminalMap[id].pty.onData((data) => {
      if (!terminalMap[id] || !terminalMap[id].pty) {
        return
      }
      terminalMap[id].browserWindow.webContents.send('write-to-xterm', id, data)
    })

    // terminal: pty exit
    terminalMap[id].pty.onExit(() => {
      if (!terminalMap[id] || !terminalMap[id].browserWindow || !terminalMap[id].browserWindow.webContents) {
        return
      }
      terminalMap[id].browserWindow.close()
      delete terminalMap[id]
    })

    terminalMap[id].browserWindow.on('closed', function () {
      try {
        terminalMap[id].pty.kill()
      } catch (error) {
        console.error(error)
      }
      if (terminalMap[id]) {
        delete terminalMap[id]
      }
    })
  })

  terminalMap[id].browserWindow.show()
}
