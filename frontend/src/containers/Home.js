import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div className='container'>
        < div class='jumbotron mt-5'>
        
            <h1 class='display-4'>Bienvenido a Biblioteca</h1>
            <p class='lead'>Tu sistema de gestión de biblioteca todo en uno.</p>
            <hr class='my-4' />
            <p>Administra libros, usuarios y préstamos de manera eficiente.</p>
            <a class='btn btn-primary btn-lg' href='/login' role='button'>Iniciar Sesión</a>
        </div>
    </div>
);

export default Home;