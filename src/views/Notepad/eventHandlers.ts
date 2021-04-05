import { dialog, ipcMain } from "electron";
import { noteTypesEnum } from "../../components/Note";
import { Column, Note } from "../../systems/database";

import { notesData } from "./";

ipcMain.on("getNotes", (event, date: string, userId: string) => {
    try {
        const data: notesData = {
            columns: {},
            columnOrder: []
        };
        
        const column = Column.findByPk(`notes-${date}`);
        if(!column) return event.reply("getNotes", JSON.stringify(data));
        const notes = Note.getAllFrom(column.id);
        if(!notes) return event.reply("getNotes", JSON.stringify(data));

        const rows: notesData["columns"][string]["rows"] = {};
        for (const { noteId, text, type } of notes) {
            rows[noteId] = {
                id: noteId,
                text: text,
                type: noteTypesEnum[type.toUpperCase()]
            }
        }
        data.columns[column.id] = {
            id: column.id,
            idOrder: column.idOrder.split(","),
            title: column.title,
            rows: rows
        }
        data.columnOrder.push(column.id);
        event.reply("getNotes", JSON.stringify(data));
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});