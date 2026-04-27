import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChangePassword = async () => {

        if (!oldPassword || !newPassword) {
            alert("All fields are required");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            await API.put("/api/user/change-password", {
                oldPassword,
                newPassword,
            });

            alert("Password changed successfully");

            localStorage.clear();
            navigate("/login");

        } catch (err) {
            console.log(err.response?.data || err);
            alert(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md relative">

                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate("/profile")}
                    className="absolute top-4 left-4 text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Change Password
                </h1>

                {/* INPUTS */}
                <input
                    type="password"
                    placeholder="Old Password"
                    className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {/* BUTTON */}
                <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className={`w-full py-2 rounded text-white transition 
                        ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>

            </div>
        </div>
    );
}

export default ChangePassword;