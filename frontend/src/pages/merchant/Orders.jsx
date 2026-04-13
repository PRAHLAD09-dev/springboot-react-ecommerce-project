import { useState } from "react";

function Orders() {
    const [orders, setOrders] = useState([
        {
            id: 1,
            customer: "user@gmail.com",
            total: 1500,
            status: "PLACED",
        },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setOrders(
            orders.map((o) =>
                o.id === id ? { ...o, status: newStatus } : o
            )
        );

        console.log(
            `PUT → /api/merchant/orders/${id}/status?status=${newStatus}`
        );
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">
                Merchant Orders
            </h1>

            {/* LIST */}
            <div className="space-y-4">

                {orders.length === 0 && (
                    <p className="text-center text-gray-500">
                        No orders
                    </p>
                )}

                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="border p-4 rounded-xl shadow-md bg-white"
                    >
                        <h2 className="font-bold text-lg">
                            Order #{o.id}
                        </h2>

                        <p className="text-sm text-gray-600">
                            Customer: {o.customer}
                        </p>

                        <p>Total: ₹ {o.total}</p>

                        <p className="mt-2">
                            Status:
                            <span
                                className={`ml-2 px-2 py-1 rounded text-white text-sm ${o.status === "DELIVERED"
                                    ? "bg-green-500"
                                    : o.status === "CANCELLED"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                                    }`}
                            >
                                {o.status}
                            </span>
                        </p>

                        {/*  STATUS UPDATE */}
                        <div className="flex gap-2 mt-3">

                            <button
                                onClick={() =>
                                    handleStatusChange(o.id, "PACKED")
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Pack
                            </button>

                            <button
                                onClick={() =>
                                    handleStatusChange(o.id, "SHIPPED")
                                }
                                className="bg-purple-500 text-white px-3 py-1 rounded"
                            >
                                Ship
                            </button>

                            <button
                                onClick={() =>
                                    handleStatusChange(o.id, "DELIVERED")
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                                Deliver
                            </button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Orders;