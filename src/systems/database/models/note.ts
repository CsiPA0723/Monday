import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";

type NoteAttributes = {
    id: number;
    userId: string;
    columnId: string;
    noteId: string;
    type: string;
    text: string;
};

export type NoteStatic = BuildStatic<NoteAttributes>;

class NoteModel extends Model<NoteAttributes> {
    public readonly tableName: string = "notes";
    public readonly model: ModelAttributes<NoteAttributes> = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUIDV4,
            references: {
                table: "users",
                foreignKey: "id",
            },
            allowNull: false,
        },
        columnId: {
            type: DataTypes.STRING,
            references: {
                table: "columns",
                foreignKey: "id",
            },
            allowNull: false
        },
        noteId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };
}

export const NoteFactory = new NoteModel();
