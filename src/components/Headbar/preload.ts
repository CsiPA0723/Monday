import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window { headbar: {
        closeActiveWindow: () => void,
        maximizeActiveWindow: () => void,
        minimizeActiveWindow: () => void,
    }; }
}

contextBridge.exposeInMainWorld("headbar", {
    closeActiveWindow: () => ipcRenderer.send("closeActiveWindow"),
    maximizeActiveWindow: () => ipcRenderer.send("maximizeActiveWindow"),
    minimizeActiveWindow: () => ipcRenderer.send("minimizeActiveWindow")
});