import React from 'react';
import BasicViewProps from "../../@types/views";

function getGreeting() {
  const hours = new Date().getHours();
  if(22 <= hours || hours < 4) return "Good Night";
  if(18 <= hours) return "Good Evening";
  if(10 <= hours) return "Good Day";
  if(4 <= hours) return "Good Morning";
}

function Home({userSettings}: BasicViewProps) {
  return (
    <>
      <h1>{getGreeting()}{userSettings && userSettings.name ?  ` ${userSettings.name}` : ""}!</h1>
    </>
  );
}

export default Home;
