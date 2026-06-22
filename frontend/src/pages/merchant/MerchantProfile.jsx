import { useEffect, useState } from "react";
import API from "../../services/api";

function MerchantProfile() {

    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    const [openAction, setOpenAction] = useState(null);
    const [businessName, setBusinessName] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);

    const [merchantOtp, setMerchantOtp] = useState("");
    const [merchantOtpSent, setMerchantOtpSent] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchMerchantProfile = async () => {
            try {
                const res = await API.get("/merchant/profile");

                if (res.data.success && res.data.data) {

                    setMerchant(res.data.data);

                    setBusinessName(
                        res.data.data.businessName || ""
                    );

                } else {

                    setMerchant(null);

                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setMerchant(null);
                } else if (err.response?.status === 401) {
                    alert("Session expired, login again");
                    localStorage.clear();
                    window.location.href = "/login";
                } else {
                    console.log(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMerchantProfile();
    }, []);

    const handleUpdateMerchant =
        async () => {

            try {

                setUpdateLoading(true);

                const res =
                    await API.put(
                        "/merchant/profile",
                        {
                            businessName
                        }
                    );

                alert(
                    res.data.message
                );

                setMerchant(prev => ({
                    ...prev,
                    businessName
                }));

                setOpenAction(null);

            }
            catch (err) {

                console.log(err);

                alert(
                    err.response?.data?.message ||
                    "Update failed"
                );

            }
            finally {

                setUpdateLoading(false);

            }

        };

    const handleSendMerchantOtp =
        async () => {

            try {

                setDeleteLoading(true);

                const res =
                    await API.post(
                        "/merchant/delete/request"
                    );

                alert(res.data.message);

                setMerchantOtpSent(true);

            }
            catch (err) {

                console.log(err);

                alert(
                    err.response?.data?.message ||
                    "Failed to send OTP"
                );

            }
            finally {

                setDeleteLoading(false);

            }

        };

    const handleDeleteMerchant =
        async () => {

            if (!merchantOtp.trim()) {

                alert("Enter OTP");
                return;

            }

            const confirmDelete =
                window.confirm(
                    "Do you want to deactivate your merchant account?"
                );

            if (!confirmDelete) return;

            try {

                setDeleteLoading(true);

                const res =
                    await API.delete(
                        "/merchant/delete",
                        {
                            params: {
                                otp: merchantOtp
                            }
                        }
                    );

                alert(res.data.message);

                setMerchant(null);

                setOpenAction(null);

            }
            catch (err) {

                console.log(err);

                alert(
                    err.response?.data?.message ||
                    "Failed to deactivate merchant account"
                );

            }
            finally {

                setDeleteLoading(false);

            }

        };

    if (loading) return null;

    const statusText = !merchant.approved
        ? "Pending Approval"
        : merchant.approved && merchant.active
            ? "Approved"
            : "Blocked";

    const statusColor = !merchant.approved
        ? "bg-yellow-100 text-yellow-700"
        : merchant.approved && merchant.active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";

    return (

        <>

            {/* INFO */}

            <div className="grid md:grid-cols-3 gap-4 mb-6">

                <div className="border rounded-2xl p-4">

                    <p className="text-gray-500 text-sm">
                        Business Name
                    </p>

                    <p className="font-semibold mt-1">
                        {merchant.businessName}
                    </p>

                </div>

                <div className="border rounded-2xl p-4">

                    <p className="text-gray-500 text-sm">
                        Email
                    </p>

                    <p className="font-semibold mt-1">
                        {merchant.email}
                    </p>

                </div>

                <div className="border rounded-2xl p-4">

                    <p className="text-gray-500 text-sm">
                        Status
                    </p>

                    <span
                        className={`
                    mt-2
                    inline-block
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                    ${statusColor}
                    `}
                    >
                        {statusText}
                    </span>

                </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap gap-3 mb-6">

                <button
                    onClick={() =>
                        setOpenAction(
                            openAction === "update"
                                ? null
                                : "update"
                        )
                    }
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-2.5
                        rounded-xl
                        "
                >
                    Update Merchant
                </button>

                <button
                    onClick={() =>
                        setOpenAction(
                            openAction === "delete"
                                ? null
                                : "delete"
                        )
                    }
                    className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-5
                        py-2.5
                        rounded-xl
                        "
                >
                    Deactivate Merchant
                </button>

            </div>

            {
                openAction === "update" && (

                    <div
                        className="
                                mt-6
                                p-5
                                bg-blue-50
                                border
                                border-blue-100
                                rounded-2xl
                                max-w-lg
                                "
                    >

                        <h3 className="font-semibold mb-4">
                            Update Business Name
                        </h3>

                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) =>
                                setBusinessName(e.target.value)
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            "
                        />

                        <div className="flex justify-end gap-3 mt-4">

                            <button
                                onClick={() => setOpenAction(null)}
                                className="
                                        px-4 py-2
                                        border
                                        rounded-xl
                                        "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateMerchant}
                                className="
                                        px-4 py-2
                                        bg-blue-600
                                        text-white
                                        rounded-xl
                                        "
                            >
                                Save
                            </button>

                        </div>

                    </div>

                )
            }

            {
                openAction === "delete" && (

                    <div
                        className="
                            mt-6
                            max-w-lg
                            border
                            border-red-200
                            bg-red-50
                            rounded-2xl
                            p-5
                            "
                    >

                        <h3 className="font-semibold text-red-600 mb-2">
                            Deactivate Merchant Account
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Your merchant account will be deactivated.
                        </p>

                        <input
                            type="text"
                            value={merchantOtp}
                            onChange={(e) =>
                                setMerchantOtp(e.target.value)
                            }
                            placeholder="Enter OTP"
                            className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            focus:ring-2
                            focus:ring-red-500
                            outline-none
                            "
                        />

                        <div className="flex justify-end gap-3 mt-4">

                            <button
                                onClick={() => {
                                    setOpenAction(null);
                                    setMerchantOtp("");
                                }}
                                className="
                                    px-4
                                    py-2
                                    border
                                    border-gray-300
                                    rounded-xl
                                    hover:bg-gray-100
                                    "
                            >
                                Cancel
                            </button>

                            {
                                !merchantOtpSent && (

                                    <button
                                        onClick={handleSendMerchantOtp}
                                        disabled={deleteLoading}
                                        className="
                                        px-4
                                        py-2
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        rounded-xl
                                        "
                                    >
                                        Send OTP
                                    </button>

                                )
                            }

                            <button
                                onClick={handleDeleteMerchant}
                                disabled={deleteLoading}
                                className="
                                    px-4
                                    py-2
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    rounded-xl
                                    "
                            >
                                {
                                    deleteLoading
                                        ? "Processing..."
                                        : "Deactivate"
                                }
                            </button>

                        </div>

                    </div>

                )
            }

        </>
    );
}

export default MerchantProfile;