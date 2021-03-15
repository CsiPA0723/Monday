import React, { useState } from "react";
import "./app.css";

import SideBar from "./components/Sidebar";
import Content from "./components/Content"

function App() {
  const [view, setView] = useState("Home");

  return (
    <>
      <SideBar view={view} setView={setView} />
      <Content view={view} />
    </>
  );
}

export default App;