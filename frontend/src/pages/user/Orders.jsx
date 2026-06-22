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

function Orders() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const navigate = useNavigate();

    // ================= FETCH =================
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/user/orders/my-orders");
                setOrders(res.data.data || []);
            } catch (err) {
                console.log(err);
            }
        };
        fetchOrders();
    }, []);

    // ================= SELECT =================
    const handleSelectOrder = async (orderId) => {
        try {
            const [orderRes, trackingRes] = await Promise.all([
                API.get(`/user/orders/${orderId}`),
                API.get(`/user/orders/${orderId}/tracking`)
            ]);

            setSelectedOrder({
                ...orderRes.data.data,
                tracking: trackingRes.data.data
            });

        } catch (err) {
            console.log(err);
        }
    };

    // ================= STATUS COLOR =================
    const getStatusColor = (status) => {
        switch (status) {
            case "CREATED": return "bg-yellow-500";
            case "PENDING": return "bg-blue-500";
            case "CANCELLED": return "bg-red-500";
            case "CONFIRMED": return "bg-blue-500";
            case "SHIPPED": return "bg-yellow-500";
            case "OUT_FOR_DELIVERY": return "bg-orange-500";
            case "DELIVERED": return "bg-green-500";
            default: return "bg-gray-400";
        }
    };

    console.log(selectedOrder);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <div className="flex items-center justify-between mb-6">

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
                    My Orders
                </h1>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* ================= LEFT: LIST ================= */}
                <div className="space-y-4">

                    {orders.map(order => (

                        <div
                            key={order.orderId}
                            onClick={() =>
                                handleSelectOrder(order.orderId)
                            }
                            className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition border"
                        >

                            <div className="flex justify-between items-start">

                                <div className="flex gap-4">

                                    {/* PRODUCT IMAGES */}
                                    <div className="flex -space-x-3">

                                        {order.items
                                            ?.slice(0, 3)
                                            .map((item, index) => (

                                                <img
                                                    key={index}
                                                    src={item.productImage}
                                                    alt=""
                                                    className="w-16 h-16 rounded-lg border-2 border-white object-cover bg-white"
                                                />

                                            ))}

                                    </div>

                                    {/* ORDER INFO */}
                                    <div>

                                        <h3 className="font-bold text-lg">
                                            Order #{order.orderId}
                                        </h3>

                                        <p className="text-gray-700 text-sm mt-1">

                                            {
                                                order.items
                                                    ?.slice(0, 2)
                                                    .map(i => i.productName)
                                                    .join(", ")
                                            }

                                            {
                                                order.items?.length > 2 &&
                                                ` + ${order.items.length - 2} more`
                                            }

                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            {order.items?.length || 0} Item(s)
                                        </p>

                                        <p className="text-green-600 font-bold mt-1">
                                            ₹ {order.totalPrice}
                                        </p>

                                    </div>

                                </div>

                                {/* STATUS */}
                                <span
                                    className={`text-white px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status.replaceAll("_", " ")}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

                {/* ================= RIGHT: DETAILS ================= */}
                <div>

                    {!selectedOrder && (
                        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                            Select an order to view details
                        </div>
                    )}

                    {selectedOrder && (
                        <div className="bg-white p-6 rounded-xl shadow space-y-4">

                            {/* HEADER */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    Order #{selectedOrder.orderId}
                                </h2>

                                <span className={`text-white px-3 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            {/* PRICE */}
                            <p className="text-lg font-semibold">
                                Total: ₹ {Number(selectedOrder.totalPrice).toLocaleString("en-IN")}
                            </p>

                            {/* ITEMS */}
                            <div>

                                <p className="font-semibold mb-3 text-lg">
                                    Items
                                </p>

                                <div className="space-y-4">

                                    {selectedOrder.items?.map((item, i) => (

                                        <div
                                            key={i}
                                            className="flex items-center gap-4 border rounded-xl p-3 hover:bg-gray-50"
                                        >

                                            <img
                                                src={item.productImage}
                                                alt=""
                                                onClick={() =>
                                                    navigate(`/product/${item.productId}`)
                                                }
                                                className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                                            />

                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() =>
                                                    navigate(`/product/${item.productId}`)
                                                }
                                            >

                                                <h3 className="font-semibold">
                                                    {item.productName}
                                                </h3>

                                                {
                                                    item.selectedColor && (() => {

                                                        const colorObj =
                                                            COLORS.find(
                                                                c => c.name === item.selectedColor
                                                            );

                                                        return (

                                                            <div className="flex items-center gap-2 mt-1">

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

                                                    })()
                                                }

                                                <p className="text-gray-500 text-sm mt-1">
                                                    Qty: {item.quantity}
                                                </p>

                                                <div className="flex items-center gap-2 mt-1 flex-wrap">

                                                    <span className="text-green-600 font-bold text-lg">
                                                        ₹ {Number(item.price).toLocaleString("en-IN")}
                                                    </span>

                                                    {
                                                        item.mrp > item.price && (

                                                            <span className="text-gray-400 line-through text-sm">

                                                                ₹ {Number(item.mrp).toLocaleString("en-IN")}

                                                            </span>

                                                        )
                                                    }

                                                    {
                                                        item.discountPercentage > 0 && (

                                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">

                                                                {item.discountPercentage}% OFF

                                                            </span>

                                                        )
                                                    }

                                                </div>

                                            </div>

                                            {
                                                selectedOrder.status === "DELIVERED" && (
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/product/${item.productId}#reviews`)
                                                        }
                                                        className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                                                    >
                                                        Review
                                                    </button>
                                                )
                                            }
                                        </div>


                                    ))}

                                </div>


                            </div>
                            <div className="border rounded-xl p-4 bg-gray-50">

                                <h3 className="font-semibold text-lg mb-3">
                                    Delivery Address
                                </h3>

                                <div className="flex items-center gap-2 mb-3">

                                    <MapPin
                                        size={16}
                                        className="text-blue-600"
                                    />

                                    <span className="font-medium text-gray-800">

                                        {
                                            selectedOrder.address?.addressType ||
                                            "Address"
                                        }

                                    </span>

                                </div>

                                <div className="space-y-1 text-gray-700">

                                    <p className="font-medium">
                                        {selectedOrder.address?.street}
                                    </p>

                                    <p>
                                        {selectedOrder.address?.city},
                                        {" "}
                                        {selectedOrder.address?.state}
                                    </p>

                                    <p>
                                        {selectedOrder.address?.country}
                                        {" - "}
                                        {selectedOrder.address?.zipCode}
                                    </p>

                                    <p className="flex items-center gap-2 mt-2">

                                        <Phone
                                            size={15}
                                            className="text-gray-500"
                                        />

                                        {selectedOrder.address?.phoneNumber}

                                    </p>

                                </div>

                            </div>
                            {/* ================= PAYMENT DETAILS ================= */}

                            {
                                (
                                    selectedOrder.payment ||
                                    selectedOrder.status === "CREATED"
                                ) && (

                                    <div className="bg-white border rounded-2xl p-5 shadow-sm">

                                        <h3 className="font-bold text-lg mb-4">
                                            💳 Payment Details
                                        </h3>

                                        {
                                            selectedOrder.payment ? (

                                                <div className="space-y-3">

                                                    <div className="flex justify-between">

                                                        <span className="text-gray-500">
                                                            Payment Status
                                                        </span>

                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                            {selectedOrder.payment.status}
                                                        </span>

                                                    </div>

                                                    <div className="flex justify-between">

                                                        <span className="text-gray-500">
                                                            Transaction ID
                                                        </span>

                                                        <span className="font-medium text-gray-800">
                                                            {selectedOrder.payment.transactionId}
                                                        </span>

                                                    </div>

                                                    <div className="flex justify-between">

                                                        <span className="text-gray-500">
                                                            Paid At
                                                        </span>

                                                        <span className="text-gray-800">
                                                            {
                                                                new Date(
                                                                    selectedOrder.payment.paidAt
                                                                ).toLocaleString()
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="flex justify-between border-t pt-3">

                                                        <span className="text-gray-500">
                                                            Amount Paid
                                                        </span>

                                                        <span className="font-bold text-green-600 text-lg">
                                                            ₹ {
                                                                Number(
                                                                    selectedOrder.payment.amount
                                                                ).toLocaleString("en-IN")
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            ) : (

                                                <div className="space-y-3">

                                                    <div className="flex items-center gap-2 text-orange-600 font-medium">

                                                        Payment Pending

                                                    </div>

                                                    <p className="text-sm text-gray-500">

                                                        No payment has been received yet.

                                                    </p>

                                                </div>

                                            )
                                        }

                                    </div>

                                )
                            }

                            {/* ================= CANCELLED ORDER ================= */}

                            {
                                selectedOrder.status === "CANCELLED" && (

                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-4">

                                        <h3 className="font-semibold text-red-700">
                                            Order Cancelled
                                        </h3>

                                        {
                                            selectedOrder.cancelReason === "PAYMENT_TIMEOUT" &&
                                            (
                                                <>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Payment was not completed within 30 minutes.
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        This order was automatically cancelled.
                                                    </p>
                                                </>
                                            )
                                        }
                                        {
                                            selectedOrder.cancelReason === "ADMIN_CANCELLED" &&
                                            (
                                                <p>
                                                    This order was cancelled by administrator.
                                                </p>
                                            )
                                        }

                                        {
                                            selectedOrder.cancelReason === "USER_CANCELLED" &&
                                            (
                                                <p>
                                                    You cancelled this order.
                                                </p>
                                            )
                                        }

                                    </div>

                                )
                            }


                            {/* ================= PAYMENT PENDING ================= */}

                            {
                                selectedOrder.status === "CREATED" && (

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4">

                                        <h3 className="font-semibold text-yellow-700">
                                            Awaiting Payment
                                        </h3>

                                        <p className="text-sm text-gray-600 mt-2">

                                            Complete your payment within
                                            30 minutes to confirm this order.

                                        </p>

                                        <p className="text-sm text-gray-600 mb-5">

                                            Unpaid orders are automatically cancelled.

                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/payment/${selectedOrder.orderId}`
                                                )
                                            }
                                            className="
                                            bg-green-600
                                            hover:bg-green-700
                                            text-white
                                            px-8
                                            py-3
                                            rounded-xl
                                            font-semibold
                                            shadow-md
                                            hover:shadow-lg
                                            transition
                                            "
                                        >
                                            💳 Pay Now
                                        </button>

                                    </div>

                                )
                            }


                            {/* ================= TIMELINE ================= */}
                            <div>
                                <p className="font-semibold mb-4 text-lg">Tracking</p>

                                <div className="relative">

                                    {selectedOrder.tracking?.map((t, i) => {

                                        const isLast =
                                            i === selectedOrder.tracking.length - 1;

                                        const isCancelled =
                                            t.status === "CANCELLED";

                                        return (

                                            <div
                                                key={i}
                                                className="flex items-start gap-4 mb-6 relative"
                                            >

                                                {!isLast && (

                                                    <div
                                                        className={`
                                                            absolute
                                                            left-[10px]
                                                            top-6
                                                            w-[2px]
                                                            h-full
                                                            ${isCancelled
                                                                ? "bg-red-300"
                                                                : "bg-gray-300"
                                                            }
                                                       `}
                                                    />

                                                )}

                                                <div
                                                    className={`
                                                                w-5
                                                                h-5
                                                                rounded-full
                                                                z-10
                                                                ${isCancelled
                                                            ? "bg-red-500"
                                                            : "bg-green-500"
                                                        }
                                                      `}
                                                />

                                                <div>

                                                    <p
                                                        className={`
                                                                    font-semibold
                                                                    ${isCancelled
                                                                ? "text-red-600"
                                                                : "text-green-600"
                                                            }
                                                      `}
                                                    >

                                                        {
                                                            t.status
                                                                .replaceAll("_", " ")
                                                                .toLowerCase()
                                                        }

                                                    </p>

                                                    <p className="text-sm text-gray-500">

                                                        {
                                                            new Date(
                                                                t.updatedAt
                                                            ).toLocaleString()
                                                        }

                                                    </p>

                                                    {
                                                        isCancelled &&
                                                        selectedOrder.cancelReason === "PAYMENT_TIMEOUT" && (

                                                            <p className="text-xs text-red-500 mt-1">

                                                                Payment not completed within 30 minutes

                                                            </p>

                                                        )
                                                    }

                                                    {
                                                        isCancelled &&
                                                        selectedOrder.cancelReason === "ADMIN_CANCELLED" && (

                                                            <p className="text-xs text-red-500 mt-1">

                                                                Cancelled by administrator

                                                            </p>

                                                        )
                                                    }

                                                    {
                                                        isCancelled &&
                                                        selectedOrder.cancelReason === "USER_CANCELLED" && (

                                                            <p className="text-xs text-red-500 mt-1">

                                                                Cancelled by user

                                                            </p>

                                                        )
                                                    }

                                                </div>

                                            </div>

                                        );

                                    })}

                                </div>
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default Orders;