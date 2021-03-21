import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import Headbar from "./components/Headbar";

ReactDOM.render(
  <>
    <Headbar />
    <App />
  </>, document.getElementById('root')
);
