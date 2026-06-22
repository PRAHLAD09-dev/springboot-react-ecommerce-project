import { useState } from "react";
import API from "../../services/api";
import {
    Lock,
    KeyRound,
    Save
} from "lucide-react";

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {

        if (
            !oldPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            alert("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            await API.put(
                "/user/change-password",
                {
                    oldPassword,
                    newPassword
                }
            );

            alert(
                "Password changed successfully. Please login again."
            );

            localStorage.clear();

            window.location.href = "/login";

        }
        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Failed to change password"
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="mt-6">

            <div className="grid lg:grid-cols-3 gap-6">

                {/* LEFT SIDE */}

                <div className="lg:col-span-2 space-y-5">

                    {/* OLD PASSWORD */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Current Password
                        </label>

                        <div className="relative">

                            <Lock
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
                                type="password"
                                value={oldPassword}
                                onChange={(e) =>
                                    setOldPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter current password"
                                className="
                                w-full
                                pl-10
                                pr-4
                                py-3
                                border
                                border-gray-300
                                rounded-xl
                                focus:ring-2
                                focus:ring-blue-500
                                outline-none
                                "
                            />

                        </div>

                    </div>

                    {/* NEW PASSWORD */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            New Password
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
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                className="
                                w-full
                                pl-10
                                pr-4
                                py-3
                                border
                                border-gray-300
                                rounded-xl
                                focus:ring-2
                                focus:ring-blue-500
                                outline-none
                                "
                            />

                        </div>

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Confirm Password
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
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                className="
                                w-full
                                pl-10
                                pr-4
                                py-3
                                border
                                border-gray-300
                                rounded-xl
                                focus:ring-2
                                focus:ring-blue-500
                                outline-none
                                "
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div
                    className="
                    bg-blue-50
                    border
                    border-blue-100
                    rounded-2xl
                    p-5
                    h-fit
                    "
                >

                    <h3 className="font-semibold text-lg mb-4">
                        Password Requirements
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-600">

                        <li>✓ 8-20 characters</li>

                        <li>✓ One uppercase letter</li>

                        <li>✓ One lowercase letter</li>

                        <li>✓ One number</li>

                        <li>✓ One special character</li>

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
                    onClick={() => {

                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");

                    }}
                    className="
                    px-5
                    py-2.5
                    border
                    border-gray-300
                    rounded-xl
                    hover:bg-gray-100
                    transition
                    "
                >
                    Clear
                </button>

                <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="
                    px-5
                    py-2.5
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    rounded-xl
                    flex
                    items-center
                    gap-2
                    transition
                    disabled:bg-gray-400
                    "
                >

                    <Save size={16} />

                    {
                        loading
                            ? "Updating..."
                            : "Change Password"
                    }

                </button>

            </div>

        </div>

    );

}

export default ChangePassword;