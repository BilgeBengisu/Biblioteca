import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
// import { getCurrentUser, logout as authLogout, refresh as refreshAccessToken} from "../services/auth";
import { supabase } from "../services/supabaseClient";

// describing the shape of the context
type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  setUser: (u: any | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

// creating auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

// component to provide auth context to its children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const getSession = async () => {const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      setUser(null);
      return;
    }

    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  };

  getSession();

  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   const refresh = localStorage.getItem("refresh_token");
  //   if (!token || !refresh) return;

  //   // Try to refresh the token and fetch the user
  //   refreshAccessToken()
  //     .then(() => getCurrentUser().then(setUser))
  //     .catch(() => {
  //       authLogout();
  //       setUser(null);
  //     });
  // }, []);

  const logout = async () => {
    setUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const refreshUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } else {
      setUser(user);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      setUser,
      logout,
      refreshUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
