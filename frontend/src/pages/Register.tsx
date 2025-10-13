import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import "./Register.css";
import api from '../lib/api.tsx';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Djoser can accept username, email, password, re_password
            const payload = {
                username,
                email,
                password,
                re_password: confirmPassword,
            };

            // backend mounts djoser at /api/auth/, so post to that full path
            const { data } = await api.post('/auth/users/', payload);

            // Djoser user creation often does not return JWT tokens by default.
            // If your backend is configured to return tokens on signup, store them.
            if (data?.access) {
                localStorage.setItem('access_token', data.access);
            }
            if (data?.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }

            // After successful registration, navigate to login or profile depending on backend behavior
            navigate('/activate');
        } catch (err: any) {
            const msg = err?.response?.data || err?.message || 'Registration failed';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
            console.error('Register error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
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
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
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
                        placeholder="Confirm your password"
                        minLength={6}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Registering…' : 'Register'}</button>
            </form>
            {error && <p className="register-error">{error}</p>}
        </div>
    );
};

export default Register;