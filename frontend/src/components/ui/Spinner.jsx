import { Loader2 } from "lucide-react";

export function Spinner({ size = 20, className = "" }) {
    return <Loader2 size={size} className={`animate-spin text-brand-600 ${className}`} />;
}

export function PageLoader({ label = "Loading" }) {
    return (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3">
            <Spinner size={28} />
            <p className="text-sm font-medium text-ink-400">{label}…</p>
        </div>
    );
}
