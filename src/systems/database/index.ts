import Sqlite from "better-sqlite3";
import path from "path";
import { UserAttributes, UserFactory } from "./models/user";
import { NoteAttributes, NoteFactory } from "./models/note";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import formatDate from "../../utils/formatDate";

export const database = new Sqlite(path.join(__dirname, "database.sqlite"), { verbose: console.log });
database.pragma("synchronous = 1");
database.pragma("journal_mode = wal");
database.pragma("foreign_keys = 1");

UserFactory(database);
NoteFactory(database);

export function testConnection() {
    const stmt = database.prepare("SELECT 1+1 as test;").get();
    if(stmt && stmt["test"] === 2) console.log("Connection estableshed successfuly!");
    else console.error(new Error("Something went wrong while testing database connection!"));
}

createUser("Test", "asd", false);

export function createUser(username: string, password: string, rememberMe: boolean) {
    const id = uuidv4();
    const user = {
        id: id,
        username: username,
        password: crypto.pbkdf2Sync(password, id, 1000, 512, "sha512"),
        rememberMe: rememberMe ? 1 : 0,
        createdAt: formatDate(),
        updatedAt: formatDate()
    };
    const stmt = database.prepare("INSERT INTO users VALUES (@id, @username, @password, @rememberMe, @createdAt, @updatedAt);");
    return stmt.run(user);
}

export function getDataByPk(tableName: "users", primaryKey: string): UserAttributes
export function getDataByPk(tableName: "notes", primaryKey: string): NoteAttributes
export function getDataByPk(tableName: string, primaryKey: string): any {
    return database.prepare("SELECT * FROM ? WHERE id = ?;").get(tableName, primaryKey);
}

export function deleteDataByPk(tableName: "users", primaryKey: string): Sqlite.RunResult;
export function deleteDataByPk(tableName: "notes", primaryKey: string): Sqlite.RunResult;
export function deleteDataByPk(tableName: string, primaryKey: string): any {
    return database.prepare("DELETE FROM ? WHERE id = ?;").run(tableName, primaryKey);
}

export default {
    database,
    testConnection
};
