import { dialog, ipcMain } from "electron";
import { noteTypes } from "../../components/Note";
import { Column, Note } from "../../database";
import formatDate from "../../utils/formatDate";
import noteColumnId from "../../utils/noteColumnId";

import { notesData } from "./";

ipcMain.on("getNotes", (event, date: string, userId: string) => {
    try {
        const data: notesData = {
            columns: {},
            columnOrder: []
        };
        
        const column = Column.findByPk(noteColumnId.make("notes", date, userId));
        if(!column) return event.reply("getNotes", JSON.stringify(data));
        const notes = Note.findAll([{column_id: column.id}]);
        if(!notes) return event.reply("getNotes", JSON.stringify(data));

        const rows: notesData["columns"][string]["rows"] = {};
        for (const { note_id, data, type } of notes) {
            rows[note_id] = {
                noteId: note_id,
                data: data,
                type: noteTypes[type.toUpperCase()]
            }
        }
        data.columns[column.id] = {
            id: column.id,
            idOrder: column.id_order.split(","),
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
                    id_order: column.idOrder.join(","),
                    user_id: userId,
                    updatedAt: formatDate(),
                    createdAt: formatDate()
                });
                
                //INSERTING OR UPDATING
                const dbNotes = Note.findAll([{column_id: column.id}]);
                for (const rowId in column.rows) {
                    if(column.rows.hasOwnProperty(rowId)) {
                        const row = column.rows[rowId];
                        const dbNoteIndex = dbNotes.findIndex(n => n.note_id === rowId);

                        Note.upsert({
                            id: dbNoteIndex > -1 ? dbNotes[dbNoteIndex].id : null,
                            column_id: column.id,
                            note_id: row.noteId,
                            data: row.data,
                            type: row.type,
                            user_id: userId,
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