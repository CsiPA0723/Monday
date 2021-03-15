import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window { api: {
        closeActiveWindow: () => void,
        maximizeActiveWindow: () => void,
        minimizeActiveWindow: () => void,
    }; }
}

contextBridge.exposeInMainWorld("api", {
    closeActiveWindow: () => ipcRenderer.send("closeActiveWindow"),
    maximizeActiveWindow: () => ipcRenderer.send("maximizeActiveWindow"),
    minimizeActiveWindow: () => ipcRenderer.send("minimizeActiveWindow")
});