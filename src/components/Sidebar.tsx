import React, { useEffect } from 'react';
import "../assets/scss/sidebar.scss";

type SideBarProps = {
  view: string,
  setView: (viewName: string) => void;
};

function SideBar({ view, setView }: SideBarProps) {
  function handleActiveButton() {
    const button = document.getElementsByClassName("active")[0];
    if(button) button.className = "";
    document.getElementById(view).className = "active";
  }

  useEffect(handleActiveButton, [view]);

  return (
    <div className="sidebar">
      <SideBarButton id="Home" onClick={() => {setView("Home");handleActiveButton();}}/>
      <SideBarButton id="Notepad" onClick={() => {setView("Notepad");handleActiveButton();}}/>
      <SideBarButton id="Foods" onClick={() => {setView("Foods");handleActiveButton();}}/>
      <SideBarButton id="Settings" onClick={() => {setView("Settings");handleActiveButton();}}/>
      <SideBarButton id="About" onClick={() => {setView("About");handleActiveButton();}}/>
      <SideBarButton id="Logout" onClick={() => {window.api.send("logout")}}/>
    </div>
  );
}

export default SideBar;

type SideBarButtonProps = {
  id: string,
  onClick: () => void
}

function SideBarButton({id, onClick}: SideBarButtonProps) {
  return (
    <>
      <button id={id} onClick={onClick}>{id.toLocaleUpperCase()}</button>
    </>
  );
}