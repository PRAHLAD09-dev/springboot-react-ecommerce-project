import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function MerchantProfile() {
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMerchantProfile = async () => {
            try {
                const res = await API.get("/merchant/profile");

                if (res.data.success && res.data.data) {
                    setMerchant(res.data.data);
                } else {
                    setMerchant(null);
                }

            } catch (err) {
                if (err.response?.status === 404) {
                    setMerchant(null);
                } else if (err.response?.status === 401) {
                    alert("Session expired, login again");
                    localStorage.clear();
                    navigate("/login");
                } else {
                    console.log(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMerchantProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl font-semibold text-gray-600">
                    Loading Merchant Profile...
                </p>
            </div>
        );
    }

    if (!merchant) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <p className="text-xl mb-4">
                    You are not a merchant
                </p>

                <button
                    onClick={() => navigate("/become-merchant")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                    Become Merchant
                </button>
            </div>
        );
    }

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
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">
                        🏪 Merchant Profile
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Manage your business account
                    </p>
                </div>

                {/* Info */}
                <div className="bg-gray-50 p-5 rounded-xl space-y-4 mb-6">

                    <div>
                        <p className="text-gray-500 text-sm">
                            Business Name
                        </p>
                        <p className="font-semibold text-lg">
                            {merchant.businessName}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">
                            Email
                        </p>
                        <p className="font-medium">
                            {merchant.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm mb-1">
                            Status
                        </p>

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
                        >
                            {statusText}
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <button
                        onClick={() => navigate("/merchant/update")}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                    >
                        Update Profile
                    </button>

                    <button
                        onClick={() => navigate("/merchant/delete")}
                        className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
                    >
                        Delete Account
                    </button>

                </div>

            </div>
        </div>
    );
}

export default MerchantProfile;