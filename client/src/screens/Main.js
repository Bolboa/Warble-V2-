import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../features/Home/Index";
import Login from "../features/Login/Index";
import Register from "../features/Register/Index";
import Verify from "../features/Verify/Index";


const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={ Home } />
      <Route path="/login" component={ Login } />
      <Route path="/register" component={ Register } />
      <Route path="/verify" component={ Verify } />
    </Switch>
  </main>
);

export default Main;