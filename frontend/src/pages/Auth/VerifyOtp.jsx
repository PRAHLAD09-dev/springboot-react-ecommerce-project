import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../services/api";

function VerifyOtp() {
    const navigate = useNavigate();

    const name = localStorage.getItem("signupName");
    const email = localStorage.getItem("signupEmail");
    const role = localStorage.getItem("signupRole");

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleRegister = async () => {
        if (!otp || !password || !confirmPassword) {
            alert("All fields required");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const url =
                role === "MERCHANT"
                    ? "/auth/merchant/register"
                    : "/auth/user/register";

            const payload =
                role === "MERCHANT"
                    ? {
                        businessName: name,
                        email,
                        otp,
                        password,
                    }
                    : {
                        name,
                        email,
                        otp,
                        password,
                    };

            const res = await API.post(url, payload);

            console.log("Register Response:", res.data);

            if (res.data.success) {
                alert("Account created successfully");

                localStorage.removeItem("signupName");
                localStorage.removeItem("signupEmail");
                localStorage.removeItem("signupRole");

                navigate("/login");
            } else {
                alert(res.data.message);
            }

        } catch (err) {
            console.log(
                err.response?.data || err.message
            );

            alert(
                err.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-96 p-6 shadow-lg rounded bg-white">

                <h2 className="text-xl font-bold mb-4 text-center">
                    Verify OTP
                </h2>

                <p className="text-sm mb-3 text-center">
                    {email}
                </p>

                {/* OTP */}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full border p-2 mb-3 rounded"
                    value={otp}
                    onChange={(e) =>
                        setOtp(e.target.value)
                    }
                />

                {/* Password */}
                <div className="relative mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full border p-2 pr-12 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* Confirm Password */}
                <div className="relative mb-4">
                    <input
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Confirm Password"
                        className="w-full border p-2 pr-10 rounded"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                    />

                    <span
                        className="absolute right-3 top-3 cursor-pointer"
                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }
                    >
                        {showConfirmPassword ? (
                            <FaEyeSlash />
                        ) : (
                            <FaEye />
                        )}
                    </span>
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default VerifyOtp;