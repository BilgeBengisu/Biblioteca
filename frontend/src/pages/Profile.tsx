import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    
    return (
        <div>
            <h1>Bienvenido, {user?.username}</h1>
        </div>
    )
}

export default Profile;