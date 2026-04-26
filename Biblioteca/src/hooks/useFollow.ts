import { useState, useEffect } from "react";
import { followUser, isFollowing, unfollowUser } from "../services/follows";

export function useFollow({
  viewerId,
  profileId,
  isOwnProfile,
  onChanged,
}: {
  viewerId: string;
  profileId: string;
  isOwnProfile: boolean;
  onChanged?: (nextFollowing: boolean) => void;
}) {
  const [following, setFollowing] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOwnProfile) return;

    let alive = true;
    setChecking(true);
    setError(null);

    isFollowing(viewerId, profileId)
      .then((f) => { if (alive) setFollowing(f); })
      .catch(() => { if (alive) setError("No se pudo verificar el follow."); })
      .finally(() => { if (alive) setChecking(false); });

    return () => { alive = false; };
  }, [viewerId, profileId, isOwnProfile]);

  const toggle = async () => {
    if (isOwnProfile) return;

    setLoading(true);
    setError(null);
    const next = !following;
    setFollowing(next);

    try {
      if (next) await followUser(viewerId, profileId);
      else await unfollowUser(viewerId, profileId);
      onChanged?.(next);
    } catch {
      setFollowing(!next);
      onChanged?.(!next);
      setError("No se pudo actualizar el follow.");
    } finally {
      setLoading(false);
    }
  };

  return { following, checking, loading, error, toggle };
}
