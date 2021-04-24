import React, { useState } from 'react';
import "../../assets/scss/settings.scss";
import { UserSettingsStatic } from "../../database/models/user_settings";
import formatDate from "../../utils/formatDate";
import BasicViewProps from "../BasicViewProps";
import DisplayName from "./components/DisplayName";
import Password from "./components/Password";
import Username from "./components/Username";

function Settings({ userId, userSettings }: BasicViewProps) {
  const [settings, setSettings] = useState<UserSettingsStatic>(userSettings||{
    id: userId,
    name: null,
    createdAt: formatDate(),
    updatedAt: formatDate()
  });
  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="category">
        <h2>Application</h2>
        <hr/>
        <div className="fields">
          <DisplayName
            name={settings && settings.name ? settings.name : ""}
            onSet={name => {
              const newState: UserSettingsStatic = { ...settings, name: name };
              setSettings(newState);
              window.api.send("setUserSettings", newState);
            }}
          />
        </div>
      </div>
      <div className="category">
        <h2>User</h2>
        <hr/>
        <div className="fields">
          <Username userId={userId}/>
          <Password userId={userId}/>
        </div>
      </div>
    </div>
  );
}

export default Settings;
