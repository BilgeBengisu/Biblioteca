// AuthCallBack page to handle OAuth redirects - serves as a temporary landing page
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";

export const AuthCallback = () => {
  const navigate = useNavigate();

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

      navigate("/profile", { replace: true });
    };

    run();
  }, [navigate]);

  return <div className="p-6">Iniciando sesión…</div>;
};
