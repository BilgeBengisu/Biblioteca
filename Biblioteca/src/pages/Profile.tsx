import  { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/default-avatar.svg";
import mockProfilePic from "../assets/bilge_profile.png";

export const Profile = () => {
    const { profileUser, signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth();
    const mockUser = {
        id: "12345",
        email: "b.akyol26@ncf.edu",
        username: "bilge26",
        avatar_url: mockProfilePic,
    };

    // setting profile picture for displaying
    const profile_picture =
        (mockUser?.avatar_url as string | undefined) ||
        (mockUser?.user_metadata?.avatar_url as string | undefined) ||
        null;
    const displayProfilePicture = profile_picture || defaultAvatar;
    const displayName = mockUser?.username || mockUser?.user_metadata?.full_name || mockUser?.email || "usuario";

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 flex items-start gap-6">
                <div className="profile-pic-wrapper ring-1 ring-neutral-200 dark:ring-neutral-800 flex-shrink-0">
                    <img
                        src={displayProfilePicture}
                        alt="Profile"
                        className="w-17 h-17 rounded-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold tracking-tight truncate text-red-500">{displayName}</h1>
                </div>
                </div>
            </div>
        </div>
    )
}