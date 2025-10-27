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

  // helper to fetch profile row for a supabase user id
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single(); // will return an error if no row found
      console.log(data);
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception fetching profile:', err);
      return null;
    }
  };

  const getSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      setUser(null);
      return;
    }

    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      // attach profile under `profile` key so components can read username, etc.
      setUser({ ...session.user, profile });
    } else {
      setUser(null);
    }
  };

  // Run once on mount
  React.useEffect(() => {
    getSession();
  }, []);

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
      data: { user: user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      return;
    }

    if (user) {
      const profile = await fetchProfile(user.id);
      setUser({ ...user, profile });
    } else {
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
