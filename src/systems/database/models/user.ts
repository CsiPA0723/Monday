import { DataTypes, ModelAttributes } from "../types";

export interface UserAttributes {
    id: string;
    username: string;
    password: Buffer;
    rememberMe: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const UserModel: ModelAttributes<UserAttributes> = {
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