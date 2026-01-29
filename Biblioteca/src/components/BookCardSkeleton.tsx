export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Cover */}
      <div className="aspect-[2/3] mb-2 rounded-lg bg-neutral-200 dark:bg-neutral-800" />

      {/* Title */}
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-1" />

      {/* Author */}
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />

      {/* Rating */}
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mt-2" />
    </div>
  );
};