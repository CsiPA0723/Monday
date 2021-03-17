export enum DataTypes {
    UUIDV4 = "UUIDV4",
    TEXT = "TEXT",
    BOOLEAN = "INTEGER",
    JSON = "JSON",
    INTEGER = "INTEGER",
    DATETIME = "DATETIME",
    BLOB = "BLOB"
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