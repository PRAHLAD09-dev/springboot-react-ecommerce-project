import { useEffect, useState } from "react";
import API from "../../services/api";

function MerchantOrders() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/merchant/orders");
            setOrders(res.data.data || []);
        } catch (err) {
            console.log(err);
            alert("Failed to load orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    const updateStatus = async (orderId, status) => {
        try {
            await API.put(`/api/merchant/orders/${orderId}/status`, null, {
                params: { status }
            });

            alert("Status updated ");
            fetchOrders();
            setSelectedOrder(null);

        } catch (err) {
            console.log(err);
            alert("Update failed ");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED": return "bg-blue-100 text-blue-700";
            case "SHIPPED": return "bg-yellow-100 text-yellow-700";
            case "OUT_FOR_DELIVERY": return "bg-orange-100 text-orange-700";
            case "DELIVERED": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            <h1 className="text-3xl font-bold mb-6">Merchant Orders</h1>

            {/* ================= LIST ================= */}
            <div className="grid md:grid-cols-2 gap-4">

                {orders.length === 0 && (
                    <p className="text-gray-500">No orders</p>
                )}

                {orders.map(o => (
                    <div
                        key={o.orderId}
                        onClick={() => handleSelectOrder(o)}
                        className={`border p-4 rounded-xl cursor-pointer shadow hover:shadow-md 
                        ${selectedOrder?.orderId === o.orderId ? "border-blue-500" : ""}`}
                    >
                        <div className="flex justify-between">
                            <p className="font-semibold">Order #{o.orderId}</p>
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(o.status)}`}>
                                {o.status}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm mt-1">
                            ₹ {o.totalPrice}
                        </p>
                    </div>
                ))}

            </div>

            {/* ================= DETAILS ================= */}
            {selectedOrder && (
                <div className="mt-8 p-5 border rounded-xl bg-white shadow">

                    <h2 className="text-xl font-bold mb-4">
                        Order Details
                    </h2>

                    <p><b>ID:</b> {selectedOrder.orderId}</p>
                    <p><b>Status:</b> {selectedOrder.status}</p>
                    <p><b>Total:</b> ₹ {selectedOrder.totalPrice}</p>

                    {/* ITEMS */}
                    <div className="mt-4">
                        <p className="font-semibold mb-1">Items:</p>

                        <ul className="list-disc ml-5 text-sm">
                            {selectedOrder.items?.map((item, i) => (
                                <li key={i}>
                                    {item.productName} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ================= BUTTON LOGIC  ================= */}
                    <div className="mt-5 flex gap-3">

                        {/* CONFIRMED → SHIPPED */}
                        {selectedOrder.status === "CONFIRMED" && (
                            <button
                                onClick={() =>
                                    updateStatus(selectedOrder.orderId, "SHIPPED")
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Ship
                            </button>
                        )}

                        {/* SHIPPED → OUT FOR DELIVERY */}
                        {selectedOrder.status === "SHIPPED" && (
                            <button
                                onClick={() =>
                                    updateStatus(selectedOrder.orderId, "OUT_FOR_DELIVERY")
                                }
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Out for Delivery
                            </button>
                        )}

                        {/* FINAL STATE */}
                        {selectedOrder.status === "DELIVERED" && (
                            <span className="text-green-600 font-semibold">
                                ✅ Order Delivered
                            </span>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default MerchantOrders;