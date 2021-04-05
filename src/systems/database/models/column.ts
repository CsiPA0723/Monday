import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import formatDate from "../../../utils/formatDate";
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
    
    public create(userId: string, name: string) {
        const column: ColumnStatic = {
            id: `${name.toLowerCase()}-${formatDate()}`,
            userId: userId,
            title: capitalizeFirstLetter(name),
            idOrder: "",
            createdAt: formatDate(),
            updatedAt: formatDate()
        };
        const propNames = Object.getOwnPropertyNames(column);
        const string = `INSERT INTO ${this.tableName} VALUES (@${propNames.join(", @")});`;
        const stmt = this.database.prepare(string);
        stmt.run(column);
        return column;
    }
}

export const ColumnFactory = new ColumnModel();
