import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // Authorization-aware navbar
    <nav className="navbar">
      <div className="navbar-logo">
        {isAuthenticated ?
          (<Link to="/home">Biblioteca</Link> ) :
          (<Link to="/">Biblioteca</Link>)
        }
      </div>
      <ul className="navbar-links">
        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/profile">{user?.username || 'Profile'}</Link>
            </li>
            <li>
              <button className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
