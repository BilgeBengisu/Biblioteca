import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
    const { user } = useAuth();
    
    const displayName = user?.profile?.username || user?.user_metadata?.full_name || user?.email || "usuario";

    return (
        <div>
            <h1>Bienvenido, {displayName}</h1> 

        </div>
    )
}

export default Profile;