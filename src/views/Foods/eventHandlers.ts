import { dialog, ipcMain } from "electron";
import { Food } from "../../database";
import { FoodStatic } from "../../database/models/food";

ipcMain.on("getFood", async (event, userId: string) => {
    try {
        const foods = Food.findAll([{user_id: userId}]);
        event.reply("getFood", foods ? foods : []);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});

ipcMain.on("setFood", async (event, food: FoodStatic) => {
    try {
        if(food.id && food.name.length === 0 && Food.findByPk(food.id)) {
           Food.deleteByPk(food.id);
           return event.reply("setFood");
        } else Food.upsert(food);
        event.reply("setFood");
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});