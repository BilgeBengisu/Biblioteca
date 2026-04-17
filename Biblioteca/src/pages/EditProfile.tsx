import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { EditProfileForm } from "../components/EditProfileForm";
import { updateProfileById } from "../services/profiles";


export const EditProfile = () => {
    const { user, profile, refreshProfile, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                    <p className="text-sm text-neutral-600">Cargando…</p>
                </div>
            </div>
        );
    }

    if (!user || !profile) return null;

    const profileRoute = `/profile/${profile.username}`;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                <h1 className="text-xl font-semibold tracking-tight mb-4">Editar Perfil</h1>
                <EditProfileForm
                    profile={profile}
                    userId={user.id}
                    avatarBucket="avatars"
                    currentAvatarUrl={profile.avatar_url}
                    updateProfile={updateProfileById}
                    onCancel={() => navigate(profileRoute)}
                    onSaved={(updated) => {
                        refreshProfile();
                        navigate(`/profile/${updated.username}`);
                    }}
                />
            </div>
        </div>
    );
};
