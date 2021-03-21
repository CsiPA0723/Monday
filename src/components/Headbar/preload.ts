import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window { headbar: typeof headbar }
}

const headbar = {
    closeActiveWindow: () => ipcRenderer.send("closeActiveWindow"),
    maximizeActiveWindow: () => ipcRenderer.send("maximizeActiveWindow"),
    minimizeActiveWindow: () => ipcRenderer.send("minimizeActiveWindow")
};

contextBridge.exposeInMainWorld("headbar", headbar);