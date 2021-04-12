import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import "./components/Headbar/preload";

declare global { interface Window { api: typeof api } };

const validSendChannels = [
    "authenticate",
    "registerUser",
    "tryRememberMe",

    "getUserSettings",
    "setUserSettings",
    "setActiveUser",

    "getEaten",
    "setEaten",

    "setNotes",
    "getNotes"
] as const;

const validOnChannels = [
    "authenticated",
    "registerUser",

    "getUserSettings",
    "setActiveUser",

    "getEaten",

    "getNotes"
] as const;


const api = {
    send(channel: typeof validSendChannels[number], ...args: any[]) {
        if(!validSendChannels.includes(channel)) return;
        ipcRenderer.send(channel, ...args);
    },
    on(channel: typeof validOnChannels[number], callback: (event: IpcRendererEvent, ...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        ipcRenderer.on(channel, callback);
    },
    off(channel: typeof validOnChannels[number], callback: (...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        ipcRenderer.off(channel, callback);
    }
};

contextBridge.exposeInMainWorld("api", api);