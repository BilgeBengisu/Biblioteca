import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../actions/auth';
import axios from 'axios';

const Signup = ({signup, isAuthenticated}) => {
    const [accountCreated, setAccountCreated] =useState(false);
    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password:'',
        re_password:''
    });

    const { name, email, password, re_password } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (password === re_password){
            signup(name, email, password, re_password);
            console.log('Account Created')
            setAccountCreated(true);
        }
    };

    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=http://localhost:8000`)
            
            window.location.replace(res.data.authorization_url)
        } catch (err) {
            
        }
    }

    if (isAuthenticated) {
        return <Navigate to='/' />
    }

    if (accountCreated) {
        return <Navigate to='/login' />
    }

    return (
        <div className="container mt-5">
            <h1>Bienvenido a Biblioteca</h1>
            <p>Create your account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Nombre*" 
                        name="name" 
                        value={name} 
                        onChange={e => onChange(e)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="email" 
                        placeholder="Correo electrónico*" 
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
                        placeholder="Contraseña*" 
                        name="password" 
                        value={password} 
                        onChange={e => onChange(e)} 
                        minLength="6" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="password" 
                        placeholder="Confirma Contraseña*" 
                        name="re_password" 
                        value={re_password} 
                        onChange={e => onChange(e)} 
                        minLength="6" 
                        required 
                    />
                </div>
                <button className="btn btn-primary" type="submit">Registrar</button>
            </form>
            <button className='btn btn-primary' type='submit' onClick={continueWithGoogle}>
                Continue with Google
            </button>
            <p className="mt-2">
                Ya tenes una cuenta? <Link to="/login">Entrar</Link>
            </p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Signup);

