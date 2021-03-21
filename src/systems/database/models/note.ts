import { BuildStatic, DataTypes, Model } from "../datatypes";

type NoteAttributes = {
    id: string;
    userId: string;
    data: JSON;
    type: string;
}

export type NoteStatic = BuildStatic<NoteAttributes>;

class NoteModel extends Model<NoteAttributes> {
    public readonly tableName = "notes";
    public readonly model = {
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
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };
    
    public create() {
       throw new Error("Not implemented yet!");
    }
}

export const NoteFactory = new NoteModel();
