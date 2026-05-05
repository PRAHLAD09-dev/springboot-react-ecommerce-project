import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function MerchantDelete() {
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Send OTP
    const handleSendOtp = async () => {
        try {
            setLoading(true);

            const res = await API.post("/merchant/delete/request");

            alert(res.data.message || "OTP sent successfully");
            setOtpSent(true);

        } catch (err) {
            console.log(err);
            alert(
                err.response?.data?.message || "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!otp) {
            alert("Enter OTP first");
            return;
        }

        try {
            setLoading(true);

            const res = await API.delete(`/merchant/delete ? otp = ${otp}`);

            alert(res.data.message || "Merchant account deleted");

            localStorage.removeItem("merchant");

            navigate("/profile");
            window.location.reload();

        } catch (err) {
            console.log(err.response?.data || err);
            alert(
                err.response?.data?.message ||
                "Failed to delete merchant account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
                    Delete Merchant Account
                </h1>

                {!otpSent ? (
                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border p-3 rounded mb-4"
                        />

                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded"
                        >
                            {loading ? "Deleting..." : "Delete Account"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default MerchantDelete;