import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

function Payment() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    // ================= FETCH ORDER =================
    const fetchOrder = async () => {
        try {
            const res = await API.get(`/api/user/orders/${orderId}`);
            setOrder(res.data.data);
        } catch (err) {
            console.log(err.response?.data || err);
            alert("Order not found");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    // ================= PAYMENT =================
    const handlePayment = async () => {
        try {
            const res = await API.post("/api/payments/pay", null, {
                params: { orderId }
            });

            const payment = res.data.data;

            setPaymentSuccess({
                transactionId: payment.transactionId,
                time: new Date().toLocaleString()
            });

            setTimeout(() => {
                navigate("/orders");
            }, 2500);

        } catch (err) {
            console.log(err);
            alert("Payment failed");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl font-bold">
                        Payment
                    </h1>
                </div>

                {/* CARD */}
                <div className="bg-white p-6 rounded-xl shadow space-y-4">

                    {/* ORDER INFO */}
                    <div>
                        <p className="text-gray-500">
                            Order ID: <b>#{order.id}</b>
                        </p>

                        <p className="text-xl font-semibold">
                            Amount: ₹ {order.totalPrice}
                        </p>
                    </div>

                    {/* ADDRESS */}
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="font-semibold mb-2">
                            Delivery Address
                        </p>

                        {order.address ? (
                            <>
                                <p>{order.address.street}</p>
                                <p>
                                    {order.address.city}, {order.address.state}
                                </p>
                                <p>{order.address.zipCode}</p>
                            </>
                        ) : (
                            <p className="text-red-500">
                                No address found
                            </p>
                        )}
                    </div>

                    {/* PAYMENT BUTTON */}
                    {!paymentSuccess && (
                        <button
                            onClick={handlePayment}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
                        >
                            Pay Now
                        </button>
                    )}

                    {/* SUCCESS */}
                    {paymentSuccess && (
                        <div className="bg-green-100 p-4 rounded mt-4">

                            <p className="text-green-700 font-bold text-lg">
                                Payment Successful ✅
                            </p>

                            <p className="text-sm mt-1">
                                Transaction ID:{" "}
                                <b>{paymentSuccess.transactionId}</b>
                            </p>

                            <p className="text-sm">
                                Time: {paymentSuccess.time}
                            </p>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default Payment;