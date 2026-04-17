import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!email) {
            alert("Enter email");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/auth/forgot-password",
                { email }
            );

            localStorage.setItem("resetEmail", email);

            alert("OTP sent (if email exists)");

            navigate("/reset-password");

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
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
                    className="w-full bg-yellow-500 text-white p-2 rounded"
                >
                    Send OTP
                </button>

            </div>
        </div>
    );
}

export default ForgetPassword;