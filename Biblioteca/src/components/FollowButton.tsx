import { useFollow } from "../hooks/useFollow";

type FollowButtonProps = {
  viewerId: string;
  profileId: string;
  isOwnProfile: boolean;
  className?: string;
  onChanged?: (nextFollowing: boolean) => void;
};

export function FollowButton({
  viewerId,
  profileId,
  isOwnProfile,
  className,
  onChanged,
}: FollowButtonProps) {
  const { following, checking, loading, error, toggle } = useFollow({
    viewerId,
    profileId,
    isOwnProfile,
    onChanged,
  });

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

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
