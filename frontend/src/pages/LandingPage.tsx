import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
        <div className="landingpage-container">
            <h1>Bienvenido a Biblioteca</h1>
            <p>Inicia sesión en tu cuenta</p>
            <div className="landingpage-buttons">
                <Link to ="/login" className="btn">
                    Login
                </Link>
                <Link to ="/register" className="btn">
                    Register
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;
