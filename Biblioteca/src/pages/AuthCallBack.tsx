// AuthCallBack page to handle OAuth redirects - serves as a temporary landing page
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { getProfileById, isUsernameAvailable, updateProfileById } from "../services/profiles";

// normalizing google metadata for username
const normalizeUsernameBase = (raw: string) => {
  const cleaned = raw
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");

  return cleaned || "usuario";
};

// building an available username after signin
const buildUsernameBase = (user: { email?: string | null; user_metadata?: any }) => {
  const meta = user.user_metadata ?? {};
  const fromName =
    [meta.given_name, meta.family_name].filter(Boolean).join(".") ||
    meta.full_name ||
    meta.name;
  if (fromName) return normalizeUsernameBase(String(fromName));

  const emailPrefix = user.email?.split("@")[0] ?? "";
  return normalizeUsernameBase(emailPrefix || "usuario");
};

const generateAvailableUsername = async (base: string) => {
  const candidates: string[] = [base];
  for (let i = 1; i <= 20; i += 1) candidates.push(`${base}${i}`);

  for (const candidate of candidates) {
    try {
      const available = await isUsernameAvailable(candidate);
      if (available) return candidate;
    } catch {
      // if availability check fails, keep trying next candidate
    }
  }

  // last resort: random suffix to avoid blocking login
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
};

export const AuthCallback = () => {
  const navigate = useNavigate();


  // checks if there is session but the username is missing (happens after google auth login)
  // assigns an available username
  useEffect(() => {
    const run = async () => { 
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("getSession error:", error);
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
        const profile = await getProfileById(user.id);
        if (profile && !profile.username) {
          const base = buildUsernameBase(user);
          const username = await generateAvailableUsername(base);
          await updateProfileById(user.id, { username });
        }
      } catch (err) {
        console.error("Error setting username after OAuth:", err);
      }

      navigate("/profile", { replace: true });
    };

    run();
  }, [navigate]);

  return <div className="p-6">Iniciando sesión…</div>;
};
