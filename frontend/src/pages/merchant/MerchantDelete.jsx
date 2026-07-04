import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Card, Input, Button } from "../../components/ui";

function MerchantDelete() {
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const navigate = useNavigate();

    const handleSendOtp = async () => {
        setError("");
        setInfo("");
        try {
            setLoading(true);
            const res = await API.post("/merchant/delete/request");
            setInfo(res.data.message || "OTP sent successfully");
            setOtpSent(true);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError("");
        if (!otp) {
            setError("Enter OTP first");
            return;
        }

        try {
            setLoading(true);
            const res = await API.delete(`/merchant/delete ? otp = ${otp}`);
            setInfo(res.data.message || "Merchant account deleted");
            localStorage.removeItem("merchant");
            navigate("/profile");
            window.location.reload();
        } catch (err) {
            console.log(err.response?.data || err);
            setError(err.response?.data?.message || "Failed to delete merchant account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex max-w-md flex-col items-center py-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50">
                <ShieldAlert size={22} className="text-danger-600" />
            </div>

            <Card className="w-full">
                <h1 className="mb-1.5 text-center text-xl font-bold text-danger-600">Delete Merchant Account</h1>
                <p className="mb-6 text-center text-sm text-ink-500">
                    This will permanently remove your merchant profile and listings.
                </p>

                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                        <AlertTriangle size={16} /> {error}
                    </div>
                )}
                {info && (
                    <div className="mb-4 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">{info}</div>
                )}

                {!otpSent ? (
                    <Button variant="danger" fullWidth size="lg" loading={loading} onClick={handleSendOtp}>
                        Send OTP to confirm
                    </Button>
                ) : (
                    <div className="space-y-4">
                        <Input
                            label="Verification code"
                            placeholder="Enter the OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button variant="danger" fullWidth size="lg" loading={loading} onClick={handleDelete}>
                            Permanently delete account
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default MerchantDelete;
