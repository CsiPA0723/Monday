import { BuildStatic, DataTypes, Model, ModelAttributes } from "../BasicModel";

type UserAttributes = {
    id: string;
    username: string;
    password: Buffer;
    remember_me: number;
    backupCode: string;
};

export type UserStatic = BuildStatic<UserAttributes>;

class UserModel extends Model<UserAttributes> {
    public readonly tableName = "users";
    public readonly model = <ModelAttributes<UserAttributes>>{
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.BUFFER,
            allowNull: false
        },
        remember_me: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        },
        backupCode: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    };
}

export const UserFactory = new UserModel();