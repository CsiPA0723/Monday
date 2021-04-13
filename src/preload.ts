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

    "setNotes",
    "getNotes",

    "getFood",
    "setFood"
] as const;

const validOnChannels = [
    "authenticated",
    "registerUser",

    "getUserSettings",

    "getNotes",

    "getFood"
] as const;


const api = {
    send(channel: typeof validSendChannels[number], ...args: any[]) {
        if(!validSendChannels.includes(channel)) return;
        ipcRenderer.send(channel, ...args);
    },
    on(channel: typeof validOnChannels[number], listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        ipcRenderer.on(channel, listener);
    },
    off(channel: typeof validOnChannels[number], listener: (...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        ipcRenderer.off(channel, listener);
    }
};

contextBridge.exposeInMainWorld("api", api);