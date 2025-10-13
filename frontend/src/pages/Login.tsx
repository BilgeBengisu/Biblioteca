import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login.css';
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser } from '../services/auth.tsx';
import api from '../lib/api.tsx';

const Login: React.FC = () => {
    const { setUser } = useAuth();
    
    const [formData, setFormData] = useState({
        emailOrUsername:'',
        password:''
    });
    const { emailOrUsername, password} = formData

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Post identifier (username or email) to our identifier-login endpoint
            const payload = { identifier: emailOrUsername, password };
            const { data } = await api.post('/auth/login/', payload);

            // Expected response: { access: string, refresh: string }
            if (data?.access) {
                localStorage.setItem('access_token', data.access);
            }
            if (data?.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }

            // Fetch and set the current user in global state
            // before navigating to protected page
            const user = await getCurrentUser();
            setUser(user);

            // Navigate to a protected page after login
            navigate('/profile');
        } catch (err: any) {
            // Try to extract a useful message from axios error
            const msg = err?.response?.data || err?.message || 'Login failed';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
            console.error('Login error', err);
        } finally {
            setLoading(false);
        }
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
                        name="emailOrUsername" 
                        onChange={(e) => onChange(e)}
                        placeholder="Enter your username or email"
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => onChange(e)}
                        placeholder="Enter your password"
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            {loading && <p className="login-status">Logging in…</p>}
            {error && <p className="login-error">{error}</p>}
        </div>
    );
};

export default Login;