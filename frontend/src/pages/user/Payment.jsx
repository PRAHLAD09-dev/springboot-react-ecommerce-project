import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

import {
    ArrowLeft,
    MapPin,
    CreditCard,
    CheckCircle2,
    Receipt,
    ShieldCheck,
    Home,
    Building2,
    Building,
    Store,
    Phone
} from "lucide-react";

function Payment() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    const getAddressType = (type) => {

        switch (type) {

            case "HOME":
                return {
                    icon: <Home size={18} />,
                    label: "Home"
                };

            case "OFFICE":
                return {
                    icon: <Building2 size={18} />,
                    label: "Office"
                };

            case "APARTMENT":
                return {
                    icon: <Building size={18} />,
                    label: "Apartment"
                };

            case "SHOP":
                return {
                    icon: <Store size={18} />,
                    label: "Shop"
                };

            default:
                return {
                    icon: <MapPin size={18} />,
                    label: "Other"
                };
        }
    };

    // ================= FETCH ORDER =================
    const fetchOrder = async () => {
        try {
            const res = await API.get(`/user/orders/${orderId}`);
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
            const res = await API.post("/payments/pay", null, {
                params: { orderId }
            });

            const payment = res.data.data;

            setPaymentSuccess({
                transactionId: payment.transactionId,
                time: payment.paidAt
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

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                    w-10
                    h-10
                    border
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    hover:bg-gray-100
                    "
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>

                        <h1 className="text-3xl font-bold">
                            Secure Checkout
                        </h1>

                        <p className="text-gray-500">
                            Complete your payment securely
                        </p>

                    </div>

                </div>

                {/* CARD */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ORDER INFO */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white rounded-2xl shadow border p-6">

                                <div className="flex items-center gap-2 mb-4">

                                    <Receipt size={20} />

                                    <h2 className="font-bold text-xl">
                                        Order Summary
                                    </h2>

                                </div>

                                <div className="space-y-3">

                                    <div className="flex justify-between">

                                        <span>Order ID</span>

                                        <span>
                                            #{order.orderId}
                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span>Status</span>

                                        <span className="text-orange-600">
                                            {order.status}
                                        </span>

                                    </div>

                                    <div className="flex justify-between font-bold text-xl">

                                        <span>Total Amount</span>

                                        <span>
                                            ₹ {Number(order.totalPrice).toLocaleString("en-IN")}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* ADDRESS */}

                            <div className="bg-white rounded-2xl shadow border p-6">

                                {(() => {

                                    const addressInfo =
                                        getAddressType(
                                            order.address?.addressType
                                        );

                                    return (

                                        <>

                                            <div className="flex items-center gap-2 mb-4">

                                                {addressInfo.icon}

                                                <h2 className="font-semibold">
                                                    {addressInfo.label} Address
                                                </h2>

                                            </div>

                                            <div className="space-y-2">

                                                <p className="font-semibold text-gray-900">
                                                    {order.address?.street}
                                                </p>

                                                <p className="text-gray-600">
                                                    {order.address?.city},
                                                    {" "}
                                                    {order.address?.state}
                                                </p>

                                                <p className="text-gray-600">
                                                    {order.address?.country}
                                                    {" "}
                                                    -
                                                    {" "}
                                                    {order.address?.zipCode}
                                                </p>

                                                <div className="flex items-center gap-2 pt-2">

                                                    <Phone size={16} />

                                                    <span className="text-gray-700">
                                                        {order.address?.phoneNumber}
                                                    </span>

                                                </div>

                                            </div>

                                        </>

                                    );

                                })()}

                            </div>
                        </div>

                        {/* PAYMENT BUTTON */}

                        <div className="bg-white rounded-2xl shadow border p-6 h-fit sticky top-24">

                            <div className="flex items-center gap-2 mb-4">

                                <CreditCard size={20} />

                                <h2 className="font-bold text-xl">
                                    Payment
                                </h2>

                            </div>

                            <div
                                className="
                            bg-green-50
                            border
                            border-green-200
                            rounded-xl
                            p-4
                            mb-5
                            "
                            >

                                <div className="flex items-center gap-2">

                                    <ShieldCheck
                                        size={18}
                                        className="text-green-600"
                                    />

                                    <span className="font-medium text-green-700">
                                        Secure Payment
                                    </span>

                                </div>

                            </div>
                            <div className="text-center mb-5">

                                <p className="text-gray-500 text-sm">
                                    Amount Payable
                                </p>

                                <h2 className="text-3xl font-bold text-green-600 mt-1">
                                    ₹ {
                                        Number(order.totalPrice)
                                            .toLocaleString("en-IN")
                                    }
                                </h2>

                            </div>

                            {
                                !paymentSuccess && (

                                    <div className="flex justify-center">

                                        <button
                                            onClick={handlePayment}
                                            className="
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        px-10
                                        py-3
                                        rounded-xl
                                        font-semibold
                                        text-lg
                                        shadow-md
                                        hover:shadow-lg
                                        transition
                                        "
                                        >

                                            Pay ₹ {
                                                Number(order.totalPrice)
                                                    .toLocaleString("en-IN")
                                            }

                                        </button>

                                    </div>

                                )
                            }

                        </div>

                        {/* SUCCESS */}
                        {
                            paymentSuccess && (

                                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-5">

                                    <div className="flex items-center gap-3">

                                        <CheckCircle2
                                            size={28}
                                            className="text-green-600"
                                        />

                                        <div>

                                            <h3 className="font-bold text-green-700">
                                                Payment Successful
                                            </h3>

                                            <p className="text-sm text-gray-600">
                                                Your order has been confirmed
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-4 text-sm space-y-2">

                                        <p>
                                            Transaction ID:
                                            <span className="font-semibold ml-2">
                                                {paymentSuccess.transactionId}
                                            </span>
                                        </p>

                                        <p>
                                            Paid At:
                                            <span className="font-semibold ml-2">

                                                new Date{paymentSuccess.time}
                                                .toLocaleString("en-IN")
                                            </span>
                                        </p>

                                    </div>

                                </div>

                            )
                        }
                    </div>
                </div>

            </div>
        </div>

    );
}

export default Payment;