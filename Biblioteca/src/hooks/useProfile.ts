import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getProfileById, getProfileByUsername } from "../services/profiles";
import type { ProfileRow } from "../types/Profile";

export function useProfile(username?: string) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !username) return;

    let alive = true;
    setLoading(true);
    setProfileError(null);

    (async () => {
      try {
        const data = username
          ? await getProfileByUsername(username)
          : await getProfileById(user!.id);
        if (alive) setProfile(data);
      } catch (err) {
        if (alive) setProfileError(err instanceof Error ? err.message : "Error al cargar el perfil.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [username, user]);

  const isOwnProfile = profile != null && user != null && profile.id === user.id;

  return { profile, loading, profileError, isOwnProfile };
}
