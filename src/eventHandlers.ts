import { ipcMain } from "electron";
import { User, UserSettings } from "./systems/database";
import { UserSettingsStatic } from "./systems/database/models/user_settings";

import "./views/Login/eventHandlers";
import "./components/Headbar/eventHandlers";

let activeUserUUID: string;

ipcMain.on("getActiveUser", async (event) => {
    try {
        const user = User.findByPk(activeUserUUID);
        if(!user) throw new Error("Active user cannot be found inside database");
        event.reply("getActiveUser", user);
    } catch (error) {
        console.error(error);
    }
});

ipcMain.on("setActiveUser", async (_, userUUID: string) => {
    activeUserUUID = userUUID;
});

ipcMain.on("getUserSettings", async (event) => {
    const userSettings = UserSettings.findByPk(activeUserUUID);
    event.reply("getUserSettings", userSettings);
});

ipcMain.on("setUserSettings", async (_, userSettings: UserSettingsStatic) => {

});