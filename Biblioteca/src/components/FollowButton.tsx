import { useEffect, useState } from "react";
import { followUser, isFollowing, unfollowUser } from "../services/follows";

type FollowButtonProps = {
  viewerId: string;    // logged-in user id
  profileId: string;   // profile being viewed
  isOwnProfile: boolean;
  className?: string;

  // optional: notify parent so it can refresh counts or do optimistic updates elsewhere
  onChanged?: (nextFollowing: boolean) => void;
};

export function FollowButton({
  viewerId,
  profileId,
  isOwnProfile,
  className,
  onChanged,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOwnProfile) return;

    let alive = true;
    setChecking(true);
    setErrorMsg(null);

    (async () => {
      try {
        const f = await isFollowing(viewerId, profileId);
        if (!alive) return;
        setFollowing(f);
      } catch (e) {
        if (!alive) return;
        setErrorMsg("No se pudo verificar el follow.");
      } finally {
        if (alive) setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [viewerId, profileId, isOwnProfile]);

  const toggle = async () => {
    if (isOwnProfile) return;

    setLoading(true);
    setErrorMsg(null);

    const next = !following;

    // optimistic button state only
    setFollowing(next);

    try {
      if (next) await followUser(viewerId, profileId);
      else await unfollowUser(viewerId, profileId);
      onChanged?.(next); // notify parent after DB write succeeds
    } catch (e) {
      // rollback
      setFollowing(!next);
      onChanged?.(!next);
      setErrorMsg("No se pudo actualizar el follow.");
    } finally {
      setLoading(false);
    }
  };

  if (isOwnProfile || checking) return null;

  return (
    <div className={className}>
      <button
        onClick={toggle}
        disabled={loading}
        className={`text-sm px-3 py-1.5 rounded-lg border disabled:opacity-60 ${
          following
            ? "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            : "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
        }`}
      >
        {following ? "Dejar de seguir" : "Seguir"}
      </button>

      {errorMsg && <p className="mt-1 text-xs text-red-600">{errorMsg}</p>}
    </div>
  );
}
