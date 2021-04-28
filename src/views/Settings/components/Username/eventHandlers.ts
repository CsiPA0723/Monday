import { dialog, ipcMain } from "electron";
import { User } from "../../../../database";
import formatDate from "../../../../utils/formatDate";

ipcMain.on("getUsername", (event, userId: string) => {
  try {
    const user = User.findByPk(userId);
    if(!user) throw new Error("User not found in database");
    event.reply("getUsername", user.username);
  } catch (error) {
      dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
  }
});

ipcMain.on("setUsername", (event, userId: string, username: string, prev: string) => {
  try {
    if(!username || username && username.length === 0) {
      return event.reply("setUsername", prev);
    }
    const user = User.find([{username: username}]);
    if(user) {
      event.reply("setUsername", prev);
      if(user.id !== userId) dialog.showErrorBox("Username", "This username is alredy in use!");
      return;
    }
    if(user && user.username === username) event.reply("setUsername", prev);
    User.update({
      id: userId,
      username: username,
      updatedAt: formatDate()
    });
    event.reply("setUsername", username);
  } catch (error) {
      dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
  }
});