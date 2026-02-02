import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import "./Register.css";

export const Register = () => {
  const { signUpWithPassword, signInWithGoogle } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="register-container">
      <h1>Registrarse</h1>
      <br />
      {message && <span>{message}</span>}

      <form
        className="register-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setMessage("");

          if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
          }

          setLoading(true);

          const { error } = await signUpWithPassword(email, password, {
            username,
          });

          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }

          // TODO: implement email confirmation
          // Show message to check email for confirmation
          setMessage("Por favor revisa tu correo para confirmar tu cuenta.");
          setLoading(false);
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
          setMessage("");
          setLoading(true);
          const { error } = await signInWithGoogle();
          if (error) setError(error.message);
          setLoading(false);
        }}
      >
        Continuar con Google
      </button>
    </div>
  );
};
