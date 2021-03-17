import { ipcMain } from "electron";
import { database } from "../../systems/database";
import { UserAttributes } from "../../systems/database/models/user";
import crypto from "crypto";
import formatDate from "../../utils/formatDate";

ipcMain.on("authenticated", (event, username: string, password: string, rememberMe: boolean) => {
    try {
        const users = <UserAttributes[]>database.prepare("SELECT * FROM users WHERE username = ?;").all(username);
        for (const user of users) {
            const key = crypto.pbkdf2Sync(password, user.id, 1000, 512, "sha512");
            if(key.toLocaleString() === user.password.toLocaleString()) {
                if(user.rememberMe !== rememberMe) {
                    user.rememberMe = rememberMe;
                    const stmt = database.prepare("UPDATE users SET rememberMe = ?, updatedAt = ? WHERE id = ?");
                    stmt.run(rememberMe ? 1 : 0, formatDate(), user.id);
                }
                
                ipcMain.emit("setActiveUser", user.id);
                return event.reply("authenticated", true);
            }
        }
        event.reply("authenticated", false);
    } catch (error) {
        console.log(error);
    }
});

ipcMain.on("tryRememberMe", async (event) => {
    try {
        const user = <UserAttributes>database.prepare("SELECT * FROM users WHERE rememberMe = ?").get(1);
        if(!user) return;
        ipcMain.emit("setActiveUser", user.id);
        event.reply("authenticated", true);
    } catch (error) {
        console.log(error);
    }
});