import React from "react";
import "../../assets/scss/headbar.scss";
import { ReactComponent as Monday } from "../../assets/svgs/title.svg";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import { ReactComponent as Maximize } from "../../assets/svgs/maximize.svg";
import { ReactComponent as Minimize } from "../../assets/svgs/minimize.svg";

function Headbar() {
  return (
    <div className="headbar">
      <div className="title">
        <Monday fill="currentColor"/>
      </div>
      <div id="close-btn" onClick={() => window.headbar.closeActiveWindow()} className="title-button">
        <Close fill="currentColor"/>
      </div>
      <div id="max-btn" onClick={() => window.headbar.maximizeActiveWindow()} className="title-button">
        <Maximize fill="currentColor"/>
      </div>
      <div id="min-btn" onClick={() => window.headbar.minimizeActiveWindow()} className="title-button">
        <Minimize fill="currentColor"/>
      </div>
    </div>
  );
}

export default Headbar;
