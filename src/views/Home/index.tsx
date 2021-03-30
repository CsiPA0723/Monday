import React from 'react';
import { BasicViewProps } from "../../components/Content";

function Home({userSettings}: BasicViewProps) {
  return (
    <>
      <h1>Hi {userSettings?.name ? userSettings?.name : "User"}</h1>
    </>
  );
}

export default Home;
