import React from 'react';

const Home = () => (
    <div className='container'>
        < div className='jumbotron mt-5'>
            <h1 className='display-4'>Bienvenido a Biblioteca</h1>
            <p className='lead'>Tu sistema de gestión de biblioteca todo en uno.</p>
            <hr className='my-4' />
            <p>Administra libros, usuarios y préstamos de manera eficiente.</p>
            <a className='btn btn-primary btn-lg' href='/login' role='button'>Iniciar Sesión</a>
        </div>
    </div>
);

export default Home;