import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import API from "../../services/api";
import { Input, Button } from "../../components/ui";
import { getPasswordStrength, STRENGTH_COLORS, formatCountdown } from "../../utils/passwordStrength";

function ForgetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(300);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const strength = getPasswordStrength(form.password);

    const handleSendOTP = async () => {
        setFormError("");
        if (!form.email.trim()) {
            setErrors({ email: "Email is required" });
            return;
        }
        setErrors({});
        try {
            setLoading(true);
            await API.post("/auth/forgot-password", { email: form.email });
            setSuccess("OTP sent successfully");
            setStep(2);
            setTimer(300);
        } catch {
            setFormError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setFormError("");
        try {
            await API.post("/auth/forgot-password", { email: form.email });
            setTimer(300);
            setSuccess("OTP resent successfully");
        } catch {
            setFormError("Failed to resend OTP");
        }
    };

    const handleResetPassword = async () => {
        setFormError("");
        setSuccess("");
        const next = {};
        if (!form.otp.trim()) next.otp = "OTP is required";
        if (form.password.length < 8) next.password = "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        try {
            setLoading(true);
            await API.post("/auth/reset-password", {
                email: form.email,
                otp: form.otp,
                newPassword: form.password
            });
            setSuccess("Password reset successful");
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            setFormError(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-ink-50 px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                        <KeyRound size={22} />
                    </div>
                    <h1 className="text-2xl font-bold text-ink-950">Forgot password</h1>
                    <p className="mt-1.5 text-sm text-ink-500">We'll help you reset it in a couple of steps</p>
                </div>

                <div className="card-surface space-y-4 p-6 sm:p-8">
                    {formError && (
                        <div className="animate-slide-down rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                            {formError}
                        </div>
                    )}
                    {success && (
                        <div className="animate-slide-down flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">
                            <CheckCircle2 size={16} /> {success}
                        </div>
                    )}

                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        icon={Mail}
                        placeholder="you@example.com"
                        value={form.email}
                        error={errors.email}
                        disabled={step > 1}
                        onChange={(e) => setField("email", e.target.value)}
                    />

                    {step === 1 && (
                        <Button fullWidth size="lg" loading={loading} onClick={handleSendOTP}>
                            Send OTP
                        </Button>
                    )}

                    {step === 2 && (
                        <>
                            <Input
                                id="otp"
                                label="Verification code"
                                icon={ShieldCheck}
                                placeholder="Enter the 6-digit OTP"
                                value={form.otp}
                                error={errors.otp}
                                onChange={(e) => setField("otp", e.target.value)}
                                helper={`Expires in ${formatCountdown(timer)}`}
                            />

                            <div>
                                <Input
                                    id="password"
                                    label="New password"
                                    type="password"
                                    icon={Lock}
                                    placeholder="Create a new password"
                                    value={form.password}
                                    error={errors.password}
                                    onChange={(e) => setField("password", e.target.value)}
                                />
                                {form.password && (
                                    <div className="mt-2 flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                    i < strength ? STRENGTH_COLORS[strength - 1] : "bg-ink-100"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Input
                                id="confirmPassword"
                                label="Confirm password"
                                type="password"
                                icon={Lock}
                                placeholder="Re-enter your password"
                                value={form.confirmPassword}
                                error={errors.confirmPassword}
                                onChange={(e) => setField("confirmPassword", e.target.value)}
                            />

                            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-xs text-brand-800">
                                <p className="mb-1.5 font-semibold">Password must include</p>
                                <ul className="grid grid-cols-2 gap-1">
                                    <li>• 8–20 characters</li>
                                    <li>• One uppercase letter</li>
                                    <li>• One lowercase letter</li>
                                    <li>• One number</li>
                                </ul>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={timer > 0}
                                    className="text-sm font-semibold text-brand-600 disabled:cursor-not-allowed disabled:text-ink-400"
                                >
                                    {timer > 0 ? `Resend OTP in ${formatCountdown(timer)}` : "Resend OTP"}
                                </button>
                            </div>

                            <Button fullWidth size="lg" loading={loading} onClick={handleResetPassword}>
                                Reset password
                            </Button>

                            <p className="pt-1 text-center text-sm text-ink-500">
                                Remember your password?{" "}
                                <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                                    Log in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
