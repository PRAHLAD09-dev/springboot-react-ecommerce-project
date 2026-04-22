import { useEffect, useState } from "react";
import API from "../../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/api/user/orders/my-orders");
                setOrders(res.data.data);
            } catch (err) {
                console.log(err.response?.data || err);
            }
        };

        fetchOrders();
    }, []);

    const handleSelectOrder = async (orderId) => {
        try {
            const [orderRes, trackingRes] = await Promise.all([
                API.get(`/api/user/orders/${orderId}`),
                API.get(`/api/user/orders/${orderId}/tracking`),
            ]);

            setSelectedOrder({
                ...orderRes.data.data,
                tracking: trackingRes.data.data,
            });

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Failed to load order details ❌");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">My Orders</h1>

            {/* ORDER LIST */}
            <div className="space-y-3">
                {orders.length === 0 && (
                    <p className="text-gray-500">No orders found</p>
                )}

                {orders.map((order) => (
                    <div
                        key={order.id}
                        onClick={() => handleSelectOrder(order.id)}
                        className="border p-4 rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                        <p className="font-semibold">Order #{order.id}</p>
                        <p>Status: {order.status}</p>
                        <p>Total: ₹ {order.total}</p>
                    </div>
                ))}
            </div>

            {/* DETAILS + TRACKING */}
            {selectedOrder && (
                <div className="mt-6 p-4 border rounded-xl bg-gray-100">

                    <h2 className="font-bold mb-3 text-lg">Order Details</h2>

                    <p>ID: {selectedOrder.id}</p>
                    <p>Status: {selectedOrder.status}</p>
                    <p>Total: ₹ {selectedOrder.total}</p>

                    <p className="mt-3 font-semibold">Items:</p>
                    <ul className="list-disc ml-5">
                        {selectedOrder.items?.map((item, i) => (
                            <li key={i}>
                                {item.productName} x {item.quantity}
                            </li>
                        ))}
                    </ul>

                    {/* TRACKING */}
                    <div className="mt-4">
                        <p className="font-semibold mb-2">Tracking:</p>

                        <div className="space-y-2">
                            {selectedOrder.tracking?.map((t, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${t.completed
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                            }`}
                                    ></div>

                                    <span
                                        className={`${t.completed
                                            ? "text-green-600"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Orders;