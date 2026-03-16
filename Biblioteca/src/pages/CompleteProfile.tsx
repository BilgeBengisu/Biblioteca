import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isUsernameAvailable, updateProfileById } from "../services/profiles";
import "./CompleteProfile.css";
import { isUsernameMissing } from "../utils/profile";

export const CompleteProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (profile?.username && !isUsernameMissing(profile.username)) {
      navigate("/profile", { replace: true });
      return;
    }

    usernameInputRef.current?.focus();
  }, [user, profile?.username, navigate]);

  const validateUsername = (value: string) => {
    if (value.length < 3 || value.length > 30) {
      return "El nombre de usuario debe tener entre 3 y 30 caracteres.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }
    return null;
  };

  return (
    <div className="complete-profile-container">
      <h1>Completa tu perfil</h1>
      <p className="complete-profile-subtitle">
        Elegí un nombre de usuario para continuar.
      </p>
      <form
        className="complete-profile-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user) return;

          setError(null);
          setLoading(true);

          const trimmed = username.trim();
          if (!trimmed) {
            setError("El nombre de usuario es obligatorio.");
            setLoading(false);
            usernameInputRef.current?.focus();
            return;
          }

          const validationError = validateUsername(trimmed);
          if (validationError) {
            setError(validationError);
            setLoading(false);
            usernameInputRef.current?.focus();
            return;
          }

          try {
            const available = await isUsernameAvailable(trimmed);
            if (!available) {
              setError("El nombre de usuario ya está en uso. Intenta otro.");
              setLoading(false);
              usernameInputRef.current?.focus();
              return;
            }
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : "No se pudo verificar el nombre de usuario.";
            setError(msg);
            setLoading(false);
            return;
          }

          try {
            await updateProfileById(user.id, {
              username: trimmed,
              avatar_url: user.user_metadata?.avatar_url ?? null,
            });
            await refreshProfile();
            navigate("/profile", { replace: true });
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : "No se pudo guardar el nombre de usuario.";
            setError(msg);
          } finally {
            setLoading(false);
          }
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

        <button type="submit" disabled={loading}>
          {loading ? "Guardando…" : "Continuar"}
        </button>
      </form>

      {error && <p className="complete-profile-error">{error}</p>}
    </div>
  );
};
