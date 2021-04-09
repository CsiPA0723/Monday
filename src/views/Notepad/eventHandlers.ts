import { dialog, ipcMain } from "electron";
import { noteTypesEnum } from "../../components/Note";
import { Column, Note } from "../../systems/database";
import formatDate from "../../utils/formatDate";

import { notesData } from "./";

ipcMain.on("getNotes", (event, date: string, userId: string) => {
    try {
        const data: notesData = {
            columns: {},
            columnOrder: []
        };
        
        const column = Column.findByPk(`notes-${date}_${userId}`);
        if(!column) return event.reply("getNotes", JSON.stringify(data));
        const notes = Note.findAll([{columnId: column.id}]);
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

ipcMain.on("setNotes", (_, data: notesData, userId: string) => {
    try {
        for (const columnId in data.columns) {
            if (data.columns.hasOwnProperty(columnId)) {
                const column = data.columns[columnId];
                Column.upsert({
                    id: columnId,
                    title: column.title,
                    idOrder: column.idOrder.join(","),
                    userId: userId,
                    updatedAt: formatDate(),
                    createdAt: formatDate()
                });
                
                //INSERTING OR UPDATING
                const dbNotes = Note.findAll([{columnId: column.id}]);
                for (const rowId in column.rows) {
                    if(column.rows.hasOwnProperty(rowId)) {
                        const row = column.rows[rowId];
                        const dbNoteIndex = dbNotes.findIndex(n => n.noteId === rowId);

                        Note.upsert({
                            id: dbNoteIndex > -1 ? dbNotes[dbNoteIndex].id : null,
                            columnId: column.id,
                            noteId: row.id,
                            text: row.text,
                            type: row.type,
                            userId: userId,
                            updatedAt: formatDate(),
                            createdAt: formatDate()
                        });

                        if(dbNoteIndex > -1)dbNotes.splice(dbNoteIndex, 1);
                    }
                }
                //DELETING REMAINDER
                for (const dbNote of dbNotes) Note.deleteByPk(dbNote.id);

                //DELETE COLUMN IF NO ROWS ARE PRESENT
                if(column.idOrder.length === 0) Column.deleteByPk(column.id);
            }
        }
    } catch (error) {
        dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
    }
});