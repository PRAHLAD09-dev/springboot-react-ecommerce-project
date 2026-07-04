import { useEffect, useState } from "react";
import API from "../../services/api";
import { Store, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Input, Button } from "../../components/ui";

function BecomeMerchant() {
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/user/profile");
                setEmail(res.data.data?.email || "");
            } catch (err) {
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    const handleSendOtp = async () => {
        setError("");
        setSuccess("");
        try {
            setLoading(true);
            await API.post("/auth/send-otp", { email });
            setOtpSent(true);
            setSuccess("OTP sent successfully");
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeMerchant = async () => {
        setError("");
        setSuccess("");
        if (!businessName.trim() || !otp.trim()) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/merchant/register", { businessName, email, otp });
            setSuccess(res.data.message || "Merchant request submitted successfully");
            setTimeout(() => window.location.reload(), 900);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 max-w-lg rounded-2xl border border-success-200 bg-success-50 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
                <Sparkles size={18} className="text-success-600" />
                <h3 className="text-lg font-semibold text-ink-900">Become a merchant</h3>
            </div>

            {error && (
                <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</div>
            )}
            {success && (
                <div className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-medium text-success-700">{success}</div>
            )}

            <div className="space-y-4">
                <Input label="Email" icon={Mail} value={email} disabled />

                <Input
                    label="Business name"
                    icon={Store}
                    placeholder="Enter business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                />

                {otpSent && (
                    <Input
                        label="OTP"
                        icon={ShieldCheck}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                )}
            </div>

            <div className="mt-5 flex justify-end">
                {!otpSent ? (
                    <Button loading={loading} onClick={handleSendOtp}>Send OTP</Button>
                ) : (
                    <Button variant="success" loading={loading} onClick={handleBecomeMerchant}>Submit request</Button>
                )}
            </div>
        </div>
    );
}

export default BecomeMerchant;
