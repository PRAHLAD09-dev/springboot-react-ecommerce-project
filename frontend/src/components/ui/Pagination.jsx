import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange, className = "" }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const add = (p) => pages.push(p);
    const range = 1;

    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= page - range && p <= page + range)) {
            add(p);
        } else if (pages[pages.length - 1] !== "…") {
            add("…");
        }
    }

    const btn = "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors";

    return (
        <div className={`flex items-center justify-center gap-1.5 ${className}`}>
            <button
                onClick={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`${btn} text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:hover:bg-transparent`}
                aria-label="Previous page"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`e${i}`} className="px-1 text-ink-400">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`${btn} ${p === page ? "bg-brand-600 text-white shadow-sm" : "text-ink-600 hover:bg-ink-100"}`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`${btn} text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:hover:bg-transparent`}
                aria-label="Next page"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
