import Sqlite from "better-sqlite3";
import buildColumnsFrom from "../../utils/buildColumnsFrom";
import buildUpdateSetsFrom from "../../utils/buildUpdateSetsFrom";

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

type MustAtUpdate = { id:string|number, updatedAt: string };
type MakeSomePartials<T> = Omit<BuildStatic<T>, keyof Omit<BuildStatic<T>, keyof MustAtUpdate>> & Partial<Omit<BuildStatic<T>, keyof MustAtUpdate>>;

export abstract class Model<T> {
    public abstract tableName: string;
    public abstract model: ModelAttributes<T>;

    public database: Sqlite.Database;

    private isNotDefined = true;

    public findByPk(primaryKey: string | number): BuildStatic<T> {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        return this.database.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?;`).get(primaryKey);
    }

    public deleteByPk(primaryKey: string): any {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        return this.database.prepare(`DELETE FROM ${this.tableName} WHERE id = ?;`).run(primaryKey);
    }

    public find(whereCause: Array<any>) {
        if(this.isNotDefined) throw new Error("Model is not defined!");

    }

    public update(data: MakeSomePartials<T>|MustAtUpdate): any {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        const { id, ...restData } = (data as MustAtUpdate);
        const stmt = this.database.prepare(`UPDATE ${this.tableName} SET ${buildUpdateSetsFrom(restData)} WHERE id = ?;`);
        return stmt.run(restData, id);
    }

    public define(database: Sqlite.Database) {
        if(!this.isNotDefined) throw new Error("Model alredy defined!");
        this.database = database;
        Object.assign(this.model, BasicModel);

        const Table = database.prepare(`SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = '${this.tableName}';`).get();
        if(!Table['count(*)']) database.prepare(`CREATE TABLE ${this.tableName} (${buildColumnsFrom(this.model).join(', ')});`).run();

        this.isNotDefined = false;
        return this;
    }

    public abstract create(...args: any[]): any;
}