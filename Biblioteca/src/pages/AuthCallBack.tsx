// AuthCallBack page to handle OAuth redirects - serves as a temporary landing page
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
        return;
      }

      if (data.session) {
        navigate("/posts");
      } else {
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p className="text-center mt-8">Iniciando sesión…</p>;
};
