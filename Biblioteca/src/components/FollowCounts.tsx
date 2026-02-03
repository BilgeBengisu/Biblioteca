import { useEffect, useState } from "react";
import { getFollowCounts } from "../services/follows";

type FollowCountsProps = {
  profileId: string;
  refreshKey?: number; 
  className?: string;
};

export function FollowCounts({ profileId, refreshKey = 0, className }: FollowCountsProps) {
  const [counts, setCounts] = useState<{ followers: number; following: number }>({
    followers: 0,
    following: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setErrorMsg(null);

    (async () => {
      try {
        const c = await getFollowCounts(profileId);
        if (!alive) return;
        setCounts(c);
      } catch (e) {
        if (!alive) return;
        setErrorMsg("No se pudieron cargar seguidores.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [profileId, refreshKey]);

  return (
    <div className={className}>
      <div className="flex items-center gap-4 text-sm text-neutral-600">
        <span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {counts.followers}
          </span>{" "}
          Seguidores
        </span>
        <span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {counts.following}
          </span>{" "}
          Siguiendo
        </span>
      </div>

      {errorMsg && <p className="mt-1 text-xs text-red-600">{errorMsg}</p>}
    </div>
  );
}
