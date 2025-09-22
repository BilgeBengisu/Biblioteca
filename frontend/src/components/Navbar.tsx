import { Link } from "react-router-dom";
import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    // make sure authorization view is implemented for Landing/Home page
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Biblioteca</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
