import { BuildStatic, DataTypes, Model, ModelAttributes } from "../datatypes";
import { UserFactory } from "./user";

type UserSettingsAttributes = {
    id: string;
    name: string;
};

export type UserSettingsStatic = BuildStatic<UserSettingsAttributes>;

class UserSettingsModel extends Model<UserSettingsAttributes> {
    public readonly tableName = "user_settings";
    public readonly model = <ModelAttributes<UserSettingsAttributes>>{
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            references: {
                table: UserFactory.tableName,
                foreignKey: nameof(UserFactory.model.id)
            }
        },
        name: { type: DataTypes.STRING }
    };
}

export const UserSettingsFactory = new UserSettingsModel();