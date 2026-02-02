import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Login = () => {
    const { user, signInWithPassword, signInWithGoogle } = useAuth();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // using use effect to check for user in session from AuthContext to redirect to profile
    useEffect(() => {
        if (user) navigate("/profile", { replace: true }); // avoiding redirect loops back and forth between login and profile
    }, [user, navigate]);

    return (
        <div className="login-container">
            <h1>Inicia Sesión</h1>
            <br></br>
            {message && <span>{message}</span>}
            <p>Inicia sesión en tu cuenta.</p>
            <form 
                className="login-form"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    setMessage("");
                    setLoading(true);

                    const { error } = await signInWithPassword(email, password);

                    if (error) {
                        setError(error.message);
                        setLoading(false);
                        return;
                    }
                    setLoading(false);
            }}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        name="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                    />
                </label>
                <label>
                    Contraseña
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

            <button
                className="google-login-button"
                type="button"
                onClick={async () => {
                    setError(null);
                    setLoading(true);
                    const { error } = await signInWithGoogle();
                    if (error) setError(error.message);
                    setLoading(false);
                }}
                disabled={loading}
            >
                Continuar con Google
            </button>
        </div>
    )

}