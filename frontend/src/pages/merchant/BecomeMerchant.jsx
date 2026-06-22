import { useEffect, useState } from "react";
import API from "../../services/api";
import {
    Store,
    Mail,
    ShieldCheck
} from "lucide-react";

function BecomeMerchant() {

    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await API.get("/user/profile");

                console.log("PROFILE => ", res.data);

                setEmail(
                    res.data.data?.email || ""
                );

            } catch (err) {

                console.log(err);

            }
        };

        fetchProfile();

    }, []);

    const handleSendOtp = async () => {

        try {

            setLoading(true);

            await API.post(
                "/auth/send-otp",
                {
                    email
                }
            );

            setOtpSent(true);

            alert(
                "OTP sent successfully"
            );

        }
        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Failed to send OTP"
            );

        }
        finally {

            setLoading(false);

        }

    };

    const handleBecomeMerchant =
        async () => {

            if (
                !businessName.trim() ||
                !otp.trim()
            ) {

                alert(
                    "All fields are required"
                );

                return;

            }

            try {

                setLoading(true);

                const res =
                    await API.post(
                        "/auth/merchant/register",
                        {
                            businessName,
                            email,
                            otp
                        }
                    );

                alert(
                    res.data.message ||
                    "Merchant request submitted successfully"
                );

                window.location.reload();

            }
            catch (err) {

                console.log(err);

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

        <div
            className="
            mt-6
            max-w-lg
            border
            border-green-200
            bg-green-50
            rounded-2xl
            p-5
            "
        >

            <h3
                className="
                text-lg
                font-semibold
                mb-5
                "
            >
                Become Merchant
            </h3>

            {/* EMAIL */}

            <div className="mb-4">

                <label
                    className="
                    text-sm
                    font-medium
                    block
                    mb-2
                    "
                >
                    Email
                </label>

                <div className="relative">

                    <Mail
                        size={18}
                        className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        "
                    />

                    <input
                        value={email}
                        disabled
                        className="
                        w-full
                        pl-10
                        pr-4
                        py-3
                        border
                        rounded-xl
                        bg-gray-100
                        "
                    />

                </div>

            </div>

            {/* BUSINESS NAME */}

            <div className="mb-4">

                <label
                    className="
                    text-sm
                    font-medium
                    block
                    mb-2
                    "
                >
                    Business Name
                </label>

                <div className="relative">

                    <Store
                        size={18}
                        className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        "
                    />

                    <input
                        type="text"
                        value={businessName}
                        onChange={(e) =>
                            setBusinessName(
                                e.target.value
                            )
                        }
                        placeholder="Enter business name"
                        className="
                        w-full
                        pl-10
                        pr-4
                        py-3
                        border
                        rounded-xl
                        "
                    />

                </div>

            </div>

            {/* OTP */}

            {
                otpSent && (

                    <div className="mb-4">

                        <label
                            className="
                            text-sm
                            font-medium
                            block
                            mb-2
                            "
                        >
                            OTP
                        </label>

                        <div className="relative">

                            <ShieldCheck
                                size={18}
                                className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                                "
                            />

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter OTP"
                                className="
                                w-full
                                pl-10
                                pr-4
                                py-3
                                border
                                rounded-xl
                                "
                            />

                        </div>

                    </div>

                )
            }

            {/* ACTIONS */}

            <div
                className="
                flex
                justify-end
                gap-3
                mt-5
                "
            >

                {
                    !otpSent ? (

                        <button
                            onClick={
                                handleSendOtp
                            }
                            disabled={loading}
                            className="
                            px-4
                            py-2
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            rounded-xl
                            "
                        >
                            {
                                loading
                                    ? "Sending..."
                                    : "Send OTP"
                            }
                        </button>

                    ) : (

                        <button
                            onClick={
                                handleBecomeMerchant
                            }
                            disabled={loading}
                            className="
                            px-4
                            py-2
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            rounded-xl
                            "
                        >
                            {
                                loading
                                    ? "Submitting..."
                                    : "Submit Request"
                            }
                        </button>

                    )
                }

            </div>

        </div>

    );

}

export default BecomeMerchant;