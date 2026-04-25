import { useEffect, useState } from "react";
import API from "../../services/api";

function Profile() {

    const [user, setUser] = useState(null);
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD USER + MERCHANT
    // =========================
    useEffect(() => {

        const fetchData = async () => {
            try {
                // USER
                const userRes = await API.get("/api/user/profile");
                setUser(userRes.data.data);

                // MERCHANT (optional)
                try {
                    const mRes = await API.get("/api/merchant/profile");
                    setMerchant(mRes.data.data);
                } catch {
                    setMerchant(null);
                }

            } catch (err) {
                console.log(err.response?.data || err);

                if (err.response?.status === 401) {
                    alert("Session expired, login again");
                    localStorage.clear();
                    window.location.href = "/login";
                } else {
                    alert("Profile load failed");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    // =========================
    // BECOME MERCHANT
    // =========================
    const handleBecomeMerchant = async () => {

        const businessName = prompt("Enter your business name");
        if (!businessName) return;

        try {
            await API.post("/api/auth/send-otp", {
                email: user.email
            });

            const otp = prompt("Enter OTP");
            if (!otp) return;

            const res = await API.post("/api/auth/merchant/register", {
                email: user.email,
                businessName,
                otp
            });

            alert(res.data.message || "Request sent");

            // 🔥 reload to show merchant section
            window.location.reload();

        } catch (err) {
            console.log(err.response?.data || err);
            alert(err.response?.data?.message || "Failed to become merchant");
        }
    };

    // =========================
    // UI
    // =========================
    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!user) {
        return <p className="text-center mt-10">No user data</p>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow rounded">

            <h1 className="text-2xl font-bold mb-4 text-center">
                My Profile
            </h1>

            {/* USER INFO */}
            <div className="space-y-2">
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>
            </div>

            {/* MERCHANT SECTION */}
            {merchant ? (
                <div className="mt-6 border-t pt-4">

                    <h2 className="text-xl font-bold mb-2">
                        Merchant Info
                    </h2>

                    <p>
                        <b>Business Name:</b> {merchant.businessName}
                    </p>

                    <p>
                        <b>Status:</b>{" "}
                        {merchant.approved ? "Approved" : "Pending"}
                    </p>

                </div>
            ) : (
                <button
                    onClick={handleBecomeMerchant}
                    className="mt-4 w-full bg-green-600 text-white p-2 rounded"
                >
                    Become Merchant
                </button>
            )}

        </div>
    );
}

export default Profile;