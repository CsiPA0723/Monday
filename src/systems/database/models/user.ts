import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import formatDate from "../../../utils/formatDate";
import randomBackupCode from "../../../utils/randomBackupCode";

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
    
    public create(username: string, password: string, rememberMe?: boolean) {
        const id = uuidv4();
        const user: UserStatic = {
            id: id,
            username: username,
            password: crypto.pbkdf2Sync(password, id, 1000, 512, "sha512"),
            rememberMe: rememberMe ? 1 : 0,
            backupCode: randomBackupCode(),
            createdAt: formatDate(),
            updatedAt: formatDate()
        };
        const stmt = this.database.prepare(`INSERT INTO users VALUES (@${Object.getOwnPropertyNames(user).join(", @")});`);
        stmt.run(user);
        return user;
    }
}

export const UserFactory = new UserModel();