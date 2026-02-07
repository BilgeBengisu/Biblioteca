// AuthCallBack page to handle OAuth redirects - serves as a temporary landing page
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export const AuthCallback = () => {
  const navigate = useNavigate();

  // checks if there is session but the username is missing (happens after google auth login)
  // redirects to complete profile screen
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

  return <div className="p-6">Iniciando sesión…</div>;
};
