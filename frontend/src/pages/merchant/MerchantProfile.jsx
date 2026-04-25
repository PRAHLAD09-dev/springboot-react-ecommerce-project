import { useEffect, useState } from "react";
import API from "../../services/api";

function MerchantProfile() {
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMerchantProfile = async () => {
            try {
                const res = await API.get("/api/merchant/profile");

                setMerchant(res.data.data);
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

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!merchant) {
        return (
            <div className="text-center mt-10">
                <p className="mb-4">You are not a merchant</p>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = "/become-merchant"}
                >
                    Become Merchant
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Merchant Profile
            </h1>

            <div className="space-y-2">
                <p><b>Business Name:</b> {merchant.businessName}</p>
                <p><b>Email:</b> {merchant.email}</p>

                <p>
                    <b>Status:</b>{" "}
                    {merchant.approved ? (
                        <span className="text-green-600">Approved</span>
                    ) : (
                        <span className="text-yellow-600">Pending Approval</span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default MerchantProfile;