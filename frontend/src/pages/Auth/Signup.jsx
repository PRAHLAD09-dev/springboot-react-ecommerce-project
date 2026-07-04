import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ShoppingBag, CheckCircle2, ShieldCheck } from "lucide-react";
import API from "../../services/api";
import { Input, Button } from "../../components/ui";
import { getPasswordStrength, STRENGTH_LABELS, STRENGTH_COLORS, formatCountdown } from "../../utils/passwordStrength";

function Signup() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(300);

    const [form, setForm] = useState({
        name: "",
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
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

    const handleSendOtp = async () => {
        setFormError("");
        const next = {};
        if (!form.name.trim()) next.name = "Name is required";
        if (!form.email.trim()) next.email = "Email is required";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        try {
            setLoading(true);
            await API.post("/auth/send-otp", { email: form.email });
            setSuccess("OTP sent to your email");
            setStep(2);
            setTimer(300);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setFormError("");
        try {
            setLoading(true);
            await API.post("/auth/send-otp", { email: form.email });
            setTimer(300);
            setSuccess("OTP resent successfully");
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
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
            await API.post("/auth/user/register", {
                name: form.name,
                email: form.email,
                otp: form.otp,
                password: form.password
            });
            setSuccess("Account created successfully");
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            setFormError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-ink-50 px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                        <ShoppingBag size={22} />
                    </div>
                    <h1 className="text-2xl font-bold text-ink-950">Create your account</h1>
                    <p className="mt-1.5 text-sm text-ink-500">Join CommerceHub and start shopping smarter</p>
                </div>

                {/* STEP INDICATOR */}
                <div className="mb-6 flex items-center justify-center gap-2">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                    step >= s ? "bg-brand-600 text-white" : "bg-ink-200 text-ink-500"
                                }`}
                            >
                                {step > s ? <CheckCircle2 size={15} /> : s}
                            </div>
                            {s === 1 && <div className={`h-0.5 w-10 rounded ${step > 1 ? "bg-brand-600" : "bg-ink-200"}`} />}
                        </div>
                    ))}
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
                        id="name"
                        label="Full name"
                        icon={User}
                        placeholder="Jordan Lee"
                        value={form.name}
                        error={errors.name}
                        onChange={(e) => setField("name", e.target.value)}
                    />

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
                        <Button fullWidth size="lg" loading={loading} onClick={handleSendOtp}>
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
                                    label="Password"
                                    type="password"
                                    icon={Lock}
                                    placeholder="Create a password"
                                    value={form.password}
                                    error={errors.password}
                                    onChange={(e) => setField("password", e.target.value)}
                                />
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                        i < strength ? STRENGTH_COLORS[strength - 1] : "bg-ink-100"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-1 text-xs font-medium text-ink-500">
                                            {STRENGTH_LABELS[Math.max(strength - 1, 0)]}
                                        </p>
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

                            <Button fullWidth size="lg" loading={loading} onClick={handleRegister}>
                                Create account
                            </Button>
                        </>
                    )}

                    <p className="pt-1 text-center text-sm text-ink-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
