export function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

export const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
export const STRENGTH_COLORS = ["bg-danger-500", "bg-danger-500", "bg-warning-500", "bg-brand-500", "bg-success-500"];

export function formatCountdown(totalSeconds) {
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
