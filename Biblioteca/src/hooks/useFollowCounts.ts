import { useState, useEffect } from "react";
import { getFollowCounts } from "../services/follows";

export function useFollowCounts(profileId: string, refreshKey = 0) {
  const [counts, setCounts] = useState<{ followers: number; following: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);

    getFollowCounts(profileId)
      .then((c) => { if (alive) setCounts(c); })
      .catch(() => { if (alive) setError("No se pudieron cargar seguidores."); });

    return () => { alive = false; };
  }, [profileId, refreshKey]);

  return { counts, error };
}
