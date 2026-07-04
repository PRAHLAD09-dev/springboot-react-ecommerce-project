export default function Card({ children, className = "", hover = false, padding = "md", ...props }) {
    const paddings = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" };
    return (
        <div
            className={`
                card-surface
                ${paddings[padding]}
                ${hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" : ""}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
    return (
        <div className={`mb-5 flex items-start justify-between gap-4 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
                {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}
