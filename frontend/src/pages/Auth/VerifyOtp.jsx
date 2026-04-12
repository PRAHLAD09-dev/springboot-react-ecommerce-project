import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
    const navigate = useNavigate();

    const name = localStorage.getItem("signupName");
    const email = localStorage.getItem("signupEmail");
    const role = localStorage.getItem("signupRole");

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (!otp || !password || !confirmPassword) {
            alert("All fields required");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("REGISTER:", {
            name,
            email,
            role,
            otp,
            password,
        });

        alert('${ role } registered successfully(dummy)');

        navigate("/login");
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-96 p-6 shadow-lg rounded bg-white">

                <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

                <p className="text-sm mb-3 text-center">{email}</p>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full border p-2 mb-3"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-2 mb-4"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    Register
                </button>

            </div>
        </div>
    );
}

export default VerifyOtp;