import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getCurrentUser, logout as authLogout, refresh as refreshAccessToken} from "../services/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  setUser: (u: any | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (!token || !refresh) return;

    // Try to refresh the token and fetch the user
    refreshAccessToken()
      .then(() => getCurrentUser().then(setUser))
      .catch(() => {
        authLogout();
        setUser(null);
      });
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
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
