import { contextBridge, ipcRenderer } from "electron";

import "./components/Headbar/preload";
import "./views/Login/preload";
declare global {
    interface Window { api: typeof api }
}

const validSendChannels = ["getUserSettings", "setUserSettings", "setActiveUser"] as const;
const validOnChannels = ["getUserSettings", "setActiveUser"] as const;


const api = {
    send(channel: typeof validSendChannels[number], ...args: any[]) {
        if(!validSendChannels.includes(channel)) return;
        ipcRenderer.send(channel, ...args);
    },
    on(channel: typeof validOnChannels[number], callback: (...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        ipcRenderer.on(channel, callback);
    },
    off(channel: typeof validOnChannels[number], callback: (...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        ipcRenderer.off(channel, callback);
    }
};

contextBridge.exposeInMainWorld("api", api);