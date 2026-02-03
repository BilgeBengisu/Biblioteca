export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-sm space-y-3 border border-neutral-100 dark:border-neutral-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}
