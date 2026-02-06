import { useAuth } from "../contexts/AuthContext";
import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isUsernameAvailable } from "../services/profiles";
import "./Register.css";

export const Register = () => {
  const { signUpWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="register-container">
      <h1>Registrarse</h1>
      <br />
      <form
        className="register-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);

          if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
          }

          setLoading(true);

          const trimmedUsername = username.trim();
          if (!trimmedUsername) {
            setError("El nombre de usuario es obligatorio.");
            setLoading(false);
            usernameInputRef.current?.focus();
            return;
          }

          // check if username is taken
          try {
            const available = await isUsernameAvailable(trimmedUsername);
            if (!available) {
              setError("El nombre de usuario ya está en uso. Intenta otro.");
              setLoading(false);
              setUsername("");
              usernameInputRef.current?.focus();
              return;
            }
          } catch (e) {
            const msg =
              e instanceof Error ? e.message : "No se pudo verificar el nombre de usuario.";
            setError(msg);
            setLoading(false);
            return;
          }

          const { error } = await signUpWithPassword(email, password, {
            username: trimmedUsername,
          });

          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }

          setLoading(false);
          navigate("/confirm-email", { state: { email } });
        }}
      >
        <label>
          Nombre de Usuario
          <input
            type="text"
            value={username}
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
            ref={usernameInputRef}
          />
        </label>

        <label>
          Correo Electrónico
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
            minLength={6}
            required
          />
        </label>

        <label>
          Confirma Contraseña
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

        <button type="submit" disabled={loading}>
          {loading ? "Registrando…" : "Registrar"}
        </button>
      </form>

      {error && <p className="register-error">{error}</p>}

      <button
        className="google-login-button"
        type="button"
        disabled={loading}
        onClick={async () => {
          setError(null);
          setLoading(true);
          const { error } = await signInWithGoogle();
          if (error) setError(error.message);
          setLoading(false);
        }}
      >
        Continuar con Google
      </button>

      <div>
        <Link to="/login">
          Ya tenes cuenta? Inicia sesión aquí.
        </Link>
      </div>
    </div>
  );
};
