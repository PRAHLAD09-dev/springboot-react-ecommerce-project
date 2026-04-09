import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const email = localStorage.getItem("resetEmail");

    useEffect(() => {
        if (!email) {
            alert("First enter email");
            navigate("/forgot-password");
        }
    }, []);

    const handleReset = () => {
        console.log({ email, otp, password });
        alert("Password Reset Successful");
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-80 p-6 shadow rounded bg-white">

                <h2 className="text-xl font-bold mb-4 text-center">
                    Reset Password
                </h2>

                <p className="text-sm mb-2 text-gray-600">
                    Email: <b>{email}</b>
                </p>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full border p-2 mb-3"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-2 mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleReset}
                    className="w-full bg-green-500 text-white p-2"
                >
                    Reset Password
                </button>

            </div>
        </div>
    );
}

export default ResetPassword;