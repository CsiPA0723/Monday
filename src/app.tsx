import React, { useEffect, useState } from "react";
import "./assets/scss/app.scss";

import SideBar from "./components/Sidebar";
import Content from "./components/Content"
import Login from "./views/Login";

type Views = "Calendar"|"Home"|"Notepad"|"User";

function App() {
  const [view, setView] = useState<Views>("Home");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    function setTrueAuthenticated() {
      setAuthenticated(true);
    }

    window.login.on("authenticated", setTrueAuthenticated);
    window.login.send("tryRememberMe");
    return () => {
      window.login.off("authenticated", setTrueAuthenticated);
    }
  }, []);
  

  if(authenticated) {
    return (
      <>
        <SideBar view={view} setView={(viewName: Views) => setView(viewName)} />
        <Content view={view} />
      </>
    );
  } else return <><Login /></>;
}

export default App;