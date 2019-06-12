const path = require('path')
const url = require('url')

const { app, BrowserWindow } = require('electron')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'
    mainWindow.loadURL(`http://localhost:8080`)
    // Open DevTools, see https://github.com/electron/electron/issues/12438
    // for why we wait for dom-ready.
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools()
    })
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
