import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        merchants: 0
    });

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(res.data.data || {
                users: 0,
                orders: 0,
                merchants: 0
            });

        } catch (err) {
            console.log(err);
            alert("Dashboard load failed ❌");
        } finally {
            setLoading(false);
        }
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) {
        return <p className="text-center mt-10">Loading Dashboard...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-gray-600">
                            Overview of your platform
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>

                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    {/* USERS */}
                    <div
                        onClick={() => navigate("/admin/users")}
                        className="bg-white p-6 rounded-xl shadow cursor-pointer 
                        hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        <h2 className="text-gray-500 text-sm">
                            Total Users
                        </h2>

                        <p className="text-3xl font-bold mt-2 text-blue-600">
                            {stats.users}
                        </p>
                    </div>

                    {/* ORDERS */}
                    <div
                        onClick={() => navigate("/admin/orders")}
                        className="bg-white p-6 rounded-xl shadow cursor-pointer 
                        hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        <h2 className="text-gray-500 text-sm">
                            Total Orders
                        </h2>

                        <p className="text-3xl font-bold mt-2 text-green-600">
                            {stats.orders}
                        </p>
                    </div>

                    {/* MERCHANTS */}
                    <div
                        onClick={() => navigate("/admin/merchants")}
                        className="bg-white p-6 rounded-xl shadow cursor-pointer 
                        hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        <h2 className="text-gray-500 text-sm">
                            Merchants
                        </h2>

                        <p className="text-3xl font-bold mt-2 text-purple-600">
                            {stats.merchants}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;