import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const navigate = useNavigate();

    // ================= FETCH =================
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/api/user/orders/my-orders");
                setOrders(res.data.data || []);
            } catch (err) {
                console.log(err);
            }
        };
        fetchOrders();
    }, []);

    // ================= SELECT =================
    const handleSelectOrder = async (orderId) => {
        try {
            const [orderRes, trackingRes] = await Promise.all([
                API.get(`/api/user/orders/${orderId}`),
                API.get(`/api/user/orders/${orderId}/tracking`)
            ]);

            setSelectedOrder({
                ...orderRes.data.data,
                tracking: trackingRes.data.data
            });

        } catch (err) {
            console.log(err);
        }
    };

    // ================= STATUS COLOR =================
    const getStatusColor = (status) => {
        switch (status) {
            case "CREATED": return "bg-gray-400";
            case "CONFIRMED": return "bg-blue-500";
            case "SHIPPED": return "bg-yellow-500";
            case "OUT_FOR_DELIVERY": return "bg-orange-500";
            case "DELIVERED": return "bg-green-500";
            case "CANCELLED": return "bg-red-500";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <div className="flex items-center justify-between mb-6">

                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                <h1 className="text-3xl font-bold">
                    My Orders
                </h1>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* ================= LEFT: LIST ================= */}
                <div className="space-y-4">

                    {orders.map(order => (
                        <div
                            key={order.orderId}
                            onClick={() => handleSelectOrder(order.orderId)}
                            className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                        >
                            <div className="flex justify-between">
                                <p className="font-bold">Order #{order.orderId}</p>

                                <span className={`text-white px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                                    {order.status.replaceAll("_", " ")}
                                </span>
                            </div>

                            <p className="text-gray-600 mt-2">
                                ₹ {order.totalPrice}
                            </p>
                        </div>
                    ))}

                </div>

                {/* ================= RIGHT: DETAILS ================= */}
                <div>

                    {!selectedOrder && (
                        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                            Select an order to view details
                        </div>
                    )}

                    {selectedOrder && (
                        <div className="bg-white p-6 rounded-xl shadow space-y-4">

                            {/* HEADER */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    Order #{selectedOrder.orderId}
                                </h2>

                                <span className={`text-white px-3 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            {/* PRICE */}
                            <p className="text-lg font-semibold">
                                Total: ₹ {selectedOrder.totalPrice}
                            </p>

                            {/* ITEMS */}
                            <div>
                                <p className="font-semibold mb-2">Items</p>
                                <ul className="list-disc ml-5 text-gray-700">
                                    {selectedOrder.items?.map((item, i) => (
                                        <li key={i}>
                                            {item.productName} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ================= TIMELINE ================= */}
                            <div>
                                <p className="font-semibold mb-4 text-lg">Tracking</p>

                                <div className="relative">

                                    {selectedOrder.tracking?.map((t, i) => {

                                        const isLast = i === selectedOrder.tracking.length - 1;

                                        return (
                                            <div key={i} className="flex items-start gap-4 mb-6">

                                                {/* LINE */}
                                                {!isLast && (
                                                    <div className="absolute left-[10px] top-6 w-[2px] h-full bg-gray-300"></div>
                                                )}

                                                {/* DOT */}
                                                <div className="w-5 h-5 rounded-full bg-green-500 z-10"></div>

                                                {/* TEXT */}
                                                <div>
                                                    <p className="font-semibold capitalize text-green-600">
                                                        {t.status.replaceAll("_", " ").toLowerCase()}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {new Date(t.updatedAt).toLocaleString()}
                                                    </p>
                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default Orders;