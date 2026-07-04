export default function MiniBarChart({ data, color = "#4F3DE8", height = 180 }) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative flex w-full flex-1 items-end">
                        <div
                            className="w-full rounded-t-md transition-all duration-700 ease-out"
                            style={{
                                height: `${Math.max((d.value / max) * 100, 4)}%`,
                                backgroundColor: color,
                                opacity: 0.85,
                            }}
                            title={`${d.label}: ${d.value}`}
                        />
                    </div>
                    <span className="text-[11px] font-medium text-ink-400">{d.label}</span>
                </div>
            ))}
        </div>
    );
}
