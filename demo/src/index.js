import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./pages/App";

import "./style.scss";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
