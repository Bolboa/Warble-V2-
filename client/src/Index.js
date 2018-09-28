import React from "react";
import ReactDOM from "react-dom";
import Main from "./screens/Main.js";
import { BrowserRouter } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

ReactDOM.render((
  <BrowserRouter>
    <Main 
      cookies={ cookies }
    /> 
  </BrowserRouter>
), document.getElementById("root"));