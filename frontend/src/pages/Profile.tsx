import { useAuth } from "../contexts/AuthContext";
import './Profile.css';
import { useEffect, useState } from "react";

const Profile: React.FC = () => {
    const { user, fetchFollowers, fetchFollowing } = useAuth();
    
    const displayName = user?.profile?.username || user?.user_metadata?.full_name || user?.email || "usuario";
    const profile_picture = user?.profile?.picture_url || user?.user_metadata?.picture_url || null;

    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        if (!user) return; // wait until user is loaded
        (async () => {
        const followerCount = await fetchFollowers(user.id);
        const followingCount = await fetchFollowing(user.id);
        setFollowerCount(followerCount);
        setFollowingCount(followingCount);
        })();
    }, [user, fetchFollowers, fetchFollowing]);

    if (!user) return <p>Loading profile...</p>;

    return (
        <div>
            <div className='profile-pic-wrapper'>
                {profile_picture ? (
                    <img
                    src={profile_picture}
                    alt="Profile"
                    className="profile-pic"
                    />
                ) : (
                    <div className="profile-pic" />
                )}
            </div>
            <h1 className="text-xl font-semibold">{displayName}</h1>
            <h3>Follower count: {followerCount}</h3>
            <h3>Following count: {followingCount}</h3>
        </div>
    )
}

export default Profile;