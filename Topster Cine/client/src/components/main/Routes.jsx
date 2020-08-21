import React from "react";
import { Switch, Route, Redirect } from "react-router";

import Home from "../Home/Home";
import Login from "../Login/login";
import Produtos from "../Produtos/produto";
import Programacao from "../Programacao/programacao";


export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/Login" component={Login} />
    <Route exact path="/Produtos" component={Produtos} />
    <Route exact path="/Programacao" component={Programacao} />
    <Redirect from="*" to="/" />
  </Switch>
);
