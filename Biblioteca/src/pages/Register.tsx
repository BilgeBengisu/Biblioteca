import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import './Register.css';

export const Register = () => {
    const { user, signInWithPassword, signInWithGoogle } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="register-container">
            <h1>Register</h1>
            <br></br>
            { message && <span>{message}</span>}
            <form className="register-form" onSubmit={(e) => {
                e.preventDefault();
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }
                setLoading(true);
                signInWithPassword(email, password);
                setLoading(false);
            }}>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nombre de usuario"
                        required
                    />
                </label>
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
                    Password
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        minLength={6}
                        required
                    />
                </label>
                <label>
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu contraseña"
                        minLength={6}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Registrando…' : 'Registrar'}</button>
            </form>
            {loading && <p className="login-status"></p>}
            {error && <p className="register-error">{error}</p>}
            <button className="google-login-button" onClick={signInWithGoogle}>
            Continuar con Google
            </button>
        </div>
    );
}