import "./reset.css";
import "./index.css";

import "pepjs";

import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
