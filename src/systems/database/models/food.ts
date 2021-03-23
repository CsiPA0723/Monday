import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";

type FoodAttributes = {
    id: number;
    name: string;
    amount: string;
    calories: number;
    fat: number;
    carbonhydrate: number;
    protein: number;
};

export type FoodStatic = BuildStatic<FoodAttributes>;

class FoodModel extends Model<FoodAttributes> {
    public readonly tableName = "foods";
    public readonly model = <ModelAttributes<FoodAttributes>>{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.STRING,
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
        }
    };
    
    public create() {
       throw new Error("Not implemented yet!");
    }
}

export const FoodFactory = new FoodModel();
