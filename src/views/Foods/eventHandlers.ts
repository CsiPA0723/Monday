import { dialog, ipcMain } from "electron";
import { Food } from "../../database";

ipcMain.on("getFood", async (event, userId: string) => {
    try {
        const foods = Food.findAll([{user_id: userId}]);
        event.reply("getFood", foods ? foods : []);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});

ipcMain.on("setFood", async (event) => {
    try {
        
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});