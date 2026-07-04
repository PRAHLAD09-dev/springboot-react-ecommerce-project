import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import API from "../../services/api";
import { Input, Button } from "../../components/ui";

function ResetPassword() {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const email = localStorage.getItem("resetEmail");

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleReset = async () => {
        setFormError("");
        const next = {};
        if (!otp) next.otp = "OTP is required";
        if (!password) next.password = "Password is required";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        try {
            setLoading(true);
            await API.post("/auth/reset-password", { email, otp, newPassword: password });
            setSuccess("Password reset successful");
            localStorage.removeItem("resetEmail");
            setTimeout(() => navigate("/login"), 900);
        } catch {
            setFormError("Invalid OTP or something went wrong");
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
                    <h1 className="text-2xl font-bold text-ink-950">Reset password</h1>
                    <p className="mt-1.5 text-sm text-ink-500">
                        For <span className="font-semibold text-ink-700">{email}</span>
                    </p>
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
                        id="otp"
                        label="OTP"
                        icon={ShieldCheck}
                        placeholder="Enter the OTP"
                        value={otp}
                        error={errors.otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <Input
                        id="password"
                        label="New password"
                        type="password"
                        icon={Lock}
                        placeholder="Create a new password"
                        value={password}
                        error={errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button fullWidth size="lg" loading={loading} onClick={handleReset}>
                        Reset password
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
