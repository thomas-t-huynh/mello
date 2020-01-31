import React from "react";
import ReactDOM from "react-dom";

import Board from "./component/Board"
import App from "./App";
import Register from "./auth/register"

const rootElement = document.getElementById("root");
ReactDOM.render(<Board />, rootElement);
