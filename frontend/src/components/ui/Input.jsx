import { forwardRef, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export const Field = ({ label, htmlFor, error, success, helper, required, children }) => (
    <div className="w-full">
        {label && (
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
                {label}
                {required && <span className="ml-0.5 text-danger-500">*</span>}
            </label>
        )}
        {children}
        {error && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger-600">
                <AlertCircle size={13} /> {error}
            </p>
        )}
        {!error && success && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-success-600">
                <CheckCircle2 size={13} /> {success}
            </p>
        )}
        {!error && !success && helper && (
            <p className="mt-1.5 text-xs text-ink-400">{helper}</p>
        )}
    </div>
);

export const Input = forwardRef(function Input(
    { label, error, success, helper, required, icon: Icon, className = "", id, type = "text", ...props },
    ref
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <Field label={label} htmlFor={id} error={error} success={success} helper={helper} required={required}>
            <div className="relative">
                {Icon && (
                    <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                )}
                <input
                    ref={ref}
                    id={id}
                    type={inputType}
                    className={`
                        input-base
                        ${Icon ? "pl-10" : ""}
                        ${isPassword ? "pr-10" : ""}
                        ${error ? "input-error" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </Field>
    );
});

export const Textarea = forwardRef(function Textarea(
    { label, error, success, helper, required, className = "", id, rows = 4, ...props },
    ref
) {
    return (
        <Field label={label} htmlFor={id} error={error} success={success} helper={helper} required={required}>
            <textarea
                ref={ref}
                id={id}
                rows={rows}
                className={`input-base resize-none ${error ? "input-error" : ""} ${className}`}
                {...props}
            />
        </Field>
    );
});

export const Select = forwardRef(function Select(
    { label, error, success, helper, required, className = "", id, children, ...props },
    ref
) {
    return (
        <Field label={label} htmlFor={id} error={error} success={success} helper={helper} required={required}>
            <select
                ref={ref}
                id={id}
                className={`input-base appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%237A8299"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9 ${error ? "input-error" : ""} ${className}`}
                {...props}
            >
                {children}
            </select>
        </Field>
    );
});
