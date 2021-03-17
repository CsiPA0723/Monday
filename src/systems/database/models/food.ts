import { DataTypes, ModelAttributes } from "../types";

export interface FoodAttributes {
    id: number;
    name: string;
    amount: string;
    calories: number;
    fat: number;
    carbonhydrate: number;
    protein: number;
    createdAt: Date;
    updatedAt: Date;
};

export const FoodModel: ModelAttributes<FoodAttributes> = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    amount: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fat: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carbonhydrate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    protein: {
        type: DataTypes.INTEGER,
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