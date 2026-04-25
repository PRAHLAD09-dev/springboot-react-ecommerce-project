import { useEffect, useState } from "react";
import API from "../../services/api";

function MerchantOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        API.get("/api/merchant/orders")
            .then(res => setOrders(res.data.data))
            .catch(() => alert("Failed to load orders"));
    }, []);

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">
                Merchant Orders
            </h1>

            {orders.length === 0 && <p>No orders</p>}

            {orders.map(o => (
                <div key={o.id} className="border p-3 mb-2">
                    <p><b>Order ID:</b> {o.id}</p>
                    <p><b>Total:</b> ₹ {o.totalAmount}</p>
                    <p><b>Status:</b> {o.status}</p>
                </div>
            ))}
        </div>
    );
}

export default MerchantOrders;