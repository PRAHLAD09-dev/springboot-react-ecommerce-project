import { useState } from "react";

function Orders() {
    const [orders, setOrders] = useState([
        {
            id: 1,
            status: "PLACED",
            total: 1200,
            items: ["Shoes", "T-shirt"],
            tracking: [
                { step: "Order Placed", done: true },
                { step: "Packed", done: false },
                { step: "Shipped", done: false },
                { step: "Delivered", done: false },
            ],
        },
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    // 🔥 PLACE ORDER
    const handlePlaceOrder = () => {
        const newOrder = {
            id: Date.now(),
            status: "PLACED",
            total: 999,
            items: ["Demo Product"],
            tracking: [
                { step: "Order Placed", done: true },
                { step: "Packed", done: false },
                { step: "Shipped", done: false },
                { step: "Delivered", done: false },
            ],
        };

        setOrders([newOrder, ...orders]);
    };

    // 🔥 CANCEL
    const handleCancel = (id) => {
        if (!window.confirm("Cancel this order?")) return;

        setOrders(
            orders.map((o) =>
                o.id === id
                    ? {
                        ...o,
                        status: "CANCELLED",
                        tracking: o.tracking.map((t, i) =>
                            i === 0 ? t : { ...t, done: false }
                        ),
                    }
                    : o
            )
        );
    };

    // 🔥 VIEW
    const handleView = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">My Orders</h1>

            {/* PLACE ORDER */}
            <button
                onClick={handlePlaceOrder}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Place Dummy Order
            </button>

            {/* LIST */}
            <div className="space-y-4">
                {orders.length === 0 && (
                    <p className="text-gray-500 text-center">No orders</p>
                )}

                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="border p-4 rounded-xl shadow-md hover:shadow-lg transition bg-white"
                    >
                        <h2 className="font-bold text-lg">Order #{o.id}</h2>

                        <p className="mt-1">
                            Status:
                            <span
                                className={`ml-2 px-2 py-1 rounded text-white text-sm ${o.status === "CANCELLED"
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                            >
                                {o.status}
                            </span>
                        </p>

                        <p>Total: ₹ {o.total}</p>

                        <div className="flex gap-4 mt-3">

                            <button
                                onClick={() => handleView(o)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                View
                            </button>

                            <button
                                onClick={() => handleCancel(o.id)}
                                disabled={o.status === "CANCELLED"}
                                className={`px-3 py-1 rounded text-white ${o.status === "CANCELLED"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-500"
                                    }`}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* DETAILS + TRACKING */}
            {selectedOrder && (
                <div className="mt-6 p-4 border rounded-xl bg-gray-100">
                    <h2 className="font-bold mb-3 text-lg">
                        Order Details
                    </h2>

                    <p>ID: {selectedOrder.id}</p>
                    <p>Status: {selectedOrder.status}</p>
                    <p>Total: ₹ {selectedOrder.total}</p>

                    <p className="mt-3 font-semibold">Items:</p>
                    <ul className="list-disc ml-5">
                        {selectedOrder.items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>

                    {/* 🔥 TRACKING */}
                    <div className="mt-4">
                        <p className="font-semibold mb-2">Tracking:</p>

                        <div className="space-y-2">
                            {selectedOrder.tracking.map((t, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${t.done ? "bg-green-500" : "bg-gray-400"
                                            }`}
                                    ></div>
                                    <span
                                        className={`${t.done ? "text-green-600" : "text-gray-500"
                                            }`}
                                    >
                                        {t.step}
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