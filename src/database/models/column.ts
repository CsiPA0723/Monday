import { BuildStatic, DataTypes, Model, ModelAttributes } from "../BasicModel";
import { UserFactory } from "./user";

type ColumnAttributes = {
    id: string;
    user_id: string;
    title: string;
    id_order: string;
};

export type ColumnStatic = BuildStatic<ColumnAttributes>;

class ColumnModel extends Model<ColumnAttributes> {
    public tableName: string = "columns";
    public model: ModelAttributes<ColumnAttributes> = {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUIDV4,
            references: {
                table: UserFactory.tableName,
                foreignKey: nameof(UserFactory.model.id)
            },
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_order: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };
}

export const ColumnFactory = new ColumnModel();
