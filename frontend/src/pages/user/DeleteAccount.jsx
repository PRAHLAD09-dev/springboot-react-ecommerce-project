import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function DeleteAccount() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            setLoading(true);

            await API.post("/api/user/delete/request");

            alert("OTP sent to your email ");

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Failed to send OTP ");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!otp) {
            alert("Enter OTP");
            return;
        }

        if (!window.confirm("Are you sure? This action cannot be undone!")) {
            return;
        }

        try {
            setLoading(true);

            await API.delete("/api/user/delete", {
                params: { otp },
            });

            alert("Account deleted successfully ");

            localStorage.clear();
            navigate("/");

        } catch (err) {
            console.log(err.response?.data || err);
            alert(
                err.response?.data?.message ||
                "Delete failed (wrong OTP or error) "
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white shadow-lg rounded-xl p-6 w-96">

                <h1 className="text-2xl font-bold mb-4 text-red-500 text-center">
                    Delete Account
                </h1>

                <p className="text-sm text-gray-600 mb-4 text-center">
                    This action is irreversible
                </p>

                <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded mb-4"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border p-2 mb-4 w-full rounded"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                >
                    {loading ? "Deleting..." : "Delete Account"}
                </button>

            </div>
        </div>
    );
}

export default DeleteAccount;