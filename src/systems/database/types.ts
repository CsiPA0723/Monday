export enum DataTypes {
    UUIDV4 = "UUIDV4",
    TEXT = "TEXT",
    BOOLEAN = "INTEGER",
    JSON = "JSON",
    INTEGER = "INTEGER",
    DATETIME = "DATETIME",
    BLOB = "BLOB"
};

export type ModelAttributes = {
    [key: string]: {
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