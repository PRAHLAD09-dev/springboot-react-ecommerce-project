import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function ForgetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(300);

    useEffect(() => {

        let interval;

        if (step === 2 && timer > 0) {

            interval = setInterval(() => {

                setTimer(prev => prev - 1);

            }, 1000);

        }

        return () => clearInterval(interval);

    }, [step, timer]);

    const handleSendOTP = async () => {

        if (!form.email.trim()) {

            alert("Enter email");
            return;
        }

        try {

            setLoading(true);

            await API.post(
                "/auth/forgot-password",
                {
                    email: form.email
                }
            );

            alert("OTP sent successfully");

            setStep(2);
            setTimer(300);

        }
        catch (err) {

            alert("Something went wrong");
        }
        finally {

            setLoading(false);
        }
    };


    const handleResendOtp = async () => {

        try {

            await API.post(
                "/auth/forgot-password",
                {
                    email: form.email
                }
            );

            setTimer(300);

            alert("OTP resent successfully");

        }
        catch {

            alert("Failed to resend OTP");
        }
    };

    const handleResetPassword = async () => {

        if (
            form.password !==
            form.confirmPassword
        ) {

            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            await API.post(
                "/auth/reset-password",
                {
                    email: form.email,
                    otp: form.otp,
                    newPassword: form.password
                }
            );

            alert("Password reset successful");

            navigate("/login");

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Reset failed"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div className="
                min-h-screen
                flex
                justify-center
                items-center
                bg-gray-50
                px-4
            ">

            <div className="
                w-full
                max-w-md
                bg-white
                shadow-xl
                rounded-2xl
                p-8
            ">

                <h1 className="
                    text-3xl
                    font-bold
                    text-center
                    mb-2
                ">
                    Forgot Password
                </h1>

                <p className="
                    text-center
                    text-gray-500
                    mb-6
                ">
                    Reset your account password
                </p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                    disabled={step > 1}
                    className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        mb-4
                    "
                />

                {
                    step === 1 && (

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="
                                w-full
                                bg-yellow-500
                                hover:bg-yellow-600
                                text-white
                                py-3
                                rounded-xl
                            "
                        >
                            Send OTP
                        </button>

                    )
                }

                {
                    step === 2 && (

                        <>

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={form.otp}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        otp: e.target.value
                                    })
                                }
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    p-3
                                    mb-4
                                "
                            />

                            <div className="
                                text-center
                                mb-4
                            ">

                                OTP expires in

                                {" "}

                                <span className="
                                    text-red-500
                                    font-semibold
                                ">

                                    {Math.floor(timer / 60)}
                                    :
                                    {String(timer % 60)
                                        .padStart(2, "0")}

                                </span>

                            </div>

                            <input
                                type="password"
                                placeholder="New Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    p-3
                                    mb-4
                                "
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        confirmPassword:
                                            e.target.value
                                    })
                                }
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    p-3
                                    mb-4
                                "
                            />

                            <div className="
                                bg-blue-50
                                border
                                border-blue-200
                                rounded-xl
                                p-4
                                text-sm
                                mb-4
                                ">

                                <h4 className="
                                   font-semibold
                                   mb-2
                                   ">
                                    Password Requirements
                                </h4>

                                <ul className="space-y-1">

                                    <li>✓ 8-20 characters</li>
                                    <li>✓ One uppercase letter</li>
                                    <li>✓ One lowercase letter</li>
                                    <li>✓ One number</li>

                                </ul>

                            </div>

                            <div className="
                                 text-center
                                 mb-4
                                 ">

                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={timer > 0}
                                    className="
                                    text-blue-600
                                    font-medium
                                    disabled:text-gray-400
                                    "
                                >

                                    {
                                        timer > 0
                                            ? `Resend OTP in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                                            : "Resend OTP"
                                    }

                                </button>

                            </div>

                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="
                            w-full
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            py-3
                            rounded-xl
                            "
                            >
                                {
                                    loading
                                        ? "Resetting..."
                                        : "Reset Password"
                                }
                            </button>

                            <div className="text-center mt-5">

                                <p className="text-gray-600">

                                    Remember your password?

                                    <span
                                        onClick={() => navigate("/login")}
                                        className="
                                            text-blue-600
                                            cursor-pointer
                                            ml-1
                                            font-medium
                                        "
                                    >
                                        Login
                                    </span>

                                </p>

                            </div>

                        </>

                    )
                }

            </div>

        </div>

    );
}

export default ForgetPassword;