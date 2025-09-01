import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';

const Login = ({logini isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        console.log('Success');

        login(email, password);
    }

    // is the user authenticated?
    // redirect them to the home page

    return (
        <div className="container mt-5">
            <h1>Bienvenido a Biblioteca</h1>
            <p>Inicia sesión en tu cuenta</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="email" 
                        placeholder="Correo electrónico" 
                        name="email" 
                        value={email} 
                        onChange={e => onChange(e)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="password" 
                        placeholder="Contraseña" 
                        name="password" 
                        value={password} 
                        onChange={e => onChange(e)} 
                        minLength="6" 
                        required 
                    />
                </div>
                <button className="btn btn-primary" type="submit">Entrar</button>
            </form>
            <p className="mt-2">
                No tenes una cuenta? <Link to="/signup">Registrese</Link>
            </p>
            <p className="mt-3">
                Olvidaste tu contraseña? <Link to="/reset-password">Restablecer Contraseña</Link>
            </p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);

