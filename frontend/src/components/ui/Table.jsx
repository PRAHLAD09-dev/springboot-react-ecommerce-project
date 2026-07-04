export function TableContainer({ children }) {
    return (
        <div className="card-surface overflow-hidden !p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">{children}</table>
            </div>
        </div>
    );
}

export function Thead({ children }) {
    return (
        <thead className="sticky top-0 z-10 border-b border-ink-200 bg-ink-50/90 backdrop-blur">
            <tr>{children}</tr>
        </thead>
    );
}

export function Th({ children, className = "" }) {
    return (
        <th className={`whitespace-nowrap px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-ink-500 ${className}`}>
            {children}
        </th>
    );
}

export function Tbody({ children }) {
    return <tbody className="divide-y divide-ink-100">{children}</tbody>;
}

export function Tr({ children, className = "", ...props }) {
    return (
        <tr className={`transition-colors hover:bg-ink-50/70 ${className}`} {...props}>
            {children}
        </tr>
    );
}

export function Td({ children, className = "" }) {
    return <td className={`px-4 py-3.5 align-middle text-ink-700 ${className}`}>{children}</td>;
}
