import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Home = ({ isAuthenticated }) => {
  // Log whenever Home renders
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <main className="container">
      <div className="jumbotron text-center mt-5 p-5 bg-light rounded shadow">
        <h1 className="display-4">Bienvenido a <strong>Biblioteca</strong></h1>
        <p className="lead">Tu sistema de gestión de biblioteca todo en uno.</p>
        <hr className="my-4" />
        <p>Administra libros, usuarios y préstamos de manera eficiente y sencilla.</p>

        {isAuthenticated ? (
          <Link className="btn btn-success btn-lg me-2" to="/dashboard">
            Ir al Dashboard
          </Link>
        ) : (
          <>
            <Link className="btn btn-primary btn-lg me-2" to="/login">
              Iniciar Sesión
            </Link>
            <Link className="btn btn-outline-secondary btn-lg" to="/signup">
              Crear Cuenta
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

// Pull auth state from Redux
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Home);
