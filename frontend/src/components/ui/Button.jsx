import { Loader2 } from "lucide-react";

const VARIANTS = {
    primary:
        "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 disabled:bg-ink-200 disabled:text-ink-400",
    secondary:
        "bg-white text-ink-800 border border-ink-200 shadow-xs hover:bg-ink-50 hover:border-ink-300 active:bg-ink-100 disabled:text-ink-300 disabled:bg-ink-50",
    outline:
        "bg-transparent text-brand-700 border border-brand-200 hover:bg-brand-50 active:bg-brand-100 disabled:text-ink-300 disabled:border-ink-200",
    ghost:
        "bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200 disabled:text-ink-300",
    danger:
        "bg-danger-600 text-white shadow-sm hover:bg-danger-700 active:bg-danger-700/90 disabled:bg-ink-200 disabled:text-ink-400",
    success:
        "bg-success-600 text-white shadow-sm hover:bg-success-700 active:bg-success-700/90 disabled:bg-ink-200 disabled:text-ink-400",
    warning:
        "bg-warning-500 text-white shadow-sm hover:bg-warning-600 active:bg-warning-600/90 disabled:bg-ink-200 disabled:text-ink-400",
};

const SIZES = {
    sm: "h-9 px-3.5 text-sm gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-[52px] px-7 text-base gap-2.5",
    icon: "h-11 w-11 justify-center",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = "left",
    fullWidth = false,
    className = "",
    type = "button",
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`
                inline-flex items-center rounded-xl font-semibold
                transition-all duration-150 ease-out
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:active:scale-100
                ${VARIANTS[variant]} ${SIZES[size]}
                ${fullWidth ? "w-full justify-center" : ""}
                ${className}
            `}
            {...props}
        >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {!loading && Icon && iconPosition === "left" && <Icon size={16} />}
            {children}
            {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
        </button>
    );
}
