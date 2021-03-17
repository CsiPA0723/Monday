import { ipcMain, BrowserWindow } from "electron";

ipcMain.on("closeActiveWindow", () => {
    BrowserWindow.getFocusedWindow()?.close();
});

ipcMain.on("maximizeActiveWindow", () => {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) return;
    if (!window.isMaximized()) window.maximize();
    else window.unmaximize();
});

ipcMain.on("minimizeActiveWindow", () => {
    BrowserWindow.getFocusedWindow()?.minimize();
});