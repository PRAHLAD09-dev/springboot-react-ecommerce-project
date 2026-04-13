import { useState } from "react";

function AdminOrders() {
    const [orders, setOrders] = useState([
        {
            id: 1,
            user: "user@gmail.com",
            total: 1200,
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
            'PUT → /api/admin / orders / ${ id } / status ? status = ${ newStatus }'
        );
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
                        <h2 className="font-bold">Order #{o.id}</h2>

                        <p>User: {o.user}</p>
                        <p>Total: ₹ {o.total}</p>

                        <p className="mt-2">
                            Status:
                            <span className="ml-2 px-2 py-1 bg-gray-700 text-white rounded text-sm">
                                {o.status}
                            </span>
                        </p>

                        <select
                            value={o.status}
                            onChange={(e) =>
                                handleStatusChange(o.id, e.target.value)
                            }
                            className="mt-3 border p-2 rounded"
                        >
                            <option value="PLACED">PLACED</option>
                            <option value="PACKED">PACKED</option>
                            <option value="SHIPPED">SHIPPED</option>
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