export function Skeleton({ className = "" }) {
    return <div className={`skeleton animate-shimmer ${className}`} />;
}

export function SkeletonCard() {
    return (
        <div className="card-surface overflow-hidden">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2.5 p-4">
                <Skeleton className="h-3.5 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-1/2 rounded-md" />
                <Skeleton className="h-5 w-1/3 rounded-md" />
            </div>
        </div>
    );
}

export function SkeletonCardGrid({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonRow({ cols = 4 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-full rounded-md" />
                </td>
            ))}
        </tr>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} cols={cols} />
            ))}
        </tbody>
    );
}
