import Sqlite from "better-sqlite3";
import path from "path";
import { UserFactory } from "./models/user";
import { UserSettingsFactory } from "./models/user_settings";
import { NoteFactory } from "./models/note";
import { FoodFactory } from "./models/food";
import { ColumnFactory } from "./models/column";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import randomBackupCode from "../../utils/randomBackupCode";
import formatDate from "../../utils/formatDate";

const isDebug = process.argv.some(v => /--debug/.test(v)); // npm run debug

export const database = new Sqlite(path.join(__dirname, "database.sqlite"), { verbose: isDebug ? console.log : null });
database.pragma("synchronous = 1");
database.pragma("journal_mode = wal");
database.pragma("foreign_keys = 1");

export const User = UserFactory.define(database);
export const UserSettings = UserSettingsFactory.define(database);
export const Note = NoteFactory.define(database);
export const Column = ColumnFactory.define(database);
export const Food = FoodFactory.define(database);

export function debug() {
    const id = uuidv4();
    const user = User.create({
        id: id,
        username: "Test",
        password: crypto.pbkdf2Sync("asd", id, 1000, 512, "sha512"),
        remember_me: 0,
        backupCode: randomBackupCode(),
        createdAt: formatDate(),
        updatedAt: formatDate()
    }).object;
    const column = Column.create({
        id: `notes-${formatDate()}_${user.id}`,
        id_order: "",
        title: "notes",
        user_id: user.id,
        updatedAt: formatDate(),
        createdAt: formatDate()
    }).object;
    Note.create({ 
        id: null,
        user_id: user.id,
        column_id: column.id,
        note_id: "note-0",
        data: "Test1",
        type: "head",
        updatedAt: formatDate(),
        createdAt: formatDate() 
    });
    for (let i = 1; i <= 3; i++) {
        Note.create({
            id: null,
            user_id: user.id,
            column_id: column.id,
            note_id: `note-${i}`,
            data: "Testing",
            type: "note",
            updatedAt: formatDate(),
            createdAt: formatDate()
        });
    }

    Column.update({
        id: column.id,
        id_order: ["note-0", "note-1", "note-2", "note-3"].join(","),
        updatedAt: formatDate()
    });

    const id1 = uuidv4();
    const user1 = User.create({
        id: id1,
        username: "Test1",
        password: crypto.pbkdf2Sync("asd", id1, 1000, 512, "sha512"),
        remember_me: 0,
        backupCode: randomBackupCode(),
        createdAt: formatDate(),
        updatedAt: formatDate()
    }).object;
    const column1 = Column.create({
        id: `notes-${formatDate()}_${user1.id}`,
        id_order: "",
        title: "notes",
        user_id: user1.id,
        updatedAt: formatDate(),
        createdAt: formatDate()
    }).object;
    Note.create({ 
        id: null,
        user_id: user1.id,
        column_id: column1.id,
        note_id: "note-0",
        data: "Test1",
        type: "head",
        updatedAt: formatDate(),
        createdAt: formatDate() 
    });

    Column.update({
        id: column1.id,
        id_order: ["note-0"].join(","),
        updatedAt: formatDate()
    });
}

export default {
    database,
    debug
};