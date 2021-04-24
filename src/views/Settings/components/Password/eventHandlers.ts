import { BrowserWindow, dialog, ipcMain } from "electron";
import { User } from "../../../../database";
import crypto from "crypto";
import formatDate from "../../../../utils/formatDate";

ipcMain.on("setPassword", (event, userId: string, oldPassword: string, newPassword: string) => {
  try {
    const user = User.findByPk(userId);
    if(!user) {
      dialog.showErrorBox("User", "User not found!");
      return event.reply("setPassword");
    }
    const key = crypto.pbkdf2Sync(oldPassword, userId, 1000, 512, "sha512");
    const testOldPassword = user.password.toString() === key.toString();
    if(!testOldPassword) {
      dialog.showErrorBox("OLD Password", "Old password did not match!");
      return event.reply("setPassword");
    }
    User.update({
      id: userId,
      password: crypto.pbkdf2Sync(newPassword, userId, 1000, 512, "sha512"),
      updatedAt: formatDate()
    });
    dialog.showMessageBox(BrowserWindow.fromId(event.sender.id), {
      title: "SUCCESS",
      type: "info",
      message: "New Password successfully setted!"
  });
    event.reply("setPassword");
  } catch (error) {
      dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
  }
});