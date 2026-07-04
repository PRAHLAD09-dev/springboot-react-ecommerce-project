const SIZES = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg", xl: "h-20 w-20 text-2xl" };

export default function Avatar({ src, name = "", size = "md", className = "" }) {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    if (src) {
        return (
            <img
                src={src}
                alt={name || "avatar"}
                className={`${SIZES[size]} rounded-full object-cover ring-2 ring-white shadow-xs ${className}`}
            />
        );
    }

    return (
        <div
            className={`${SIZES[size]} flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-white shadow-xs ${className}`}
        >
            {initials || "?"}
        </div>
    );
}
