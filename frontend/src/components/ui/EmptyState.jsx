export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-16 text-center ${className}`}>
            {Icon && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs">
                    <Icon size={24} className="text-ink-400" />
                </div>
            )}
            <h3 className="text-base font-semibold text-ink-800">{title}</h3>
            {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
