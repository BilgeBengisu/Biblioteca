
type StarRatingProps = {
  rating: number;
  variant?: "default" | "chip";
  label?: string;
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  variant = "default",
  label = "Calificacion",
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
        <span key={`full-${i}`} className="text-yellow-500">
          ★
        </span>
      ))}
      {hasHalfStar && (
        <span className="relative inline-block text-neutral-300">
          ★
          <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-500">
            ★
          </span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="text-neutral-300">
          ★
        </span>
      ))}
    </>
  );

  if (variant === "chip") {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5"
        role="img"
        aria-label={`${label}: ${displayRating} out of 5 stars`}
      >
        <span className="text-[11px] uppercase tracking-wide text-amber-700 font-semibold">
          {label}
        </span>
        <div className="flex items-center gap-0.5 text-sm">
          {stars}
        </div>
        <span className="text-amber-800 font-semibold text-sm">
          {displayRating}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-end gap-1 text-base"
      role="img"
      aria-label={`${label}: ${displayRating} out of 5 stars`}
    >
      <span className="text-xs uppercase tracking-wide text-neutral-700">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 text-2xl">
          {stars}
        </div>
        <span className="text-neutral-700 font-semibold">
          {displayRating}
        </span>
      </div>
    </div>
  );
};
