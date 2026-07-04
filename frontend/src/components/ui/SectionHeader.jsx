export default function SectionHeader({ eyebrow, title, subtitle, action, className = "" }) {
    return (
        <div className={`mb-6 flex flex-wrap items-end justify-between gap-4 ${className}`}>
            <div>
                {eyebrow && (
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">{eyebrow}</p>
                )}
                <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}
