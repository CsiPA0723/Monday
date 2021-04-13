import { UserSettingsStatic } from "../database/models/user_settings"

type BasicViewProps = {
    userId: string;
    userSettings: UserSettingsStatic;
}

export default BasicViewProps;