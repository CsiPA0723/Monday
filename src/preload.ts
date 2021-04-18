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

    "getSuggestedFoods",
    "getSelectedFood",
    "getFood",
    "setFood"
] as const;

const validOnChannels = [
    "authenticated",
    "registerUser",

    "getUserSettings",

    "getNotes",

    "getSuggestedFoods",
    "getSelectedFood",
    "getFood",
    "setFood"
] as const;


const api = {
    send(channel: typeof validSendChannels[number], ...args: any[]) {
        if(!validSendChannels.includes(channel)) return;
        ipcRenderer.send(channel, ...args);
    },
    on(channel: typeof validOnChannels[number], listener: (...args: any[]) => void) {
        if(!validOnChannels.includes(channel)) return;
        // deliberately protect `event` as it includes `sender`
        const subscription = (_: IpcRendererEvent, ...args: any[]) => listener(...args);
        ipcRenderer.on(channel, subscription);
        return () => {
            ipcRenderer.removeListener(channel, subscription);
        }
    }
};

contextBridge.exposeInMainWorld("api", api);