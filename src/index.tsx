import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import Headbar from "./components/Headbar";
import Login from "./views/Login";

window.login.onAuthenticated(() => {
  ReactDOM.render(
    <>
      <Headbar />
      <App />
    </>, document.getElementById('root')
  );
});

ReactDOM.render(
  <>
    <Headbar />
    <Login />
  </>, document.getElementById('root')
);
