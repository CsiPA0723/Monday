import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";
import { ColumnFactory } from "./column";
import { UserFactory } from "./user";

type NoteAttributes = {
    id: number;
    user_id: string;
    column_id: string;
    note_id: string;
    type: string;
    data: string;
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
        user_id: {
            type: DataTypes.UUIDV4,
            references: {
                table: UserFactory.tableName,
                foreignKey: nameof(UserFactory.model.id)
            },
            allowNull: false,
        },
        column_id: {
            type: DataTypes.STRING,
            references: {
                table: ColumnFactory.tableName,
                foreignKey: nameof(ColumnFactory.model.id)
            },
            allowNull: false
        },
        note_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    };
}

export const NoteFactory = new NoteModel();
