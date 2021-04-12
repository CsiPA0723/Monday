import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";

type EatenAttributes = {
    id: number;
    name: string;
    amount: string;
    columnId: string;
};

export type EatenStatic = BuildStatic<EatenAttributes>;

class EatenModel extends Model<EatenAttributes> {
    public readonly tableName = "foods";
    public readonly model = <ModelAttributes<EatenAttributes>>{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                foreignKey: "name",
                table: "food"
            }
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        columnId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                foreignKey: "id",
                table: "columns"
            }
        }
    };
}

export const EatenFactory = new EatenModel();
