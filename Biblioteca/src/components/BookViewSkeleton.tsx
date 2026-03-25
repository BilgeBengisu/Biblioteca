export function BookViewSkeleton() {
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4 animate-pulse">
            <div className="mb-4">
                <div className="h-4 w-16 bg-neutral-200 rounded" />
            </div>
            <div className="flex gap-6 relative rounded-xl p-4 bg-neutral-100">
                <div className="h-64 w-44 bg-neutral-200 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col justify-center gap-3">
                    <div className="h-8 w-3/4 bg-neutral-200 rounded" />
                    <div className="h-5 w-1/2 bg-neutral-200 rounded" />
                    <div className="h-8 w-32 bg-neutral-200 rounded-full mt-2" />
                </div>
                <div className="p-4 absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 w-6 bg-neutral-200 rounded" />
                    ))}
                </div>
            </div>
            <div className="mt-8 border-b border-neutral-200 pb-4 flex gap-2">
                <div className="h-8 w-24 bg-neutral-200 rounded-full" />
                <div className="h-8 w-16 bg-neutral-200 rounded-full" />
                <div className="h-8 w-16 bg-neutral-200 rounded-full" />
            </div>
            <div className="mt-6 space-y-3">
                <div className="h-7 w-36 bg-neutral-200 rounded" />
                <div className="h-4 w-full bg-neutral-200 rounded" />
                <div className="h-4 w-full bg-neutral-200 rounded" />
                <div className="h-4 w-5/6 bg-neutral-200 rounded" />
                <div className="h-4 w-4/6 bg-neutral-200 rounded" />
            </div>
        </div>
    );
}
