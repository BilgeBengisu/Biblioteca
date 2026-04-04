import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { isUsernameMissing } from '../utils/profile';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path d="M17.64 9.2a10.34 10.34 0 0 0-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908C16.658 14.252 17.64 11.946 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.71H.957v2.332A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A9 9 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </g>
  </svg>
);

export const Login = () => {
    const { user, profile, signInWithPassword, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        if (isUsernameMissing(profile?.username)) {
            navigate("/complete-profile", { replace: true });
            return;
        }
        navigate("/profile", { replace: true });
    }, [user, profile?.username, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
                    <p className="text-gray-500 mt-1 text-sm">Inicia sesión en tu cuenta</p>
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        setError(null);
                        setLoading(true);
                        const { error } = await signInWithGoogle();
                        if (error) setError(error.message);
                        setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
                >
                    <GoogleIcon />
                    Continuar con Google
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="px-3 text-xs text-gray-400 uppercase tracking-wide">o</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        setLoading(true);
                        const { error } = await signInWithPassword(email, password);
                        if (error) {
                            const msg = error.message === "Email not confirmed"
                                ? "Confirma tu correo"
                                : error.message === "Invalid login credentials"
                                ? "Credenciales incorrectas"
                                : error.message;
                            setError(msg);
                            setLoading(false);
                            return;
                        }
                        setLoading(false);
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-red-600 font-medium hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
