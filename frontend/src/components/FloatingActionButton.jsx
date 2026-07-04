import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function FloatingActionButton({ actions = [] }) {
    const [open, setOpen] = useState(false);

    if (actions.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
            {open && (
                <div className="flex flex-col items-end gap-2.5 animate-slide-up">
                    {actions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => { action.onClick(); setOpen(false); }}
                            className="flex items-center gap-2.5 rounded-full bg-ink-950 py-2.5 pl-4 pr-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                        >
                            {action.label}
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                <action.icon size={15} />
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={() => setOpen((s) => !s)}
                aria-label={open ? "Close quick actions" : "Open quick actions"}
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl transition-all duration-300 hover:bg-brand-700 active:scale-95 ${
                    open ? "rotate-45" : ""
                }`}
            >
                {open ? <X size={22} /> : <Plus size={22} />}
            </button>
        </div>
    );
}
