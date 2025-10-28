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
  fetchFollowers: (userId: string) => Promise<number>;
  fetchFollowing: (userId: string) => Promise<number>;
};

// creating auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  logout: () => {},
  refreshUser: async () => {},
  fetchFollowers: async () => 0,
  fetchFollowing: async () => 0,
});

// component to provide auth context to its children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  // helper to fetch profile row for a supabase user id
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(); // will return an error if no row found
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

  const fetchFollowers = async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("followed_id", userId);

    if (error) {
      console.error("Error fetching followers:", error.message);
      return 0;
    }

    return count ?? 0;
  };

  const fetchFollowing = async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    if (error) {
      console.error("Error fetching following:", error.message);
      return 0;
    }

    return count ?? 0;
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

  // sbUser variable name is used to distinguish from the `user` state variable
  const refreshUser = async () => {
    const {
      data: { user: sbUser },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      return;
    }

    if (sbUser) {
      const profile = await fetchProfile(sbUser.id);
      setUser({ ...sbUser, profile });
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
      fetchFollowers,
      fetchFollowing,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
