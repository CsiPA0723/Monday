import Sqlite from "better-sqlite3";
import buildColumnsFrom from "../../utils/buildColumnsFrom";

export enum DataTypes {
    BOOLEAN = "INTEGER",
    BUFFER = "BLOB",
    DATETIME = "TEXT",
    INTEGER = "INTEGER",
    JSON = "TEXT",
    NUMBER = "REAL",
    STRING = "TEXT",
    UUIDV4 = "TEXT"
};

export type ModelAttributes<T> = {
    [Property in keyof T]: {
        type: DataTypes;
        primaryKey?: boolean;
        allowNull?: boolean;
        defaultValue?: unknown;
        autoIncrement?: boolean;
        unique?: boolean;
        references?: {
            table: string,
            foreignKey: string,
        }
    }
}

export type BuildStatic<T> = T & BasicAttributes;

type BasicAttributes = {
    createdAt: string;
    updatedAt: string;
}

const BasicModel: ModelAttributes<BasicAttributes> = {
    createdAt: {
        type: DataTypes.DATETIME,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATETIME,
        allowNull: false
    }
}

export abstract class Model<T> {
    public abstract tableName: string;
    public abstract model: ModelAttributes<T>;

    public database: Sqlite.Database;

    private isNotDefined = true;

    public findByPk(primaryKey: string | number) {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        return this.database.prepare("SELECT * FROM ? WHERE id = ?;").get(this.tableName, primaryKey);
    }

    public deleteByPk(tableName: string, primaryKey: string): any {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        return this.database.prepare("DELETE FROM ? WHERE id = ?;").run(tableName, primaryKey);
    }

    public define(database: Sqlite.Database) {
        if(!this.isNotDefined) return;
        this.database = database;
        Object.assign(this.model, BasicModel);

        const Table = database.prepare(`SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = '${this.tableName}';`).get();
        if(!Table['count(*)']) database.prepare(`CREATE TABLE ${this.tableName} (${buildColumnsFrom(this.model).join(', ')});`).run();

        this.isNotDefined = false;
        return this;
    }
}