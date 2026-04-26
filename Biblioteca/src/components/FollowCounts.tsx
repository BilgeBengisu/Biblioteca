import { useFollowCounts } from "../hooks/useFollowCounts";

type FollowCountsProps = {
  profileId: string;
  refreshKey?: number;
  className?: string;
};

export function FollowCounts({ profileId, refreshKey = 0, className }: FollowCountsProps) {
  const { counts, error } = useFollowCounts(profileId, refreshKey);

  return (
    <div className={className}>
      <div className="flex items-center gap-4 text-sm text-neutral-600">
        <span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {counts == null
              ? <span className="inline-block w-5 h-3 rounded bg-neutral-100 dark:bg-neutral-700 animate-pulse align-middle" />
              : counts.followers}
          </span>{" "}
          Seguidores
        </span>
        <span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {counts == null
              ? <span className="inline-block w-5 h-3 rounded bg-neutral-100 dark:bg-neutral-700 animate-pulse align-middle" />
              : counts.following}
          </span>{" "}
          Siguiendo
        </span>
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
