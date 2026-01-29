import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import './Login.css';

export const Login = () => {
    const { user, signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <h1>Login</h1>
            <br></br>
            {message && <span>{message}</span>}
            <p>Inicia sesión en tu cuenta.</p>
            <form className="login-form" onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                signInWithPassword(email, password);
                setLoading(false);
            }}>
                <label>
                    Email
                    <input
                        type="text"
                        value={email}
                        name="emailOrUsername" 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Iniciando sesión…' : 'Iniciar sesión'}</button>
            </form>
            {loading && <p className="login-status"></p>}
            {error && <p className="login-error">{error}</p>}

            <button className="google-login-button" onClick={signInWithGoogle}>
            Continuar con Google
            </button>
        </div>
    )

}