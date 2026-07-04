import { useState } from "react";
import API from "../../services/api";
import { Lock, KeyRound, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import { Input, Button } from "../../components/ui";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChangePassword = async () => {
        setError("");
        setSuccess("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await API.put("/user/change-password", { oldPassword, newPassword });
            setSuccess("Password changed successfully. Redirecting to login…");
            setTimeout(() => {
                localStorage.clear();
                window.location.href = "/login";
            }, 1000);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            {error && (
                <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</div>
            )}
            {success && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">
                    <CheckCircle2 size={16} /> {success}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <Input
                        label="Current password"
                        type="password"
                        icon={Lock}
                        placeholder="Enter current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <Input
                        label="New password"
                        type="password"
                        icon={KeyRound}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Input
                        label="Confirm new password"
                        type="password"
                        icon={KeyRound}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="h-fit rounded-2xl border border-brand-100 bg-brand-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-brand-600" />
                        <h3 className="text-base font-semibold text-ink-900">Password requirements</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-ink-600">
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-500" /> 8–20 characters</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-500" /> One uppercase letter</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-500" /> One lowercase letter</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-500" /> One number</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-500" /> One special character</li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-ink-100 pt-5">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                    }}
                >
                    Clear
                </Button>
                <Button icon={Save} loading={loading} onClick={handleChangePassword}>
                    Change password
                </Button>
            </div>
        </div>
    );
}

export default ChangePassword;
