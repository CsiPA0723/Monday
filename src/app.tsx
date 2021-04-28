import React, { useEffect, useState } from "react";
import "./assets/scss/app.scss";
import "./assets/css/float-label.min.css" // Author: https://github.com/anydigital/float-label-css
import { UserSettingsStatic } from "./database/models/user_settings";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import SideBar from "./components/Sidebar";
import Content from "./components/Content"
import Login from "./views/Login";

type Views = "About"|"Foods"|"Home"|"Notepad"|"Settings";

function App() {
  const [view, setView] = useState<Views>("Home");
  const [userId, setUserId] = useState<string>();
  const [userSettings, setUserSettings] = useState<UserSettingsStatic>(null);

  useEffect(() => {
    function updateUserSettings(gotUserSettings: UserSettingsStatic) {
      setUserSettings(gotUserSettings);
    }

    const removeGetUserSettings = window.api.on("getUserSettings", updateUserSettings);
    const removeSetUserSettings = window.api.on("setUserSettings", updateUserSettings);
    return () => {
      removeGetUserSettings?.();
      removeSetUserSettings?.();
    }
  }, []);

  useEffect(() => {
    function setAuthenticated(userUUID: string) {
      setUserId(userUUID);
      window.api.send("setActiveUser", userUUID);
    }
    
    window.api.send("tryRememberMe");
    const removeAuthenticated = window.api.on("authenticated", setAuthenticated);
    return () => {
      removeAuthenticated?.();
    }
  }, []);
  
  useEffect(() => window.api.send("getUserSettings"), [userId]);

  if(userId) {
    return (
      <div className="app-container">
        <SideBar view={view} setView={(viewName: Views) => setView(viewName)} />
        <Content view={view} userId={userId} userSettings={userSettings}/>
      </div>
    );
  } else return <Login />;
}

export default App;