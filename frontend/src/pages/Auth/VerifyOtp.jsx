import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Mail } from "lucide-react";
import API from "../../services/api";
import { Input, Button } from "../../components/ui";

const OTP_LENGTH = 6;

function VerifyOtp() {
    const navigate = useNavigate();

    const name = localStorage.getItem("signupName");
    const email = localStorage.getItem("signupEmail");
    const role = localStorage.getItem("signupRole");

    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const inputsRef = useRef([]);

    const otp = digits.join("");

    const setDigit = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const next = [...digits];
        next[index] = value;
        setDigits(next);
        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((ch, i) => (next[i] = ch));
        setDigits(next);
        inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleRegister = async () => {
        setFormError("");
        const next = {};
        if (otp.length < OTP_LENGTH) next.otp = "Enter the full 6-digit code";
        if (!password) next.password = "Password is required";
        if (password !== confirmPassword) next.confirmPassword = "Passwords do not match";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        try {
            setLoading(true);

            const url = role === "MERCHANT" ? "/auth/merchant/register" : "/auth/user/register";

            const payload =
                role === "MERCHANT"
                    ? { businessName: name, email, otp, password }
                    : { name, email, otp, password };

            const res = await API.post(url, payload);

            if (res.data.success) {
                localStorage.removeItem("signupName");
                localStorage.removeItem("signupEmail");
                localStorage.removeItem("signupRole");
                navigate("/login");
            } else {
                setFormError(res.data.message || "Registration failed");
            }
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
                        <ShieldCheck size={22} />
                    </div>
                    <h1 className="text-2xl font-bold text-ink-950">Verify your email</h1>
                    {email && (
                        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-ink-500">
                            <Mail size={14} /> {email}
                        </p>
                    )}
                </div>

                <div className="card-surface space-y-5 p-6 sm:p-8">
                    {formError && (
                        <div className="animate-slide-down rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-ink-700">Enter verification code</label>
                        <div className="flex justify-between gap-2" onPaste={handlePaste}>
                            {digits.map((d, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    aria-label={`Digit ${i + 1} of verification code`}
                                    value={d}
                                    onChange={(e) => setDigit(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    inputMode="numeric"
                                    maxLength={1}
                                    className={`h-12 w-11 rounded-xl border text-center text-lg font-bold text-ink-900 shadow-xs outline-none transition-all sm:h-14 sm:w-12 ${
                                        errors.otp ? "border-danger-500" : "border-ink-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                                    }`}
                                />
                            ))}
                        </div>
                        {errors.otp && <p className="mt-1.5 text-xs font-medium text-danger-600">{errors.otp}</p>}
                    </div>

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        icon={Lock}
                        placeholder="Create a password"
                        value={password}
                        error={errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Input
                        id="confirmPassword"
                        label="Confirm password"
                        type="password"
                        icon={Lock}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        error={errors.confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button fullWidth size="lg" loading={loading} onClick={handleRegister}>
                        Verify &amp; create account
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;
