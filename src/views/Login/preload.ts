import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window { login: typeof login }
}

const validSendChannels = ["authenticate", "registerUser", "tryRememberMe"] as const;
const validOnChannels = ["authenticated", "registerUser"] as const;


const login = {
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

contextBridge.exposeInMainWorld("login", login);