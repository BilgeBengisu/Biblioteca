import  { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/default-avatar.svg";
import type { ProfileRow } from "../types/Profile";
import { useState, useEffect } from "react";
import { getProfileById, updateProfileById } from "../services/profiles";
import { EditProfileForm } from "../components/EditProfileForm";
import { ProfileTabs } from "../components/ProfileTabs";

export const Profile = () => {
    const { user } = useAuth();

    const [profile, setProfile] = useState<ProfileRow | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"library" | "posts">("library");

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        (async () => {
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const data = await getProfileById(user.id);
            if (isMounted) setProfile(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al cargar el perfil.";
            if (isMounted) setErrorMsg(message);
        } finally {
            if (isMounted) setIsLoading(false);
        }
        })();

        return () => {
            isMounted = false;
        };
    }, [user]);

    // If not logged in yet
    if (!user) {
        return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <h1 className="text-2xl font-semibold tracking-tight">No registrado</h1>
            <p className="text-sm text-neutral-600 mt-2">
                Por favor, inicia sesión para ver tu perfil.
            </p>
            </div>
        </div>
        );
    }

    // Loading
    if (isLoading) {
        return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <p className="text-sm text-neutral-600">Cargando perfil…</p>
            </div>
        </div>
        );
    }

    // Error
    if (errorMsg) {
        return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-red-200 dark:border-red-900 p-6">
            <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
        </div>
        );
    }

    // Displaying profile
    const avatar =
        profile?.avatar_url ||
        (user.user_metadata?.avatar_url as string | undefined) || // Supabase user info (OAuth Google populates user_metadata)
        (user.user_metadata?.picture as string | undefined) ||
        defaultAvatar;
    // setting display name
    const displayName =
        profile?.username ||
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        user.email ||
        "usuario";

    return (
        <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 flex items-start gap-6">
            <div className="ring-1 ring-neutral-200 dark:ring-neutral-800 flex-shrink-0 rounded-full">
            <img src={avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold tracking-tight truncate">{displayName}</h1>

                    {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                        Editar perfil
                    </button>
                    ) : null}
                </div>
                {isEditing && profile && (
                    <EditProfileForm
                        profile={profile}
                        userId={user.id}
                        avatarBucket="avatars"
                        currentAvatarUrl={profile.avatar_url}
                        updateProfile={async (id, updates) => {
                            return updateProfileById(id, updates); // make a call to Supabase to update profile here - keeps the EditProfileForm decoupled from Supabase call
                        }}
                        onCancel={() => setIsEditing(false)}
                        onSaved={(updated) => {
                        setProfile(updated);
                        setIsEditing(false);
                        }}
                    />
                )}
                
                {!isEditing && (
                    <>
                        <p className="text-sm text-neutral-600 truncate">{user.email}</p>

                        {profile?.bio && (
                        <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-line">
                            {profile.bio}
                        </p>
                        )}

                        <div className="text-sm text-neutral-600">
                        Meta de Lectura:{" "}
                        <span className="font-medium">
                            {profile?.reading_goal ?? "Establecer Meta de Lectura"}
                        </span>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
            <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
        {/* Tab content (placeholder for now) */}
        <div className="mt-4">
            {activeTab === "library" ? (
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                    <h2 className="text-lg font-semibold">Mi biblioteca</h2>
                    <p className="text-sm text-neutral-600 mt-2">
                        (Próximo paso) Quiero leer / Leyendo / Terminado.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                    <h2 className="text-lg font-semibold">Mis posts</h2>
                    <p className="text-sm text-neutral-600 mt-2">
                        (Próximo paso) Aquí cargaremos posts cuando abras esta pestaña.
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};