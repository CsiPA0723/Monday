import { dialog, ipcMain } from "electron";
import { User, UserSettings } from "./systems/database";
import { UserSettingsStatic } from "./systems/database/models/user_settings";

import "./views/Login/eventHandlers";
import "./components/Headbar/eventHandlers";

let activeUserUUID: string = null;

ipcMain.on("getActiveUser", async (event) => {
    try {
        console.log("getActiveUser", activeUserUUID);
        const user = User.findByPk(activeUserUUID);
        if(!user) throw new Error("Active user cannot be found inside database");
        event.reply("getActiveUser", user);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.message);
    }
});

ipcMain.on("setActiveUser", async (_, userUUID: string) => {
    activeUserUUID = userUUID;
    console.log("setActiveUser", userUUID);
});

ipcMain.on("getUserSettings", async (event) => {
    try {
        console.log("getUserSettings", activeUserUUID);
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