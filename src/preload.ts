import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import "./components/Headbar/preload";

declare global { interface Window { api: typeof api } };

const validChannels = [
    "authenticate",
    "authenticated",
    "registerUser",
    "tryRememberMe",
    "logout",

    "getUsername",
    "setUsername",
    "setPassword",

    "getUserSettings",
    "setUserSettings",
    "setActiveUser",

    "setNotes",
    "getNotes",

    "getSuggestedFoods",
    "getSelectedFood",
    "getFood",
    "setFood",
] as const;


const api = {
    send(channel: typeof validChannels[number], ...args: any[]) {
        if(!validChannels.includes(channel)) return;
        ipcRenderer.send(channel, ...args);
    },
    on(channel: typeof validChannels[number], listener: (...args: any[]) => void) {
        if(!validChannels.includes(channel)) return;
        // deliberately protect `event` as it includes `sender`
        const subscription = (_event: IpcRendererEvent, ...args: any[]) => listener(...args);
        ipcRenderer.on(channel, subscription);
        return () => {
            ipcRenderer.removeListener(channel, subscription);
        }
    }
};

contextBridge.exposeInMainWorld("api", api);