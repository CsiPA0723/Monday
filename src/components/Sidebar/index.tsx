import React, { useEffect } from 'react';
import "./sidebar.css";

type SideBarProps = {
  view: string,
  setView: React.Dispatch<React.SetStateAction<string>>
};

function SideBar({ view, setView }: SideBarProps) {
  async function handleActiveButton() {
    const button = document.getElementsByClassName("active")[0];
    if(button) button.className = "";
    document.getElementById(view).className = "active";
  }

  useEffect(() => {handleActiveButton()}, [view]);

  return (
    <div className="sidebar">
      <SideBarButton id="Home" onClick={() => {setView("Home");handleActiveButton();}}/>
      <SideBarButton id="Notepad" onClick={() => {setView("Notepad");handleActiveButton();}}/>
      <SideBarButton id="Calendar" onClick={() => {setView("Calendar");handleActiveButton();}}/>
      <SideBarButton id="User" onClick={() => {setView("User");handleActiveButton();}}/>
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