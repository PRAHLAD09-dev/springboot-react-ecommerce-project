import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");

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

            console.log("ORDERS DATA:", res.data.data);

            setOrders(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        console.log("UPDATE:", orderId, status);

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

            alert("Status updated");
            fetchOrders();

        } catch (err) {
            console.log("ERROR:", err.response?.data);
            alert(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">
                Admin Order Status
            </h1>

            <div className="space-y-4">

                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="border p-4 rounded-xl shadow bg-white"
                    >
                        <h2 className="font-bold">
                            Order #{o.id}
                        </h2>

                        <p>User: {o.userEmail}</p>
                        <p>Total: ₹ {o.totalAmount}</p>

                        <p className="mt-2">
                            Status:
                            <span className="ml-2 px-2 py-1 bg-gray-700 text-white rounded text-sm">
                                {o.status}
                            </span>
                        </p>

                        <select
                            value={o.status}
                            onChange={(e) => {
                                const id = o.orderId || o.id;
                                updateStatus(id, e.target.value);
                            }}
                            className="mt-3 border p-2 rounded"
                        >
                            <option value="CREATED">CREATED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default AdminOrders;