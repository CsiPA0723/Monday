import { dialog, ipcMain, BrowserWindow } from "electron";
import { User } from "../../systems/database";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import formatDate from "../../utils/formatDate";
import randomBackupCode from "../../utils/randomBackupCode";

ipcMain.on("authenticate", (event, username: string, password: string, rememberMe: number) => {
    try {
        const user = User.find([{username}]);
        if(!user) return dialog.showErrorBox("Login Failed", "Username or Password not matching!");
        const key = crypto.pbkdf2Sync(password, user.id, 1000, 512, "sha512");
        if(key.toLocaleString() === user.password.toLocaleString()) {
            if(user.remember_me !== rememberMe) {
                user.remember_me = rememberMe;
                User.update({
                    id: user.id,
                    updatedAt: formatDate(),
                    remember_me: rememberMe ? 1 : 0
                });
            }
            event.reply("authenticated", user.id);
        } else return dialog.showErrorBox("Login Failed", "Username or Password not matching!");
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});

ipcMain.on("tryRememberMe", (event) => {
    try {
        const user = User.find([{remember_me: 1}]);
        if(!user) return;
        event.reply("authenticated", user.id);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    };
});

ipcMain.on("registerUser", (event, username: string, password: string) => {
    try {
        const user = User.find([{username}]);
        if(user) return dialog.showErrorBox("Error", "Username is already in use!");
        if(!username || username.length === 0) return dialog.showErrorBox("Missing params", "Username cannot be empty!");
        if(!password || password.length === 0) return dialog.showErrorBox("Missing params", "Password cannot be empty!");
        const id = uuidv4();
        User.create({
            id: id,
            username: username,
            password: crypto.pbkdf2Sync(password, id, 1000, 512, "sha512"),
            remember_me: 0,
            backupCode: randomBackupCode(),
            createdAt: formatDate(),
            updatedAt: formatDate()
        });
        event.reply("registerUser");
        dialog.showMessageBox(BrowserWindow.fromId(event.sender.id), {
            title: "SUCCESS",
            type: "info" ,
            message: "Now try to log in!"
        });
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});
