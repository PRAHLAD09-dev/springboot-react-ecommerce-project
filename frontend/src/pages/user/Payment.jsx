import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("currentOrderId");
        if (id) setOrderId(id);
    }, []);

    const handlePayment = () => {
        if (!orderId) {
            alert("No order found");
            return;
        }

        console.log("POST → /api/payments/pay?orderId=" + orderId);

        alert("Payment Successful");

        navigate("/orders");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-lg p-6 rounded w-80 text-center">

                <h1 className="text-xl font-bold mb-4">
                    Payment
                </h1>

                <p className="text-gray-500 mb-4">
                    Order ID: #{orderId}
                </p>

                <button
                    onClick={handlePayment}
                    className="w-full bg-green-500 text-white py-2 rounded"
                >
                    Pay Now
                </button>

            </div>
        </div>
    );
}

export default Payment;