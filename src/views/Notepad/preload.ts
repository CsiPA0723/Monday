import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window { notepad: typeof notepad }
}

const validSendChannels = ["setNotes", "getNotes"] as const;
const validOnChannels = ["getNotes"] as const;

const notepad = {
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

contextBridge.exposeInMainWorld("notepad", notepad);
