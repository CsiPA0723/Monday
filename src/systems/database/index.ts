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

export const database = new Sqlite(path.join(__dirname, "database.sqlite"), { verbose: console.log });
database.pragma("synchronous = 1");
database.pragma("journal_mode = wal");
database.pragma("foreign_keys = 1");

export function testConnection() {
    const result = database.prepare("SELECT 1+1 as test;").get();
    if(result && result["test"] === 2) console.log("Connection estableshed successfuly!");
    else console.error(new Error("Something went wrong while testing database connection!"));
}

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
        rememberMe: 0,
        backupCode: randomBackupCode(),
        createdAt: formatDate(),
        updatedAt: formatDate()
    }).object;
    const column = Column.create({
        id: `notes-${formatDate()}_${user.id}`,
        idOrder: "",
        title: "notes",
        userId: user.id,
        updatedAt: formatDate(),
        createdAt: formatDate()
    }).object;
    Note.create({ 
        id: null,
        userId: user.id,
        columnId: column.id,
        noteId: "note-0",
        text: "Test1",
        type: "head",
        updatedAt: formatDate(),
        createdAt: formatDate() 
    });
    for (let i = 1; i <= 3; i++) {
        Note.create({
            id: null,
            userId: user.id,
            columnId: column.id,
            noteId: `note-${i}`,
            text: "Testing",
            type: "note",
            updatedAt: formatDate(),
            createdAt: formatDate()
        });
    }

    Column.update({
        id: column.id,
        idOrder: ["note-0", "note-1", "note-2", "note-3"].join(","),
        updatedAt: formatDate()
    });

    const id1 = uuidv4();
    const user1 = User.create({
        id: id1,
        username: "Test1",
        password: crypto.pbkdf2Sync("asd", id1, 1000, 512, "sha512"),
        rememberMe: 0,
        backupCode: randomBackupCode(),
        createdAt: formatDate(),
        updatedAt: formatDate()
    }).object;
    const column1 = Column.create({
        id: `notes-${formatDate()}_${user1.id}`,
        idOrder: "",
        title: "notes",
        userId: user1.id,
        updatedAt: formatDate(),
        createdAt: formatDate()
    }).object;
    Note.create({ 
        id: null,
        userId: user1.id,
        columnId: column1.id,
        noteId: "note-0",
        text: "Test1",
        type: "head",
        updatedAt: formatDate(),
        createdAt: formatDate() 
    });

    Column.update({
        id: column1.id,
        idOrder: ["note-0"].join(","),
        updatedAt: formatDate()
    });
}

export default {
    database,
    testConnection,
    debug
};