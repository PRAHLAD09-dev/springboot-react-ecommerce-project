import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Payment() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    const userId = localStorage.getItem("userId") || "guest";

    useEffect(() => {
        const orders =
            JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];

        if (orders.length === 0) {
            alert("No order found ");
            navigate("/");
            return;
        }

        const lastOrder = orders[orders.length - 1];
        setOrder(lastOrder);

    }, [navigate, userId]);

    const handlePayment = async () => {
        if (!order) return;

        try {
            await API.post("/api/payments/pay", null, {
                params: { orderId: order.id }
            });

            alert("Payment Successful ");

            navigate("/orders");

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Payment failed ");
        }
    };

    if (!order) return null;

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-lg p-6 rounded w-80 text-center">

                <h1 className="text-xl font-bold mb-4">Payment</h1>

                <p className="text-gray-500 mb-2">
                    Order ID: #{order.id}
                </p>

                <p className="font-semibold mb-4">
                    Amount: ₹ {order.total}
                </p>

                <button
                    onClick={handlePayment}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                >
                    Pay Now
                </button>

            </div>
        </div>
    );
}

export default Payment;