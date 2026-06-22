import { useState } from "react";
import API from "../../services/api";
import {
    AlertTriangle,
    ShieldAlert,
    Trash2,
    Send,
    KeyRound
} from "lucide-react";

function DeleteAccount() {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async () => {

        try {

            setLoading(true);

            await API.post(
                "/user/delete/request"
            );

            setOtpSent(true);

            alert(
                "OTP sent to your email"
            );

        }
        catch (err) {

            console.log(err);

            alert(
                "Failed to send OTP"
            );

        }
        finally {

            setLoading(false);

        }

    };

    const handleDelete = async () => {

        if (!otp.trim()) {

            alert("Enter OTP");
            return;

        }

        const confirmDelete = window.confirm(
            "Are you sure you want to deactivate your account? You will not be able to login afterwards."
        );
        if (!confirmDelete) return;

        try {

            setLoading(true);

            await API.delete(
                "/user/delete",
                {
                    params: { otp }
                }
            );

            alert(
                "Account Deactivated successfully"
            );

            localStorage.clear();

            window.location.href = "/";

        }
        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Deactivation Account failed"
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="mt-6">

            {/* WARNING */}

            <div
                className="
                bg-red-50
                border
                border-red-200
                rounded-2xl
                p-5
                mb-6
                "
            >

                <div className="flex items-start gap-3">

                    <ShieldAlert
                        size={24}
                        className="text-red-600"
                    />

                    <div>

                        <h3
                            className="
                                text-red-700
                                font-semibold
                                "
                        >
                            Deactivate Account
                        </h3>

                        <p
                            className="
                                        text-sm
                                        text-red-600
                                        mt-2
                                        "
                        >
                            Your account will be deactivated and
                            you will no longer be able to login.
                        </p>

                    </div>

                </div>

            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* LEFT */}

                <div className="lg:col-span-2">

                    <label
                        className="
                        block
                        text-sm
                        font-medium
                        mb-2
                        "
                    >
                        Verification OTP
                    </label>

                    <div className="relative">

                        <KeyRound
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
                            border-gray-300
                            rounded-xl
                            focus:ring-2
                            focus:ring-red-500
                            outline-none
                            "
                        />

                    </div>

                </div>

                {/* RIGHT */}

                <div
                    className="
                    bg-gray-50
                    border
                    rounded-2xl
                    p-5
                    h-fit
                    "
                >

                    <h3
                        className="
                        font-semibold
                        mb-3
                        "
                    >
                        Steps
                    </h3>

                    <ul
                        className="
                        text-sm
                        text-gray-600
                        space-y-3
                        "
                    >

                        <li>
                            1. Click Send OTP
                        </li>

                        <li>
                            2. Check your email
                        </li>

                        <li>
                            3. Enter OTP
                        </li>

                        <li>
                            4. Deactivate account
                        </li>

                    </ul>

                </div>

            </div>

            {/* ACTIONS */}

            <div
                className="
                flex
                justify-end
                gap-3
                mt-6
                pt-5
                border-t
                "
            >

                <button
                    onClick={handleSendOtp}
                    disabled={
                        loading ||
                        otpSent
                    }
                    className={`
                    px-5
                    py-2.5
                    rounded-xl
                    text-white
                    flex
                    items-center
                    gap-2
                    transition

                    ${otpSent
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        }
                    `}
                >

                    <Send size={16} />

                    {
                        otpSent
                            ? "OTP Sent"
                            : "Send OTP"
                    }

                </button>

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="
                    px-5
                    py-2.5
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    rounded-xl
                    flex
                    items-center
                    gap-2
                    "
                >

                    <Trash2 size={16} />

                    {
                        loading
                            ? "Deactivating..."
                            : "Deactivate Account"
                    }

                </button>

            </div>

        </div>

    );

}

export default DeleteAccount;