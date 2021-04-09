import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";

type UserAttributes = {
    id: string;
    username: string;
    password: Buffer;
    rememberMe: number;
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
        rememberMe: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        backupCode: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    };
}

export const UserFactory = new UserModel();