import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login.css';
import { useAuth } from "../contexts/AuthContext";
// import { getCurrentUser } from '../services/auth.tsx';
import api from '../lib/api.tsx';
import  { supabase } from '../services/supabaseClient.tsx';

const Login: React.FC = () => {
    const { setUser } = useAuth();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setMessage('');

        // supabase
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
            return;
        }
        if (data?.user) {
            setLoading(false);
            setMessage("User signed in");
            setError(null);
            
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single();

                if (profileError) {
                console.error("Error fetching profile:", profileError.message);
            }
            setUser({ ...data.user, profile });
            navigate('/profile');
        }

        // try {
        //     // Post identifier (username or email) to our identifier-login endpoint
        //     const payload = { identifier: emailOrUsername, password };
        //     const { data } = await api.post('/auth/login/', payload);

        //     // Expected response: { access: string, refresh: string }
        //     if (data?.access) {
        //         localStorage.setItem('access_token', data.access);
        //     }
        //     if (data?.refresh) {
        //         localStorage.setItem('refresh_token', data.refresh);
        //     }

        //     // Fetch and set the current user in global state
        //     // before navigating to protected page
        //     const user = await getCurrentUser();
        //     setUser(user);

        //     // Navigate to a protected page after login
        //     navigate('/profile');
        // } catch (err: any) {
        //     // Try to extract a useful message from axios error
        //     const msg = err?.response?.data || err?.message || 'Login failed';
        //     setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        //     console.error('Login error', err);
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/profile', // after login
            },
            });

            if (error) throw error;

        } catch (err: any) {
            console.error("Google login error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <br></br>
            {message && <span>{message}</span>}
            <p>Inicia sesión en tu cuenta.</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="text"
                        value={email}
                        name="emailOrUsername" 
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
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            {loading && <p className="login-status">Logging in…</p>}
            {error && <p className="login-error">{error}</p>}

            <button className="google-login-button" onClick={handleGoogleLogin}>
            Continue with Google
            </button>
        </div>
    );
};

export default Login;