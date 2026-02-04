import  { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/default-avatar.svg";
import type { ProfileRow, UserBookRow } from "../types/Profile";
import type { Post } from "../types/Post";
import { useState, useEffect } from "react";
import { getProfileById, getProfileByUsername, getUserBooksByUserId, updateProfileById } from "../services/profiles";
import { getPosts } from "../services/posts";
import { EditProfileForm } from "../components/EditProfileForm";
import { ProfileTabView } from "../components/ProfileTabView";
import { useParams } from "react-router-dom";
import { FollowButton } from "../components/FollowButton";
import { FollowCounts } from "../components/FollowCounts";
import { useToggleLike } from "../hooks/useToggleLike";


export const Profile = () => {
    const { user, refreshProfile } = useAuth();
    const { username } = useParams<{ username?: string }>();

    const [profile, setProfile] = useState<ProfileRow | null>(null);
    // checking if the user is viewing their own profile
    const isOwnProfile = !username ? !!user : profile?.id === user?.id;
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [followRefreshKey, setFollowRefreshKey] = useState(0); // to refresh the follower count
    const [activeTab, setActiveTab] = useState<"library" | "posts">("library");
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [libraryError, setLibraryError] = useState<string | null>(null);
    const [library, setLibrary] = useState<{
        want_to_read: UserBookRow[];
        reading: UserBookRow[];
        finished: UserBookRow[];
    }>({
        want_to_read: [],
        reading: [],
        finished: [],
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [postsLoadedFor, setPostsLoadedFor] = useState<string | null>(null);
    const handleToggleLike = useToggleLike({ userId: user?.id, setPosts });

    // don't carry the refresh key for follower count to other profiles
    useEffect(() => {
        setFollowRefreshKey(0);
    }, [profile?.id]);

    // setting profile
    useEffect(() => {
        // nothing to fetch
        if (!user && !username) return;
        
        setIsLoading(true);
        setErrorMsg(null);

        (async () => {
        try {
            const data = username
            ? await getProfileByUsername(username)
            : await getProfileById(user!.id)

            setProfile(data);
        } catch (err) {
            const message =
            err instanceof Error ? err.message : "Error al cargar el perfil.";
            setErrorMsg(message);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
        })();
    }, [username, user]);

    // useEffect to load library tab on mounting (the library tab is default)
    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        (async () => {
            setLibraryLoading(true);
            setLibraryError(null);

            try {
            if (!profile?.id) return;
            const rows = await getUserBooksByUserId(profile.id);

            const grouped = {
                want_to_read: rows.filter((r) => r.status === "want_to_read"),
                reading: rows.filter((r) => r.status === "reading"),
                finished: rows.filter((r) => r.status === "finished"),
            };

            if (isMounted) setLibrary(grouped);
            } catch (err) {
            const message = err instanceof Error ? err.message : "Error al cargar la biblioteca.";
            if (isMounted) setLibraryError(message);
            } finally {
            if (isMounted) setLibraryLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [user, profile?.id]);


    // useEffect to load the posts by the user, is only called if the active tab is posts
    useEffect(() => {
        if (activeTab !== "posts") return;
        if (!profile?.id) return;
        // if posts have already been loaded, don't load again
        if (postsLoadedFor === profile.id) return;

        // using isMounted variable to avoid setting states 
        // if the page is unmounted (navigated to a different page)
        let isMounted = true;
        setPostsLoading(true);
        setPostsError(null);

        getPosts({ userId: profile.id })
            .then((data) => {
                if (!isMounted) return;
                setPosts(data);
                setPostsLoadedFor(profile.id);
            })
            .catch((err) => {
                console.error(err);
                if (!isMounted) return;
                setPostsError("No se pudieron cargar las publicaciones");
            })
            .finally(() => {
                if (!isMounted) return;
                setPostsLoading(false);
            });

        // if the page is unmounted, react runs this cleanup
        return () => {
            isMounted = false;
        };
    }, [activeTab, profile?.id, postsLoadedFor]);

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
        defaultAvatar;
    // setting display name
    const displayName =
        profile?.username ||
        profile?.email ||
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
                    {profile?.id && !isOwnProfile && (
                    <FollowButton
                        viewerId={user.id}
                        profileId={profile.id}
                        isOwnProfile={isOwnProfile}
                        onChanged={() => setFollowRefreshKey((k) => k + 1)}
                    />
                    )}
                    {isOwnProfile && !isEditing ? (
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
                        void refreshProfile();
                        setIsEditing(false);
                        }}
                    />
                )}
                
                {!isEditing && (
                    <>
                        {isOwnProfile && ( // can't view email unless on your own profile
                        <p className="text-sm text-neutral-600 truncate">{user.email}</p>
                        )}
                        {profile?.id && 
                        <FollowCounts 
                            profileId={profile.id} 
                            refreshKey={followRefreshKey} 
                            className="mt-1" 
                        />}

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
        <div className="mt-4">
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
    </div>
  );
};
