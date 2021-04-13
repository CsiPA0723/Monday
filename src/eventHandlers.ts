import { dialog, ipcMain } from "electron";
import { User, UserSettings } from "./database";
import { UserSettingsStatic } from "./database/models/user_settings";

import "./components/Headbar/eventHandlers";
import "./views/Login/eventHandlers";
import "./views/Notepad/eventHandlers";

let activeUserUUID: string = null;

ipcMain.on("getActiveUser", async (event) => {
    try {
        const user = User.findByPk(activeUserUUID);
        if(!user) throw new Error("Active user cannot be found inside database");
        event.reply("getActiveUser", user);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.message);
    }
});

ipcMain.on("setActiveUser", async (_, userUUID: string) => {
    activeUserUUID = userUUID;
});

ipcMain.on("getUserSettings", async (event) => {
    try {
        const userSettings = UserSettings.findByPk(activeUserUUID);
        event.reply("getUserSettings", userSettings);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});

ipcMain.on("setUserSettings", async (_, userSettings: UserSettingsStatic) => {
    try {
        UserSettings.update(userSettings);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});