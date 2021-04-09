import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";

type ColumnAttributes = {
    id: string;
    userId: string;
    title: string;
    idOrder: string;
};

export type ColumnStatic = BuildStatic<ColumnAttributes>;

class ColumnModel extends Model<ColumnAttributes> {
    public tableName: string = "columns";
    public model: ModelAttributes<ColumnAttributes> = {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUIDV4,
            references: {
                table: "users",
                foreignKey: "id"
            },
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idOrder: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };
}

export const ColumnFactory = new ColumnModel();
