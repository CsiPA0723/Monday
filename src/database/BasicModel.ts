import Sqlite from "better-sqlite3";
import buildColumnsFrom from "../utils/buildColumnsFrom";
import buildUpdateSetsFrom from "../utils/buildUpdateSetsFrom";
import buildUpsertSetsFrom from "../utils/buildUpsertSetsFrom";
import buildWhereClauseFrom from "../utils/buildWhereClauseFrom";

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
        };
    }
};

export type BuildStatic<Attributes> = Attributes & BasicAttributes;

type BasicAttributes = {
    createdAt: string;
    updatedAt: string;
};

const BasicModel: ModelAttributes<BasicAttributes> = {
    createdAt: {
        type: DataTypes.DATETIME,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATETIME,
        allowNull: false
    }
};

type MustAtUpdate = { id: string | number, updatedAt: string; };
type CustomPartial<T> = Omit<BuildStatic<T>, keyof Omit<BuildStatic<T>, keyof MustAtUpdate>> & Partial<Omit<BuildStatic<T>, keyof MustAtUpdate>>;

type PartialNulls<T> = {
    [P in keyof T]+?: null;
};

export abstract class Model<Attributes> {
    public abstract tableName: string;
    public abstract model: ModelAttributes<Attributes>;

    public database: Sqlite.Database;

    private isNotDefined = true;

    public findByPk(primaryKey: string | number): BuildStatic<Attributes> {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        return this.database.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?;`).get(primaryKey);
    }

    public deleteByPk(primaryKey: string | number): any {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        return this.database.prepare(`DELETE FROM ${this.tableName} WHERE id = ?;`).run(primaryKey);
    }

    /** @param whereClause - `[{foo: foo}, "AND", {bar: bar}, "OR", {fooBar: foo.bar}]` */
    public find(whereClause: Array<Partial<Attributes> | "OR" | "AND" | "NOT">): BuildStatic<Attributes> {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        const { data, whereString } = buildWhereClauseFrom(whereClause);
        const stmtString = `SELECT * FROM ${this.tableName} WHERE ${whereString};`;
        const stmt = this.database.prepare(stmtString);
        return stmt.get(data);
    }

    /** @param whereClause - `[{foo: foo}, "AND", {bar: bar}, "OR", {fooBar: foo.bar}]` */
    public findAll(whereClause: Array<Partial<Attributes> | "OR" | "AND" | "NOT">): BuildStatic<Attributes>[] {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        const { data, whereString } = buildWhereClauseFrom(whereClause);
        const stmtString = `SELECT * FROM ${this.tableName} WHERE ${whereString};`;
        const stmt = this.database.prepare(stmtString);
        return stmt.all(data);
    }

    public create(data: BuildStatic<Attributes>) {
        const propNames = Object.getOwnPropertyNames(data);
        const stmtString = `INSERT INTO ${this.tableName} (${propNames.join(", ")}) VALUES (@${propNames.join(", @")});`;
        const stmt = this.database.prepare(stmtString);
        return { runResult: stmt.run(data), object: data };
    };

    /**
     * @param data - Every field must have a value or set to null.
     * - Like: `{ id: foo.id, bar: null }`
     * @param excludeData - Set fields to null to exclude them from updating
     *  - Defaults to `{}`
     */
    public upsert(data: BuildStatic<Attributes>, excludeData?: PartialNulls<BuildStatic<Attributes>>) {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        const propNames = Object.getOwnPropertyNames(data);

        const dataHasUserId = data.hasOwnProperty("userId");

        const updateData: PartialNulls<CustomPartial<Attributes> | MustAtUpdate> = {
            ...data,
            // Exclude fields in the update statement by setting them to null
            ...excludeData,
            ...dataHasUserId ? { userId: null } : {},
            id: null,
            createdAt: null
        };
        const stmtString = `
            INSERT INTO ${this.tableName} (${propNames}) VALUES (@${propNames.join(", @")})
            ON CONFLICT (id) DO UPDATE SET ${buildUpsertSetsFrom(updateData)} ${dataHasUserId ? "WHERE userId = @userId" : ""};
        `.replace(/(\s{2,})|(\t{1,})/g, " ").trim();
        const stmt = this.database.prepare(stmtString);
        return stmt.run(data);
    }

    public update(data: CustomPartial<Attributes> | MustAtUpdate, userId?: string) {
        if(this.isNotDefined) throw new Error("Model is not defined!");
        const { id, ...restData } = (data as MustAtUpdate);
        const userIdCheck = userId ? `AND userId = ?` : "";
        const stmt = this.database.prepare(`UPDATE ${this.tableName} SET ${buildUpdateSetsFrom(restData)} WHERE id = ? ${userIdCheck};`);
        return userId ? stmt.run(restData, id, userId) : stmt.run(restData, id);
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
}