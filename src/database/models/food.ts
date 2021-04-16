import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";
import { UserFactory } from "./user";

type FoodAttributes = {
    id: number;
    user_id: string;
    name: string;
    amount: string;
    kcal: number;
    fats: number;
    carbs: number;
    proteins: number;
};

export type FoodStatic = BuildStatic<FoodAttributes>;

class FoodModel extends Model<FoodAttributes> {
    public readonly tableName = "foods";
    public readonly model: ModelAttributes<FoodAttributes> = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: {
                table: UserFactory.tableName,
                foreignKey: nameof(UserFactory.model.id)
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kcal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        carbs: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        proteins: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };
}

export const FoodFactory = new FoodModel();
