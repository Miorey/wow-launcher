'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import {
    createProtocol,
    /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import * as path from 'path';
import { format as formatUrl } from 'url';
const isDevelopment = !app.isPackaged;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: `app`, privileges: { secure: true, standard: true } }]);

function createMainWindow () {
    // Create the browser window.
    const win = new BrowserWindow({ width: 800, height: 639, webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        contextIsolation: false,
        resizable: isDevelopment,
        autoHideMenuBar: true,
        icon: __dirname + `/../images/favicon.ico`
    } });
    if(!isDevelopment) {
        win.removeMenu();
    }
    if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol(`app`);
        // Load the index.html when not in development
        console.log(`=== LOAD URL ===`);
        console.log(__dirname);
        win.loadURL(
            formatUrl({
                pathname: path.join(__dirname, `index.html`),
                protocol: `file`,
                slashes: true
            })
        );
    }

    win.on(`closed`, () => {
        mainWindow = null;
    });
    return win;
}

// quit application when all windows are closed
app.on(`window-all-closed`, () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== `darwin`) {
        app.quit();
    }
});

app.on(`activate`, () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on(`ready`, () => {
    mainWindow = createMainWindow();
});


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === `win32`) {
        process.on(`message`, data => {
            if (data === `graceful-exit`) {
                app.quit();
            }
        });
    } else {
        process.on(`SIGTERM`, () => {
            app.quit();
        });
    }
}
