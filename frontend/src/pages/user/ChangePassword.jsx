import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            alert("All fields required");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            await API.put("/api/user/change-password", {
                oldPassword,
                newPassword,
            });

            alert("Password changed successfully ");

            localStorage.clear();
            window.location.reload();
            navigate("/login");

        } catch (err) {
            console.log(err.response?.data || err);
            alert(err.response?.data?.message || "Failed to change password ");
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white shadow-lg rounded-xl p-6 w-96">

                <h1 className="text-2xl font-bold mb-5 text-center">
                    Change Password
                </h1>

                <input
                    type="password"
                    placeholder="Old Password"
                    className="border p-2 mb-3 w-full rounded"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="border p-2 mb-4 w-full rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                    onClick={handleChangePassword}
                    className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
                >
                    Change Password
                </button>

            </div>
        </div>
    );
}

export default ChangePassword;