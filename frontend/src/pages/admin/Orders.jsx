import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= FETCH =================
    const fetchOrders = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/admin/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ================= UPDATE STATUS =================
    const updateStatus = async (orderId, status) => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/orders/${orderId}/status`,
                null,
                {
                    params: { status },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchOrders();

        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Update failed");
        }
    };

    // 🎨 STATUS COLOR
    const getStatusColor = (status) => {
        switch (status) {
            case "CREATED": return "bg-gray-500";
            case "CONFIRMED": return "bg-blue-500";
            case "SHIPPED": return "bg-yellow-500";
            case "OUT_FOR_DELIVERY": return "bg-orange-500";
            case "DELIVERED": return "bg-green-600";
            case "CANCELLED": return "bg-red-500";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl font-bold">
                        Admin Orders
                    </h1>
                </div>

                {/* EMPTY */}
                {orders.length === 0 && (
                    <p className="text-gray-500">No orders found</p>
                )}

                {/* LIST */}
                <div className="space-y-6">

                    {orders.map((o) => (
                        <div
                            key={o.id}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                        >

                            {/* TOP */}
                            <div className="flex justify-between items-center mb-4">

                                <div>
                                    <p className="font-bold text-lg">
                                        Order #{o.id}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {o.userEmail || "No user"}
                                    </p>
                                </div>

                                <span className={`text-white px-3 py-1 rounded text-sm ${getStatusColor(o.status)}`}>
                                    {o.status}
                                </span>

                            </div>

                            {/* DETAILS GRID */}
                            <div className="grid md:grid-cols-2 gap-4 text-sm">

                                <p>
                                    <b>Total:</b> ₹ {o.totalPrice || o.totalAmount || 0}
                                </p>

                                <p>
                                    <b>Items:</b> {o.items?.length || 0}
                                </p>

                            </div>

                            {/* ADDRESS */}
                            {o.address && (
                                <div className="mt-3 text-sm text-gray-600">
                                    <b>Address:</b> {o.address.street}, {o.address.city}, {o.address.state}
                                </div>
                            )}

                            {/* ITEMS */}
                            <div className="mt-4">
                                <p className="font-semibold mb-1">Items:</p>

                                <ul className="text-sm list-disc ml-5">
                                    {o.items?.map((item, i) => (
                                        <li key={i}>
                                            {item.productName} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* STATUS UPDATE */}
                            <div className="mt-4 flex items-center gap-3">

                                <select
                                    value={o.status}
                                    onChange={(e) =>
                                        updateStatus(o.id, e.target.value)
                                    }
                                    className="border p-2 rounded"
                                >
                                    <option value="CREATED">CREATED</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default AdminOrders;