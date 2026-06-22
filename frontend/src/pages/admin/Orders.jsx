import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft } from "lucide-react";
import { COLORS } from "../../constants/colors";
import {
    MapPin,
    Phone,
    Home,
} from "lucide-react";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= FETCH =================
    const fetchOrders = async () => {
        try {
            const res = await API.get(
                "/admin/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ================= UPDATE STATUS =================
    const updateStatus = async (orderId, status) => {
        try {
            await API.put(
                `/admin/orders/${orderId}/status`,
                null,
                {
                    params: { status },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchOrders();

        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Update failed");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CREATED": return "bg-gray-500";
            case "CONFIRMED": return "bg-blue-500";
            case "SHIPPED": return "bg-yellow-500";
            case "OUT_FOR_DELIVERY": return "bg-orange-500";
            case "DELIVERED": return "bg-green-600";
            case "CANCELLED": return "bg-red-500";
            default: return "bg-gray-400";
        }
    };

    // console.log(orders[0]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="
                    mb-6
                    w-11
                    h-11
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    hover:bg-blue-50
                    hover:border-blue-300
                    flex
                    items-center
                    justify-center
                    transition
                    "
                    >

                        <ArrowLeft size={20} />

                    </button>

                    <h1 className="text-3xl font-bold">
                        Admin Orders
                    </h1>
                </div>

                {/* EMPTY */}
                {orders.length === 0 && (
                    <p className="text-gray-500">No orders found</p>
                )}

                {/* LIST */}
                <div className="space-y-6">

                    {orders.map((o) => (

                        <div
                            key={o.orderId}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                        >

                            {/* TOP */}
                            <div className="flex justify-between items-center mb-4">

                                <div>
                                    <p className="font-bold text-lg">
                                        Order #{o.orderId}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {o.userEmail || "No user"}
                                    </p>
                                </div>

                                <span
                                    className={`
                                            text-white
                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-semibold
                                            ${getStatusColor(o.status)}
                                        `}
                                >
                                    {o.status}
                                </span>

                            </div>

                            {/* DETAILS GRID */}
                            <div className="grid md:grid-cols-2 gap-4 text-sm">

                                <p>
                                    <b>Total:</b> ₹ {o.totalPrice || o.totalAmount || 0}
                                </p>

                                <p>
                                    <b>Items:</b> {o.items?.length || 0}
                                </p>

                            </div>



                            {/* ITEMS */}

                            <div className="mt-5">

                                <p className="font-semibold text-lg mb-3">
                                    Ordered Items
                                </p>

                                <div className="space-y-3">

                                    {o.items?.map((item) => (



                                        <div
                                            key={`${o.orderId}-${item.productId}`}
                                            className="
                                        flex
                                        items-center
                                        gap-4
                                        p-4
                                        bg-gray-50
                                        border
                                        border-gray-200
                                        rounded-2xl
                                        "
                                        >

                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                onClick={() =>
                                                    navigate(`/product/${item.productId}`)
                                                }
                                                className="
                                                    w-24 h-24
                                                    object-contain
                                                    bg-white
                                                    border
                                                    rounded-xl
                                                    p-2
                                                    cursor-pointer
                                                    hover:scale-105
                                                    transition
                                                    "
                                            />

                                            <div className="flex-1">

                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                    {item.productName}
                                                </h3>

                                                <div className="flex items-center gap-2 mt-2 flex-wrap">

                                                    <span className="text-xl font-bold text-slate-900">
                                                        ₹{item.price}
                                                    </span>

                                                    {item.mrp > item.price && (
                                                        <span className="line-through text-gray-400">
                                                            ₹{item.mrp}
                                                        </span>
                                                    )}

                                                    {item.discountPercentage > 0 && (
                                                        <span className="text-green-600 font-semibold text-sm">
                                                            {item.discountPercentage}% OFF
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">

                                                    <span>
                                                        Qty: {item.quantity}
                                                    </span>

                                                    {item.selectedColor && (() => {

                                                        const colorObj =
                                                            COLORS.find(
                                                                c => c.name === item.selectedColor
                                                            );

                                                        return (

                                                            <div className="flex items-center gap-2">

                                                                <span
                                                                    className="w-4 h-4 rounded-full border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            colorObj?.hex || "#ccc"
                                                                    }}
                                                                />

                                                                <span className="text-sm text-gray-600">
                                                                    {item.selectedColor}
                                                                </span>

                                                            </div>

                                                        );

                                                    })()}

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                            {/* ADDRESS */}
                            {o.address && (

                                <div className="mt-4 border rounded-2xl p-5 bg-gray-50">

                                    <h3 className="font-semibold text-lg mb-4">
                                        Delivery Address
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">

                                        <MapPin
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        <span className="font-medium text-gray-800">

                                            {
                                                o.address?.addressType ||
                                                "Address"
                                            }

                                        </span>

                                    </div>

                                    <div className="space-y-1 text-gray-700">

                                        <p className="font-medium">
                                            {o.address?.street}
                                        </p>

                                        <p>
                                            {o.address?.city},
                                            {" "}
                                            {o.address?.state}
                                        </p>

                                        <p>
                                            {o.address?.country}
                                            {" - "}
                                            {o.address?.zipCode}
                                        </p>

                                        <p className="flex items-center gap-2 mt-2">

                                            <Phone
                                                size={15}
                                                className="text-gray-500"
                                            />

                                            {o.address?.phoneNumber}

                                        </p>

                                    </div>

                                </div>

                            )}

                            {/* STATUS INFO */}

                            {
                                o.payment ? (

                                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">

                                        <p className="font-semibold text-green-700">
                                            Payment Successful
                                        </p>

                                        <p className="text-sm mt-1">
                                            Transaction ID:
                                            {" "}
                                            {o.payment.transactionId}
                                        </p>

                                        <p className="text-sm">
                                            Amount:
                                            {" "}
                                            ₹{
                                                Number(o.payment.amount)
                                                    .toLocaleString("en-IN")
                                            }
                                        </p>

                                    </div>

                                ) : o.status === "CREATED" ? (

                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

                                        <p className="font-semibold text-yellow-700">
                                            Awaiting Payment
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            User has not completed payment yet.
                                        </p>

                                    </div>

                                ) : o.status === "CANCELLED" ? (

                                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">

                                        <p className="font-semibold text-red-700">
                                            Order Cancelled
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">

                                            {
                                                o.cancelReason === "PAYMENT_TIMEOUT"
                                                    ? "Payment was not completed within 30 minutes."
                                                    : "Cancelled by administrator."
                                            }

                                        </p>

                                    </div>

                                ) : null
                            }

                            {/* STATUS UPDATE */}
                            <div className="mt-4 flex items-center gap-3">

                                <div className="mt-4 flex gap-3">

                                    {
                                        o.status === "PENDING" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        o.orderId,
                                                        "CONFIRMED"
                                                    )
                                                }
                                                className="
                                                    bg-blue-600
                                                    hover:bg-blue-700
                                                    text-white
                                                    px-5
                                                    py-2
                                                    rounded-xl
                                                    font-medium
                                                    "
                                            >
                                                Confirm Order
                                            </button>
                                        )
                                    }

                                    {
                                        o.status === "SHIPPED" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        o.orderId,
                                                        "OUT_FOR_DELIVERY"
                                                    )
                                                }
                                                className="
                                                    bg-orange-500
                                                    hover:bg-orange-600
                                                    text-white
                                                    px-5
                                                    py-2
                                                    rounded-xl
                                                    font-medium
                                                    "
                                            >
                                                Out For Delivery
                                            </button>
                                        )
                                    }

                                    {
                                        o.status === "OUT_FOR_DELIVERY" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        o.orderId,
                                                        "DELIVERED"
                                                    )
                                                }
                                                className="
                                                    bg-green-600
                                                    hover:bg-green-700
                                                    text-white
                                                    px-5
                                                    py-2
                                                    rounded-xl
                                                    font-medium
                                                    "
                                            >
                                                Mark Delivered
                                            </button>
                                        )
                                    }

                                </div>

                            </div>



                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default AdminOrders;