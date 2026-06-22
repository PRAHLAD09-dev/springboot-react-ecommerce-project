import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Signup() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(300);

    const [form, setForm] = useState({
        name: "",
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {

        let interval;

        if (step === 2 && timer > 0) {

            interval = setInterval(() => {

                setTimer(prev => prev - 1);

            }, 1000);

        }

        return () => clearInterval(interval);

    }, [step, timer]);

    const handleSendOtp = async () => {

        if (!form.name.trim() || !form.email.trim()) {

            alert("Name and Email are required");

            return;
        }

        try {

            setLoading(true);

            await API.post(
                "/auth/send-otp",
                {
                    email: form.email
                }
            );

            alert("OTP sent successfully");

            setStep(2);
            setTimer(300);

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to send OTP"
            );
        }
        finally {

            setLoading(false);
        }
    };

    const handleResendOtp = async () => {

        try {

            setLoading(true);

            await API.post(
                "/auth/send-otp",
                {
                    email: form.email
                }
            );

            setTimer(300);

            alert("OTP resent successfully");

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to resend OTP"
            );
        }
        finally {

            setLoading(false);
        }
    };

    const handleRegister = async () => {

        if (form.password.length < 8) {

            alert(
                "Password must be at least 8 characters"
            );

            return;
        }

        if (!form.otp.trim()) {

            alert("OTP is required");

            return;
        }

        if (
            form.password !==
            form.confirmPassword
        ) {

            alert(
                "Passwords do not match"
            );

            return;
        }

        try {

            setLoading(true);

            await API.post(
                "/auth/user/register",
                {
                    name: form.name,
                    email: form.email,
                    otp: form.otp,
                    password: form.password
                }
            );

            alert(
                "Account created successfully"
            );

            navigate("/login");

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Registration failed"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">

            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h2>

                {/* NAME */}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                    className="w-full border rounded-xl p-3 mb-4"
                />

                {/* EMAIL */}

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                    className="w-full border rounded-xl p-3 mb-4"
                    disabled={step > 1}
                />

                {
                    step === 1 && (

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="
                                w-full
                                bg-blue-600
                                text-white
                                py-3
                                rounded-xl
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {
                                loading
                                    ? "Sending..."
                                    : "Send OTP"
                            }
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
                                mt-4
                                mb-4
                                "
                            />

                            <div className="mb-4 text-center">

                                <p className="text-sm text-gray-600">

                                    OTP expires in

                                    {" "}

                                    <span className="font-semibold text-red-500">

                                        {Math.floor(timer / 60)}
                                        :
                                        {String(timer % 60).padStart(2, "0")}

                                    </span>

                                </p>

                            </div>

                            <input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password:
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

                            <div className="mb-4">

                                <div className="
                                        bg-blue-50
                                        border
                                        border-blue-200
                                        rounded-xl
                                        p-4
                                        text-sm
                                    ">

                                    <h4 className="font-semibold mb-2">
                                        Password Requirements
                                    </h4>

                                    <ul className="space-y-1">

                                        <li>
                                            ✓ 8-20 characters
                                        </li>

                                        <li>
                                            ✓ One uppercase letter
                                        </li>

                                        <li>
                                            ✓ One lowercase letter
                                        </li>

                                        <li>
                                            ✓ One number
                                        </li>

                                    </ul>

                                </div>
                                <div className="mb-4 text-center">

                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={timer > 0}
                                        className="
                                            text-blue-600
                                            font-medium
                                            disabled:text-gray-400
                                            disabled:cursor-not-allowed
                                        "
                                    >

                                        {timer > 0
                                            ? `Resend OTP in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                                            : "Resend OTP"}

                                    </button>

                                </div>

                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="
                                        w-full
                                        bg-green-600
                                        text-white
                                        py-3
                                        rounded-xl
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                            >
                                {
                                    loading
                                        ? "Creating..."
                                        : "Create Account"
                                }
                            </button>
                        </>
                    )
                }

                <div className="text-center mt-5">

                    <p className="text-gray-600">

                        Already have an account?

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

            </div>

        </div>
    );
}

export default Signup;