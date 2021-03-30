import React, { useEffect, useState } from "react";
import "./assets/scss/app.scss";

import SideBar from "./components/Sidebar";
import Content from "./components/Content"
import Login from "./views/Login";
import { UserSettingsStatic } from "./systems/database/models/user_settings";

type Views = "Calendar"|"Home"|"Notepad"|"User";

function App() {
  const [view, setView] = useState<Views>("Home");
  const [authenticated, setAuthenticated] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettingsStatic>(null);

  useEffect(() => {
    function updateUserSettings(_, userSettings: UserSettingsStatic) {
      setUserSettings(userSettings);
    }

    window.api.on("getUserSettings", updateUserSettings);
    window.api.send("getUserSettings");
    return () => {
      window.api.off("getUserSettings", updateUserSettings);
    }
  }, [authenticated]);

  useEffect(() => {
    function setTrueAuthenticated(_, userUUID: string) {
      setAuthenticated(true);
      window.api.send("setActiveUser", userUUID);
    }

    window.login.on("authenticated", setTrueAuthenticated);
    window.login.send("tryRememberMe");
    return () => {
      window.login.off("authenticated", setTrueAuthenticated);
    }
  }, []);
  

  if(authenticated) {
    return (
      <div className="app-container">
        <SideBar view={view} setView={(viewName: Views) => setView(viewName)} />
        <Content view={view} userSettings={userSettings}/>
      </div>
    );
  } else return <><Login /></>;
}

export default App;