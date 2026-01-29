
export const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const decimal = clampedRating % 1;
  const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const displayRating =
    clampedRating % 1 === 0
      ? clampedRating.toFixed(0)
      : clampedRating.toFixed(1);

  return (
    <div
      className="flex flex-col items-end gap-1 text-base"
      role="img"
      aria-label={`Rating: ${displayRating} out of 5 stars`}
    >
      <span className="text-xs uppercase tracking-wide text-neutral-700">
        Calificacion
      </span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 text-2xl">
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
        </div>
        <span className="text-neutral-700 font-semibold">
          {displayRating}
        </span>
      </div>
    </div>
  );
};