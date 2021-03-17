import { DataTypes, ModelAttributes } from "../types";
import Sqlite from "better-sqlite3";
import getTableCreateString from "../../../utils/getTableCreateString";

export interface NoteAttributes {
    id: string;
    userId: string;
    data: JSON;
    createdAt: Date;
    updatedAt: Date;
}

const NoteModel: ModelAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.UUIDV4,
        references: {
            table: "users",
            foreignKey: "id"
        },
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATETIME,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATETIME,
        allowNull: false
    }
};


export function NoteFactory(database: Sqlite.Database) {
    const Table = database.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'notes';").get();
    
    if(!Table['count(*)']) {
        database.prepare(`CREATE TABLE notes (${getTableCreateString(NoteModel).join(', ')});`).run();
    }
}