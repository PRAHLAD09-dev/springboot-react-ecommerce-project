import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSendOTP = () => {

        localStorage.setItem("resetEmail", email);
        navigate("/reset-password");
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-80 p-6 shadow rounded bg-white">

                <h2 className="text-xl font-bold mb-4 text-center">
                    Forgot Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="w-full border p-2 mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleSendOTP}
                    className="w-full bg-yellow-500 text-white p-2"
                >
                    Send OTP
                </button>

            </div>
        </div>
    );
}

export default ForgetPassword;