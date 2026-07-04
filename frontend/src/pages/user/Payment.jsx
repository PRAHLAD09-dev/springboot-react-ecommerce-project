import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

import {
    ArrowLeft,
    CreditCard,
    CheckCircle2,
    Receipt,
    ShieldCheck,
    Phone
} from "lucide-react";
import { Card, Badge, Button, PageLoader } from "../../components/ui";
import { getAddressTypeInfo } from "../../utils/addressType";

function Payment() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await API.get(`/user/orders/${orderId}`);
            setOrder(res.data.data);
        } catch (err) {
            console.log(err.response?.data || err);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            setPaying(true);
            const res = await API.post("/payments/pay", null, { params: { orderId } });
            const payment = res.data.data;

            setPaymentSuccess({ transactionId: payment.transactionId, time: payment.paidAt });

            setTimeout(() => {
                navigate("/orders");
            }, 2500);
        } catch (err) {
            console.log(err);
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <PageLoader label="Loading order" />;
    if (!order) return null;

    const addressInfo = getAddressTypeInfo(order.address?.addressType);

    return (
        <div className="container-app py-6 sm:py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:bg-ink-100"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">Secure Checkout</h1>
                        <p className="text-sm text-ink-500">Complete your payment securely</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <div className="mb-4 flex items-center gap-2">
                                <Receipt size={20} className="text-brand-600" />
                                <h2 className="text-lg font-bold text-ink-900">Order summary</h2>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-ink-600">
                                    <span>Order ID</span>
                                    <span className="font-medium text-ink-900">#{order.orderId}</span>
                                </div>
                                <div className="flex items-center justify-between text-ink-600">
                                    <span>Status</span>
                                    <Badge variant="warning">{order.status}</Badge>
                                </div>
                                <div className="flex justify-between border-t border-ink-100 pt-3 text-lg font-bold text-ink-950">
                                    <span>Total amount</span>
                                    <span>₹{Number(order.totalPrice).toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="mb-4 flex items-center gap-2">
                                <addressInfo.Icon size={18} />
                                <h2 className="text-lg font-semibold text-ink-900">{addressInfo.label} address</h2>
                            </div>

                            <div className="space-y-1.5 text-sm">
                                <p className="font-semibold text-ink-900">{order.address?.street}</p>
                                <p className="text-ink-600">{order.address?.city}, {order.address?.state}</p>
                                <p className="text-ink-600">{order.address?.country} - {order.address?.zipCode}</p>
                                <div className="flex items-center gap-2 pt-2 text-ink-700">
                                    <Phone size={15} />
                                    {order.address?.phoneNumber}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
                        <Card>
                            <div className="mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-brand-600" />
                                <h2 className="text-lg font-bold text-ink-900">Payment</h2>
                            </div>

                            <div className="mb-5 flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 p-4">
                                <ShieldCheck size={18} className="text-success-600" />
                                <span className="text-sm font-medium text-success-700">Secure payment</span>
                            </div>

                            <div className="mb-5 text-center">
                                <p className="text-sm text-ink-500">Amount payable</p>
                                <h2 className="mt-1 text-3xl font-bold text-success-600">
                                    ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                                </h2>
                            </div>

                            {!paymentSuccess && (
                                <Button variant="success" size="lg" fullWidth loading={paying} onClick={handlePayment}>
                                    Pay ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                                </Button>
                            )}
                        </Card>

                        {paymentSuccess && (
                            <div className="animate-scale-in rounded-2xl border border-success-200 bg-success-50 p-5">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={28} className="text-success-600" />
                                    <div>
                                        <h3 className="font-bold text-success-700">Payment successful</h3>
                                        <p className="text-sm text-ink-600">Your order has been confirmed</p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 text-sm">
                                    <p>
                                        Transaction ID:
                                        <span className="ml-2 font-semibold">{paymentSuccess.transactionId}</span>
                                    </p>
                                    <p>
                                        Paid at:
                                        <span className="ml-2 font-semibold">
                                            {new Date(paymentSuccess.time).toLocaleString("en-IN")}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
