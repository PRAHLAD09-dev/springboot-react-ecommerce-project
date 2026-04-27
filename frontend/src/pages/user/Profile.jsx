import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

function Profile() {

    const [user, setUser] = useState(null);
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const active = location.pathname;

    const handleLogout = async () => {
        try {

        } catch (err) {
            console.log("Logout API failed (ignore)");
        } finally {
            localStorage.clear();
            navigate("/login");
        }
    };

    // ================= FETCH =================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get("/api/user/profile");
                setUser(res.data.data);

                try {
                    const mRes = await API.get("/api/merchant/profile");
                    setMerchant(mRes.data.data);
                } catch {
                    setMerchant(null);
                }

            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* ================= SIDEBAR ================= */}
            <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">

                {/* TOP MENU */}
                <div>
                    <h2 className="text-xl font-bold mb-6">Account</h2>

                    {[
                        { label: "Profile", path: "/profile" },
                        { label: "Update Profile", path: "/profile/update" },
                        { label: "Change Password", path: "/change-password" },
                        { label: "Addresses", path: "/address" },
                        { label: "Delete Account", path: "/delete-account" }
                    ].map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`block w-full text-left px-4 py-2 mb-2 rounded-lg
                ${active === item.path
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100"}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

            {/* ================= MAIN ================= */}
            <div className="flex-1 p-8">

                <h1 className="text-3xl font-bold mb-6">
                    My Profile
                </h1>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* USER CARD */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

                        <h2 className="text-lg font-semibold mb-4">
                            User Information
                        </h2>

                        <p className="mb-2">
                            <b>Name:</b> {user.name}
                        </p>

                        <p className="mb-2">
                            <b>Email:</b> {user.email}
                        </p>

                        <p>
                            <b>Role:</b>{" "}
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                {user.role}
                            </span>
                        </p>

                    </div>

                    {/* MERCHANT CARD */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

                        <h2 className="text-lg font-semibold mb-4">
                            Merchant
                        </h2>

                        {merchant ? (
                            <>
                                <p className="mb-2 font-medium">
                                    {merchant.businessName}
                                </p>

                                <span className={`px-3 py-1 rounded text-sm font-medium
                                    ${merchant.approved
                                        ? "bg-green-100 text-green-600"
                                        : "bg-yellow-100 text-yellow-600"}`}
                                >
                                    {merchant.approved ? "Approved" : "Pending"}
                                </span>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/become-merchant")}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Become Merchant
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div >
    );
}

export default Profile;