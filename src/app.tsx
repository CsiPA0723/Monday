import React, { useEffect, useState } from "react";
import "./assets/scss/app.scss";

import SideBar from "./components/Sidebar";
import Content from "./components/Content"
import Login from "./views/Login";
import { UserSettingsStatic } from "./database/models/user_settings";

type Views = "Calendar"|"Home"|"Notepad"|"User";

function App() {
  const [view, setView] = useState<Views>("Home");
  const [userId, setUserId] = useState<string>();
  const [userSettings, setUserSettings] = useState<UserSettingsStatic>(null);

  useEffect(() => {
    function updateUserSettings(userSettings: UserSettingsStatic) {
      setUserSettings(userSettings);
    }

    window.api.send("getUserSettings");
    const removeGetUserSettings = window.api.on("getUserSettings", updateUserSettings);
    return () => {
      removeGetUserSettings();
    }
  }, [userId]);

  useEffect(() => {
    function setTrueAuthenticated(userUUID: string) {
      setUserId(userUUID);
      window.api.send("setActiveUser", userUUID);
    }

    window.api.send("tryRememberMe");
    const removeAuthenticated = window.api.on("authenticated", setTrueAuthenticated);
    return () => {
      if(removeAuthenticated) removeAuthenticated();
    }
  }, []);
  

  if(userId) {
    return (
      <div className="app-container">
        <SideBar view={view} setView={(viewName: Views) => setView(viewName)} />
        <Content view={view} userId={userId} userSettings={userSettings}/>
      </div>
    );
  } else return <><Login /></>;
}

export default App;