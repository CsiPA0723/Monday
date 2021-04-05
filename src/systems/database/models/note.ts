import formatDate from "../../../utils/formatDate";
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

    public create({
        userId,
        columnId,
        noteId,
        type,
        text,
    }: {
        userId: string;
        columnId: string;
        noteId: string;
        type: string;
        text: string;
    }) {
        const note: Partial<NoteStatic> = {
            userId: userId,
            columnId: columnId,
            noteId: noteId,
            type: type,
            text: text,
            createdAt: formatDate(),
            updatedAt: formatDate()
        };
        const propNames = Object.getOwnPropertyNames(note);
        const string = `INSERT INTO ${this.tableName} (${propNames.join(", ")}) VALUES (@${propNames.join(", @")});`;
        const stmt = this.database.prepare(string);
        stmt.run(note);
        return note;
    }
    /** 
     * @param columnName - `${name}-${date}` like `notes-2021-04-03`
     */
    public getAllFrom(columnName: string): NoteStatic[] {
        return this.database.prepare("SELECT notes.* FROM columns, notes WHERE columns.id = ?;").all(columnName);
    }
}

export const NoteFactory = new NoteModel();
