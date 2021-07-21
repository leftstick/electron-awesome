const { app, BrowserWindow, shell, Menu } = require('electron')
const { resolve } = require('path')
const { openTerminal } = require('../../workers/terminal')

/**
 * @type {{[alias: string]: BrowserWindow }}
 */
const linksMap = {
  about: null,
}

function openMenu(alias, linkPath, size) {
  if (linksMap[alias]) {
    linksMap[alias].focus()
    return
  }
  const link = new BrowserWindow({
    parent: BrowserWindow.getFocusedWindow(),
    width: size.width,
    height: size.height,
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: true,
    title: '',
  })
  link.loadURL('file://' + linkPath)
  linksMap[alias] = link
  link.on('closed', function () {
    linksMap[alias] = null
  })
}

const menus = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'About Electron Awesome',
        click: function () {
          openMenu('about', resolve(__dirname, 'about.html'), { width: 285, height: 230 })
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click: function (e, browserWindow) {
          browserWindow.webContents.send('change-tab-to', 'PREFERENCES')
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+W',
        click: function (e, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.close()
          }
        },
      },
      {
        label: 'Quit Electron Awesome',
        accelerator: 'CmdOrCtrl+Q',
        click: function () {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Command Palette...',
        accelerator: process.platform === 'darwin' ? 'Cmd+shift+p' : 'Ctrl+shift+p',
        click: function (e, focusedWindow) {
          if (focusedWindow.webContents) {
            const title = focusedWindow.webContents.getTitle()
            if (title && !title.includes('Terminal =>')) {
              return
            }

            focusedWindow.webContents.send('open-cmd-palette')
          }
        },
      },
    ],
  },
  {
    label: 'Tool',
    submenu: [
      {
        label: 'Terminal',
        accelerator: 'Ctrl+~',
        click: function (item, focusedWindow) {
          openTerminal()
        },
      },
      {
        label: 'Next Tab',
        accelerator: process.platform === 'darwin' ? 'Cmd+Option+right' : 'Ctrl+Alt+right',
        click: function (e, focusedWindow) {
          if (focusedWindow.webContents) {
            const title = focusedWindow.webContents.getTitle()
            if (title && title.includes('Terminal =>')) {
              return
            }

            focusedWindow.webContents.send('change-tab-to', 'next')
          }
        },
      },
      {
        label: 'Previous Tab',
        accelerator: process.platform === 'darwin' ? 'Cmd+Option+left' : 'Ctrl+Alt+left',
        click: function (item, focusedWindow) {
          if (focusedWindow.webContents) {
            const title = focusedWindow.webContents.getTitle()
            if (title && title.includes('Terminal =>')) {
              return
            }

            focusedWindow.webContents.send('change-tab-to', 'previous')
          }
        },
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload()
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          }
          return 'Ctrl+Shift+I'
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        },
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Document',
        icon: resolve(__dirname, 'documentlogo.png'),
        click: function () {
          shell.openExternal('https://github.com/leftstick/electron-awesome/blob/main/README.md')
        },
      },
      {
        label: 'Source Code',
        icon: resolve(__dirname, 'githublogo.png'),
        click: function () {
          shell.openExternal('https://github.com/leftstick/electron-awesome')
        },
      },
    ],
  },
]

/**
 *
 * @param {import("electron").App} app
 */
module.exports.initializeMenu = function (app) {
  app.whenReady().then(() => {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
  })
}
