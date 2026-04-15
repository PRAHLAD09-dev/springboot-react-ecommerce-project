import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
    const navigate = useNavigate();

    const [orderId, setOrderId] = useState("");

    const handlePayment = () => {
        if (!orderId) {
            alert("Enter Order ID");
            return;
        }

        console.log("POST → /api/payments/pay?orderId=" + orderId);

        alert("Payment Successful");

        navigate("/orders");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-lg p-6 rounded w-80">

                <h1 className="text-xl font-bold mb-4 text-center">
                    Payment
                </h1>

                <input
                    type="number"
                    placeholder="Enter Order ID"
                    className="w-full border p-2 mb-4"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />

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