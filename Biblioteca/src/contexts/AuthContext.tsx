import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { User, AuthError } from "@supabase/supabase-js";
import type { ProfileRow } from "../types/Profile";
import { getProfileById } from "../services/profiles";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const profileCacheKey = (userId: string) => `biblioteca_profile_${userId}`;

function readCachedProfile(userId: string): ProfileRow | undefined {
  try {
    const raw = sessionStorage.getItem(profileCacheKey(userId));
    return raw ? (JSON.parse(raw) as ProfileRow) : undefined;
  } catch {
    return undefined;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const queryClient = useQueryClient();

  const { data: profile = null, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const data = await getProfileById(user!.id);
      // keep sessionStorage in sync so the next page load is instant
      if (data) sessionStorage.setItem(profileCacheKey(user!.id), JSON.stringify(data));
      return data;
    },
    enabled: !!user,
    staleTime: Infinity,
    initialData: user?.id ? readCachedProfile(user.id) : undefined,
  });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (event === "SIGNED_OUT") {
        queryClient.removeQueries({ queryKey: ["profile"] });
        sessionStorage.clear();
      } else if (event === "USER_UPDATED" && nextUser) {
        // force a fresh fetch if the user's account was updated
        queryClient.invalidateQueries({ queryKey: ["profile", nextUser.id] });
      }

      setAuthLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const signInWithGoogle = async () => {
    console.log("OAuth start origin:", window.location.origin);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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
          avatar_url: profile?.avatarUrl ?? null,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshProfile = () => {
    if (user) {
      sessionStorage.removeItem(profileCacheKey(user.id));
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
  };

  return (
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
