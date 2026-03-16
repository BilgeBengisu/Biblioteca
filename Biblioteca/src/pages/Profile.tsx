import  { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/default-avatar.svg";
import { useState } from "react";
import { ProfileTabView } from "../components/ProfileTabView";
import { Link, useParams } from "react-router-dom";
import { FollowButton } from "../components/FollowButton";
import { FollowCounts } from "../components/FollowCounts";
import { useToggleLike } from "../hooks/useToggleLike";
import { useProfile } from "../hooks/useProfile";
import { usePosts } from "../hooks/usePosts";
import { useLibrary } from "../hooks/useLibrary";
import { ReadingGoalWidget } from "../components/ReadingGoalWidget";
import { useReadingGoal } from "../hooks/useReadingGoal";

export const Profile = () => {
    const { user } = useAuth();
    const { username } = useParams<{ username?: string }>();

    /**
     * profile: the profile data of the user being viewed (could be the logged in user or another user)
     * isLoading: true if the profile data is being loaded, false otherwise
     * error: error message if there was an error loading the profile, null otherwise
     * isOwnProfile: true if the profile being viewed belongs to the logged in user, false otherwise
     */
    const { profile, loading, profileError, isOwnProfile } = useProfile(username);
    /**
     * goal: the target number of books to read for the current year, null if no goal is set
     * progress: the number of books finished so far this year
     * goalLoading: true if the reading goal data is being loaded, false otherwise
     * goalError: error message if there was an error loading the reading goal, null otherwise
     */
    const currentYear = new Date().getFullYear();
    const {
        goal, progress, goalLoading, goalError,
        isEditing, goalInput, goalSaving, goalSaveError,
        onEditClick, onGoalInputChange, onSave, onCancel,
    } = useReadingGoal(profile?.id, currentYear);
    const [followRefreshKey, setFollowRefreshKey] = useState(0); // to refresh the follower count
    const [activeTab, setActiveTab] = useState<"library" | "posts">("library");
    /**
     * posts: the posts made by the user whose profile is being viewed
     * postsLoading: true if the posts are being loaded, false otherwise
     * postsError: error message if there was an error loading the posts, null otherwise
     */
    const { posts, setPosts, postsLoading, postsError } = usePosts(profile?.id, activeTab === "posts");
    const handleToggleLike = useToggleLike({ userId: user?.id, setPosts });

    /**
     * library: the books in the user's library, grouped by status (want_to_read, reading, finished)
     * libraryLoading: true if the library data is being loaded, false otherwise
     * libraryError: error message if there was an error loading the library, null otherwise
     */
    const { library, libraryLoading, libraryError } = useLibrary(profile?.id, activeTab === "library");

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
    if (loading || goalLoading) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                    <p className="text-sm text-neutral-600">Cargando perfil…</p>
                </div>
            </div>
        );
    }

    // Error (network/server failure)
    if (profileError || goalError) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-red-200 dark:border-red-900 p-6">
                    <p className="text-sm text-red-600">{profileError || goalError}</p>
                </div>
            </div>
        );
    }

    // Error Not found (fetch succeeded but returned null)
    if (!profile) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                    <p className="text-sm text-neutral-600">Perfil no encontrado.</p>
                </div>
            </div>
        );
    }

    // Displaying profile
    const avatar =
        profile.avatar_url ||
        defaultAvatar;
    // setting display name
    const displayName =
        profile.username ||
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
                    {profile.id && !isOwnProfile && (
                    <FollowButton
                        viewerId={user.id}
                        profileId={profile.id}
                        isOwnProfile={isOwnProfile}
                        onChanged={() => setFollowRefreshKey((k) => k + 1)}
                    />
                    )}
                    {isOwnProfile && (
                    <Link
                        to="/edit-profile"
                        className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                        Editar Perfil
                    </Link>
                    )}
                </div>
                <>
                    {isOwnProfile && ( // can't view email unless on your own profile
                    <p className="text-sm text-neutral-600 truncate">{user.email}</p>
                    )}
                    {profile.id && 
                    <FollowCounts 
                        profileId={profile.id} 
                        refreshKey={followRefreshKey} 
                        className="mt-1" 
                    />}

                    {profile.bio && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-line">
                        {profile.bio}
                    </p>
                    )}

                    <ReadingGoalWidget
                        goal={goal?.target ?? null}
                        progress={progress}
                        isOwnProfile={isOwnProfile}
                        isEditing={isEditing}
                        goalInput={goalInput}
                        goalSaving={goalSaving}
                        goalSaveError={goalSaveError}
                        onEditClick={onEditClick}
                        onGoalInputChange={onGoalInputChange}
                        onSave={onSave}
                        onCancel={onCancel}
                    />
                </>
            </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
            <ProfileTabView
                activeTab={activeTab}
                onChange={setActiveTab}
                library={library}
                libraryLoading={libraryLoading}
                libraryError={libraryError}
                posts={posts}
                postsLoading={postsLoading}
                postsError={postsError}
                onPostDeleted={(deletedPostId) => {
                    setPosts((prev) => prev.filter((post) => post.id !== deletedPostId));
                }}
                onPostToggleLike={handleToggleLike}
            />
        </div>
    </div>
  );
};
