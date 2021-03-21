import Sqlite from "better-sqlite3";
import path from "path";
import { UserFactory } from "./models/user";
import { NoteFactory } from "./models/note";
import { FoodFactory } from "./models/food";

export const database = new Sqlite(path.join(__dirname, "database.sqlite"), { verbose: console.log });
database.pragma("synchronous = 1");
database.pragma("journal_mode = wal");
database.pragma("foreign_keys = 1");

export function testConnection() {
    const result = database.prepare("SELECT 1+1 as test;").get();
    if(result && result["test"] === 2) console.log("Connection estableshed successfuly!");
    else console.error(new Error("Something went wrong while testing database connection!"));
}

export default {
    database,
    testConnection
};

export const User = UserFactory.define(database);
export const Note = NoteFactory.define(database);
export const Food = FoodFactory.define(database);