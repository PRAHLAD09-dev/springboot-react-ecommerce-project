import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
    const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div
                className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative w-full ${widths[size]} animate-scale-in rounded-2xl bg-white p-6 shadow-xl`}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div>{children}</div>
                {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
            </div>
        </div>
    );
}
