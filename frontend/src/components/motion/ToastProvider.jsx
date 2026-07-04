import { useCallback, useRef, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from "lucide-react";
import { ToastContext } from "./toastContext";

const VARIANTS = {
    success: { icon: CheckCircle2, ring: "border-success-200", iconColor: "text-success-600", bar: "bg-success-500" },
    error: { icon: XCircle, ring: "border-danger-200", iconColor: "text-danger-600", bar: "bg-danger-500" },
    warning: { icon: AlertTriangle, ring: "border-warning-200", iconColor: "text-warning-600", bar: "bg-warning-500" },
    info: { icon: Info, ring: "border-brand-200", iconColor: "text-brand-600", bar: "bg-brand-500" },
    loading: { icon: Loader2, ring: "border-ink-200", iconColor: "text-ink-500", bar: "bg-ink-300" },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const show = useCallback((message, opts = {}) => {
        const id = ++idRef.current;
        const variant = opts.variant || "info";
        const duration = variant === "loading" ? null : (opts.duration ?? 3500);

        setToasts((prev) => [...prev, { id, message, title: opts.title, variant }]);

        if (duration) {
            setTimeout(() => dismiss(id), duration);
        }
        return id;
    }, [dismiss]);

    const toast = {
        success: (message, opts) => show(message, { ...opts, variant: "success" }),
        error: (message, opts) => show(message, { ...opts, variant: "error" }),
        warning: (message, opts) => show(message, { ...opts, variant: "warning" }),
        info: (message, opts) => show(message, { ...opts, variant: "info" }),
        loading: (message, opts) => show(message, { ...opts, variant: "loading" }),
        dismiss,
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <div className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5 sm:bottom-6 sm:right-6">
                {toasts.map((t) => {
                    const cfg = VARIANTS[t.variant];
                    const Icon = cfg.icon;
                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border bg-white p-4 shadow-lg animate-slide-up ${cfg.ring}`}
                        >
                            <Icon size={18} className={`mt-0.5 shrink-0 ${cfg.iconColor} ${t.variant === "loading" ? "animate-spin" : ""}`} />
                            <div className="min-w-0 flex-1">
                                {t.title && <p className="text-sm font-semibold text-ink-900">{t.title}</p>}
                                <p className="text-sm text-ink-600">{t.message}</p>
                            </div>
                            {t.variant !== "loading" && (
                                <button
                                    onClick={() => dismiss(t.id)}
                                    aria-label="Dismiss notification"
                                    className="shrink-0 rounded-lg p-1 text-ink-300 hover:bg-ink-100 hover:text-ink-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            {t.variant !== "loading" && (
                                <div className={`absolute bottom-0 left-0 h-0.5 w-full origin-left animate-[shrinkWidth_3.5s_linear_forwards] ${cfg.bar}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
