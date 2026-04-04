// AuthCallBack page to handle OAuth redirects - serves as a temporary landing page
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { getProfileById } from "../services/profiles";
import { isUsernameMissing } from "../utils/profile";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getProfileWithRetry = async (userId: string, retries = 3) => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const profile = await getProfileById(userId);
    if (profile) return profile;
    if (attempt < retries) await sleep(250);
  }
  return null;
};

const parseHashError = () => {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const error = params.get("error");
  const errorCode = params.get("error_code");
  const errorDescription = params.get("error_description");
  return { error, errorCode, errorDescription };
};

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [hashError, setHashError] = useState<{ code: string; description: string } | null>(null);

  useEffect(() => {
    const { error, errorCode, errorDescription } = parseHashError();

    if (error) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          navigate("/profile", { replace: true });
          return;
        }
        setHashError({
          code: errorCode ?? error,
          description: errorDescription ?? "Ocurrió un error al confirmar tu cuenta.",
        });
      });
      return;
    }

    const run = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("getSession error:", sessionError);
        navigate("/login", { replace: true });
        return;
      }

      if (!data.session) {
        console.error("No session after OAuth redirect");
        navigate("/login", { replace: true });
        return;
      }

      const user = data.session.user;
      try {
        const profile = await getProfileWithRetry(user.id);
        if (profile && isUsernameMissing(profile.username)) {
          navigate("/complete-profile", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Error checking profile after OAuth:", err);
      }

      navigate("/profile", { replace: true });
    };

    run();
  }, [navigate]);

  if (hashError) {
    const isExpired = hashError.code === "otp_expired";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">
              {isExpired ? "⏰" : "⚠️"}
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {isExpired ? "El enlace ha expirado" : "Enlace inválido"}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {isExpired
              ? "El enlace de confirmación ya no es válido. Regístrate de nuevo para recibir un correo nuevo."
              : hashError.description.replace(/\+/g, " ")}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/register"
              className="w-full inline-block py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition"
            >
              Volver a registrarse
            </Link>
            <Link
              to="/login"
              className="w-full inline-block py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Iniciando sesión…</p>
    </div>
  );
};
