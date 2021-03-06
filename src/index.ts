import { app, BrowserWindow } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const debug = process.argv.some(v => /--dev/.test(v)); // npm run debug

import Database from "./database";
import "./eventHandlers";

let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 320,
        minWidth: 480,
        frame: debug ? true : false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: debug ? true : false
        },
        backgroundColor: "#363544"
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    if(debug) Database.debug()
    
    createWindow();

    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name: string) => console.log(`Added Extension:  ${name}`))
        .catch((err: Error) => console.log("An error occurred: ", err));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
