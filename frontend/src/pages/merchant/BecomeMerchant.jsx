import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function BecomeMerchant() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem("email");
        setEmail(userEmail || "");
    }, []);

    const handleSendOtp = async () => {
        try {
            await API.post("/auth/send-otp", {
                email: email
            });

            alert("OTP sent to your email");
            setOtpSent(true);

        } catch (err) {
            console.log(err);
            alert("Failed to send OTP");
        }
    };

    const handleBecomeMerchant = async () => {
        if (!businessName || !otp) {
            alert("All fields required");
            return;
        }

        try {
            const res = await API.post(
                "/auth/merchant/register",
                {
                    businessName,
                    email,
                    otp
                }
            );

            console.log(res.data);

            alert("Merchant request submitted successfully");

            navigate("/profile");

        } catch (err) {
            console.log(err);
            alert(
                err.response?.data?.message ||
                "Merchant registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-96">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Become Merchant
                </h1>

                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full border p-2 mb-4 bg-gray-100"
                />

                <input
                    type="text"
                    placeholder="Enter Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full border p-2 mb-4"
                />

                {!otpSent ? (
                    <button
                        onClick={handleSendOtp}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        Send OTP
                    </button>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border p-2 mt-4 mb-4"
                        />

                        <button
                            onClick={handleBecomeMerchant}
                            className="w-full bg-green-500 text-white p-2 rounded"
                        >
                            Verify & Become Merchant
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BecomeMerchant;