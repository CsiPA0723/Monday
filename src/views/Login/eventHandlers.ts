import { dialog, ipcMain, BrowserWindow } from "electron";
import { database, User } from "../../systems/database";
import { UserStatic } from "../../systems/database/models/user";
import crypto from "crypto";
import formatDate from "../../utils/formatDate";

ipcMain.on("authenticate", (event, username: string, password: string, rememberMe: number) => {
    try {
        const users = <UserStatic[]>database.prepare("SELECT * FROM users WHERE username = ?;").all(username);
        for (const user of users) {
            const key = crypto.pbkdf2Sync(password, user.id, 1000, 512, "sha512");
            if(key.toLocaleString() === user.password.toLocaleString()) {
                if(user.rememberMe !== rememberMe) {
                    user.rememberMe = rememberMe;
                    User.update({
                        id: user.id,
                        updatedAt: formatDate(),
                        rememberMe: rememberMe ? 1 : 0
                    });
                }
                
                ipcMain.emit("setActiveUser", user.id);
                return event.reply("authenticated", true);
            }
        }
        dialog.showErrorBox("ERROR", "Username or Password not matching!");
    } catch (error) {
        console.log(error);
    }
});

ipcMain.on("tryRememberMe", (event) => {
    try {
        const user = <UserStatic>database.prepare("SELECT * FROM users WHERE rememberMe = ?").get(1);
        if(!user) return;
        ipcMain.emit("setActiveUser", user.id);
        event.reply("authenticated", true);
    } catch (error) {
        console.log(error);
    };
});

ipcMain.on("registerUser", (event, username: string, password: string) => {
    try {
        const user = <UserStatic|null>database.prepare("SELECT * FROM users WHERE username = ?;").get(username);
        if(user) return dialog.showErrorBox("Error", "Username is already in use!");
        if(!username || username.length === 0) return dialog.showErrorBox("ERROR", "Username cannot be empty!");
        if(!password || password.length === 0) return dialog.showErrorBox("ERROR", "Password cannot be empty!");
        
        User.create(username, password);
        event.reply("registerUser");
        dialog.showMessageBox(BrowserWindow.fromId(event.sender.id), {
            title: "SUCCESS",
            type: "info" ,
            message: "Now try to log in!"
        });
    } catch (error) {
        console.error(error);
    }
});