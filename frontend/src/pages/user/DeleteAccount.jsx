import { useState } from "react";
import API from "../../services/api";
import { ShieldAlert, Trash2, Send, KeyRound } from "lucide-react";
import { Input, Button } from "../../components/ui";

function DeleteAccount() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const handleSendOtp = async () => {
        setError("");
        setInfo("");
        try {
            setLoading(true);
            await API.post("/user/delete/request");
            setOtpSent(true);
            setInfo("OTP sent to your email");
        } catch (err) {
            console.log(err);
            setError("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError("");
        if (!otp.trim()) {
            setError("Enter OTP");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to deactivate your account? You will not be able to login afterwards."
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await API.delete("/user/delete", { params: { otp } });
            localStorage.clear();
            window.location.href = "/";
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Deactivation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-danger-200 bg-danger-50 p-5">
                <ShieldAlert size={24} className="mt-0.5 shrink-0 text-danger-600" />
                <div>
                    <h3 className="font-semibold text-danger-700">Deactivate account</h3>
                    <p className="mt-1.5 text-sm text-danger-600">
                        Your account will be deactivated and you will no longer be able to login.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</div>
            )}
            {info && (
                <div className="mb-4 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">{info}</div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Input
                        label="Verification OTP"
                        icon={KeyRound}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>

                <div className="h-fit rounded-2xl border border-ink-200 bg-ink-50 p-5">
                    <h3 className="mb-3 font-semibold text-ink-900">Steps</h3>
                    <ul className="space-y-2.5 text-sm text-ink-600">
                        <li>1. Click Send OTP</li>
                        <li>2. Check your email</li>
                        <li>3. Enter OTP</li>
                        <li>4. Deactivate account</li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-ink-100 pt-5">
                <Button
                    variant={otpSent ? "secondary" : "primary"}
                    icon={Send}
                    disabled={loading || otpSent}
                    onClick={handleSendOtp}
                >
                    {otpSent ? "OTP sent" : "Send OTP"}
                </Button>

                <Button variant="danger" icon={Trash2} loading={loading} onClick={handleDelete}>
                    Deactivate account
                </Button>
            </div>
        </div>
    );
}

export default DeleteAccount;
