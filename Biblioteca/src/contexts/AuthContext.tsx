import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { User, AuthError } from "@supabase/supabase-js";

type SignUpProfile = {
  username?: string;
  avatarUrl?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;

  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    profile?: SignUpProfile
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load initial user
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };

    init();

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        signOut,
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
