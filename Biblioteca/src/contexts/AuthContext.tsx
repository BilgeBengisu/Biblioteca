import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabase-client";
import type { User, AuthError } from "@supabase/supabase-js";
import type { ProfileRow } from "../types/Profile";
import { getProfileById } from "../services/profiles";

type SignUpProfile = {
  username?: string;
  avatarUrl?: string;
};

interface AuthContextType {
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;

  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithPassword: (email: string, password: string, profile?: SignUpProfile) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  // this gives profile request a unique ticket number
  // useRef is preferable over useState because it doesn't trigger a re-render at every increment 
  // and stays stable across renders 
  const profileRequestId = useRef(0); 

  const loadProfileForUser = async (currentUser: User | null) => {
    // this line marks the async call (no two calls share the same id and the latest one is prefered)
    // the conditional check profileRequestId.current === requestId makes the older requestId outdated
    const requestId = ++profileRequestId.current;

    if (!currentUser) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      const data = await getProfileById(currentUser.id);
      if (profileRequestId.current === requestId) {
        setProfile(data);
      }
    } catch (error) {
      if (profileRequestId.current === requestId) {
        setProfile(null);
      }
      console.error("Error loading profile:", error);
    } finally {
      if (profileRequestId.current === requestId) {
        setProfileLoading(false);
      }
    }
  };

  useEffect(() => {
    // load initial user
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      await loadProfileForUser(user ?? null);
      setAuthLoading(false);
    };

    init();

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      void loadProfileForUser(nextUser);
      setAuthLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log("OAuth start origin:", window.location.origin);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // IMPORTANT: this keeps the redirect consistent
        // This ensures the user is redirected to the AuthCallback temporary landing page after OAuth
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    // signInWithOAuth typically redirects, so data is not that useful here
    return { error };
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    profile?: SignUpProfile
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: profile?.username ?? null,
          avatar_url: profile?.avatarUrl ?? null, // matches your trigger
        },
      },
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshProfile = async () => {
    await loadProfileForUser(user);
  };

  return ( // exporting the context Provider
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading: authLoading || profileLoading,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
