import { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ open, onClose, title, children, footer, width = "max-w-md" }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
            <div className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />

            <div className={`absolute right-0 top-0 flex h-full w-full ${width} animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)_both] flex-col bg-white shadow-2xl`}>
                <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 sm:px-6">
                    <h3 className="text-lg font-bold text-ink-900">{title}</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

                {footer && <div className="border-t border-ink-100 px-5 py-4 sm:px-6">{footer}</div>}
            </div>
        </div>
    );
}
