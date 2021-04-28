import { dialog, ipcMain } from "electron";
import { User, UserSettings } from "./database";
import { UserSettingsStatic } from "./database/models/user_settings";
import formatDate from "./utils/formatDate";

import "./components/Headbar/eventHandlers";
import "./components/Food/eventHandlers";
import "./views/Login/eventHandlers";
import "./views/Home/eventHandlers";
import "./views/Notepad/eventHandlers";
import "./views/Foods/eventHandlers";
import "./views/Settings/eventHandlers";

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

ipcMain.on("setActiveUser", async (_event, userUUID: string) => {
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

ipcMain.on("setUserSettings", async (event, userSettings: UserSettingsStatic) => {
    try {
        UserSettings.upsert(userSettings);
        event.reply("setUserSettings", userSettings);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});

ipcMain.on("logout", (event) => {
    User.update({
        id: activeUserUUID,
        updatedAt: formatDate(),
        remember_me: 0
    });
    event.reply("authenticated", null);
});