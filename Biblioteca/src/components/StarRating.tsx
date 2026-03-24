
type StarRatingProps = {
  rating: number;
  variant?: "default" | "chip";
  label?: string;
  size?: "sm" | "md" | "lg";
};

const STAR_SIZE = { sm: "text-sm", md: "text-xl", lg: "text-2xl" };
const NUM_SIZE  = { sm: "text-xs", md: "text-sm", lg: "text-base" };

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  variant = "default",
  label = "Calificacion",
  size = "sm",
}) => {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const decimal = clampedRating % 1;
  const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const displayRating =
    clampedRating % 1 === 0
      ? clampedRating.toFixed(0)
      : clampedRating.toFixed(1);

  const stars = (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-300">
          ★
        </span>
      ))}
      {hasHalfStar && (
        <span className="relative inline-block text-neutral-300 dark:text-neutral-600">
          ★
          <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-300">
            ★
          </span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="text-neutral-300 dark:text-neutral-600">
          ★
        </span>
      ))}
    </>
  );

  if (variant === "chip") {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5"
        role="img"
        aria-label={`${label}: ${displayRating} out of 5 stars`}
      >
        <span className="text-[11px] uppercase tracking-wide text-amber-700 dark:text-yellow-300 font-semibold">
          {label}
        </span>
        <div className="flex items-center gap-0.5 text-sm">{stars}</div>
        <span className="text-amber-800 dark:text-amber-300 font-semibold text-sm">
          {displayRating}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 mt-0.5"
      role="img"
      aria-label={`${displayRating} out of 5 stars`}
    >
      <div className={`flex items-center gap-px ${STAR_SIZE[size]} leading-none`}>{stars}</div>
      <span className={`${NUM_SIZE[size]} text-neutral-500 dark:text-neutral-400 tabular-nums`}>
        {displayRating}
      </span>
    </div>
  );
};
