import React from 'react';
import { useState } from 'react';
import './Login.css';

const Login: React.FC = () =>{
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic here
        console.log("Logging in with:", { emailOrUsername, password });
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <p>Inicia sesión en tu cuenta.</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="Enter your username or email"
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;