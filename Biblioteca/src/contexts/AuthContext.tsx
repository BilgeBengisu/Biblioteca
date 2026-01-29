import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import type { User } from "@supabase/supabase-js/dist/index.cjs";

// AuthContext Type definition
interface AuthContextType {
    user: User | null; // user might not be signed in
    signInWithPassword: (email: string, password: string) => void;
    signUpWithPassword: (email: string, password: string) => void;
    signInWithGoogle: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined >(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    // whenever this component is mounted, we will check for the current session 
    // and set the user if there is any
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setUser(session?.user ?? null);
        });

        // we add a listener to listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        // it's important to unsubscribe from the listener when the component unmounts
        // so we can prevent memory leaks
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
        })
    };

    const signInWithPassword = (email: string, password: string) => {
        supabase.auth.signInWithPassword({
            email,
            password,
        });
    };

    const signUpWithPassword = (email: string, password: string) => {};

    const signOut = () => {
        supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{user, signInWithGoogle, signInWithPassword, signUpWithPassword, signOut}}>
            {children}
        </AuthContext.Provider>
    )
    
}


// hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}