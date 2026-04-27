import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function DeleteAccount() {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();

    // ================= SEND OTP =================
    const handleSendOtp = async () => {
        try {
            setLoading(true);

            await API.post("/api/user/delete/request");

            setOtpSent(true);
            alert("OTP sent to your email");

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE ACCOUNT =================
    const handleDelete = async () => {

        if (!otp) {
            alert("Please enter OTP");
            return;
        }

        if (otp.length < 4) {
            alert("Invalid OTP");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you absolutely sure? This action is PERMANENT."
        );

        if (!confirmDelete) return;

        try {
            setLoading(true);

            await API.delete("/api/user/delete", {
                params: { otp },
            });

            alert("Account deleted successfully");

            localStorage.clear();
            navigate("/");

        } catch (err) {
            console.log(err.response?.data || err);
            alert(
                err.response?.data?.message ||
                "Delete failed (wrong OTP or server error)"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md relative">

                {/*  BACK BUTTON */}
                <button
                    onClick={() => navigate("/profile")}
                    className="absolute top-4 left-4 text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold mb-4 text-red-600 text-center">
                    Delete Account
                </h1>

                <p className="text-sm text-gray-500 mb-6 text-center">
                    This action is irreversible. All your data will be permanently deleted.
                </p>

                {/* SEND OTP */}
                <button
                    onClick={handleSendOtp}
                    disabled={loading || otpSent}
                    className={`w-full py-2 rounded text-white mb-4 transition
                        ${otpSent
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"}`}
                >
                    {loading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
                </button>

                {/* OTP INPUT */}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                {/* DELETE BUTTON */}
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`w-full py-2 rounded text-white transition
                        ${loading
                            ? "bg-gray-400"
                            : "bg-red-600 hover:bg-red-700"}`}
                >
                    {loading ? "Deleting..." : "Delete Account"}
                </button>

            </div>
        </div>
    );
}

export default DeleteAccount;