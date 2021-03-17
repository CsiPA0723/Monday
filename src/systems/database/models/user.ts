import { DataTypes, ModelAttributes } from "../types";
import Sqlite from "better-sqlite3";
import getTableCreateString from "../../../utils/getTableCreateString";

export interface UserAttributes {
    id: string;
    username: string;
    password: Buffer;
    rememberMe: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const UserModel: ModelAttributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    rememberMe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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


export function UserFactory(database: Sqlite.Database) {
    const Table = database.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'users';").get();
    
    if(!Table['count(*)']) {
        database.prepare(`CREATE TABLE users (${getTableCreateString(UserModel).join(', ')});`).run();
    }
}