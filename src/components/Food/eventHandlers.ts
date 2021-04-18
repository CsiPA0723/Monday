import { dialog, ipcMain } from "electron";
import { Food } from "../../database";
import { FoodStatic } from "../../database/models/food";

ipcMain.on("getSuggestedFoods", async (event, query: string) => {
    try {
        const stmtString = `SELECT * FROM ${Food.tableName} WHERE ${nameof(Food.model.name)} LIKE ?;`;
        const results = <FoodStatic[]>Food.database.prepare<string>(stmtString).all(`%${query}%`);
        event.reply("getSuggestedFoods", results);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});

ipcMain.on("getSelectedFood", async (event, foodId: number) => {
    try {
        const food = Food.findByPk(foodId);
        event.reply("getSelectedFood", food ? food : null);
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});