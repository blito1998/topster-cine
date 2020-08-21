import Nav from "./Nav.css";
import React from "react";
import { Link } from "react-router-dom";

export default (props) => (
  <aside className="menu-area">
    <nav className="menu">
      <Link to="/">
        <i className="fa fa-home"> Inicio</i>
      </Link>
      <Link to="/programacao">
        <i className="fa fa-film"> Programacao</i>
      </Link>
      <Link to="/produtos">
        <i className="fa fa-shopping-cart"> Produtos</i>
      </Link>
      <Link to="/cadastre-se">
        <i className="fa fa-users"> Cadastre-se</i>
      </Link>
      <Link to="/login/">
        <i className="fa fa-user"> Login</i>
      </Link>
      
    </nav>
  </aside>
);
