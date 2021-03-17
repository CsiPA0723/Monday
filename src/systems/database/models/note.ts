import { DataTypes, ModelAttributes } from "../types";

export interface NoteAttributes {
    id: string;
    userId: string;
    data: JSON;
    createdAt: Date;
    updatedAt: Date;
}

export const NoteModel: ModelAttributes = {
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