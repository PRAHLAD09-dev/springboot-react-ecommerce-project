import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        merchants: 0
    });

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

            console.log(res.data);

            setStats(res.data.data || {
                users: 0,
                orders: 0,
                merchants: 0
            });

        } catch (err) {
            console.log(err);
            alert("Dashboard load failed ❌");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <p className="text-gray-600 mb-6">
                Welcome Admin
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* USERS */}
                <div
                    onClick={() => navigate("/admin/users")}
                    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition"
                >
                    <h2 className="text-gray-500">Total Users</h2>
                    <p className="text-2xl font-bold mt-2">
                        {stats.users}
                    </p>
                </div>

                {/* ORDERS */}
                <div
                    onClick={() => navigate("/admin/orders")}
                    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition"
                >
                    <h2 className="text-gray-500">Orders</h2>
                    <p className="text-2xl font-bold mt-2">
                        {stats.orders}
                    </p>
                </div>

                {/* MERCHANTS */}
                <div
                    onClick={() => navigate("/admin/merchants")}
                    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition"
                >
                    <h2 className="text-gray-500">Merchants</h2>
                    <p className="text-2xl font-bold mt-2">
                        {stats.merchants}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;