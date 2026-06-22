import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { MapPin, Phone } from "lucide-react";

function MerchantOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/merchant/orders");
            setOrders(res.data.data || []);
        } catch (err) {
            console.log(err);
            alert("Failed to load orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    const updateStatus = async (orderId, status) => {
        try {
            await API.put(`/merchant/orders/${orderId}/status`, null, {
                params: { status }
            });

            alert("Status updated ");
            fetchOrders();
            setSelectedOrder(null);

        } catch (err) {
            console.log(err);
            alert("Update failed ");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED": return "bg-blue-100 text-blue-700";
            case "SHIPPED": return "bg-yellow-100 text-yellow-700";
            case "OUT_FOR_DELIVERY": return "bg-orange-100 text-orange-700";
            case "DELIVERED": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

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

            <h1 className="text-3xl font-bold mb-6">Merchant Orders</h1>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Total Orders
                    </p>

                    <h2 className="text-3xl font-bold">
                        {orders.length}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Confirmed
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600">
                        {
                            orders.filter(
                                o => o.status === "CONFIRMED"
                            ).length
                        }
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Shipped
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-600">
                        {
                            orders.filter(
                                o => o.status === "SHIPPED"
                            ).length
                        }
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Delivered
                    </p>

                    <h2 className="text-3xl font-bold text-green-600">
                        {
                            orders.filter(
                                o => o.status === "DELIVERED"
                            ).length
                        }
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Revenue
                    </p>

                    <h2 className="text-2xl font-bold text-green-600">
                        ₹ {
                            orders
                                .reduce(
                                    (sum, o) =>
                                        sum + o.totalPrice,
                                    0
                                )
                                .toLocaleString("en-IN")
                        }
                    </h2>
                </div>

            </div>

            {/* ================= LIST ================= */}
            <div className="grid md:grid-cols-2 gap-4">

                {orders.length === 0 && (
                    <p>No orders</p>
                )}

                {orders.map(o => (

                    <div
                        key={o.orderId}
                        onClick={() => handleSelectOrder(o)}
                        className={`bg-white rounded-2xl shadow p-5 cursor-pointer hover:shadow-xl transition border-2
                        ${selectedOrder?.orderId === o.orderId
                                ? "border-blue-500"
                                : "border-transparent"
                            }`}
                    >

                        <div className="flex justify-between items-center">

                            <div>

                                <h2 className="font-bold text-xl">
                                    Order #{o.orderId}
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    {o.items?.length || 0} Items
                                </p>

                                <p className="text-green-600 font-bold text-lg mt-2">
                                    ₹ {Number(o.totalPrice).toLocaleString("en-IN")}
                                </p>

                            </div>


                            <span
                                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(o.status)}`}
                            >
                                {o.status.replaceAll("_", " ")}
                            </span>

                        </div>

                        {/* ADDRESS */}
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
                            {/* ================= DETAILS ================= */}
                            {
                                selectedOrder?.orderId === o.orderId && (

                                    <div className="mt-8 bg-white rounded-2xl shadow p-6">

                                        <div className="flex justify-between items-center mb-6">

                                            <div>

                                                <h2 className="text-2xl font-bold">
                                                    Order #{selectedOrder.orderId}
                                                </h2>

                                                <p className="text-gray-500">
                                                    Total ₹ {
                                                        Number(
                                                            selectedOrder.totalPrice
                                                        ).toLocaleString("en-IN")
                                                    }
                                                </p>

                                            </div>

                                            <span
                                                className={`px-4 py-2 rounded-full font-medium ${getStatusColor(
                                                    selectedOrder.status
                                                )}`}
                                            >
                                                {selectedOrder.status.replaceAll("_", " ")}
                                            </span>

                                        </div>

                                        <div className="space-y-4">

                                            {selectedOrder.items?.map((item, i) => {

                                                const colorObj = COLORS.find(
                                                    c => c.name === item.selectedColor
                                                );

                                                return (

                                                    <div
                                                        key={i}
                                                        className="border rounded-2xl p-4 flex justify-between items-center hover:bg-gray-50 transition"
                                                    >

                                                        <div className="flex gap-4 items-center">

                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                onClick={() =>
                                                                    navigate(`/product/${item.productId}`)
                                                                }
                                                                className="
                                                                    w-24
                                                                    h-24
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

                                                                <h3 className="font-semibold text-lg">
                                                                    {item.productName}
                                                                </h3>

                                                                {
                                                                    item.selectedColor && (

                                                                        <div className="flex items-center gap-2 mt-2">

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

                                                                    )
                                                                }

                                                                <p className="text-gray-500 mt-2">
                                                                    Qty : {item.quantity}
                                                                </p>

                                                                <div className="flex items-center gap-2 mt-2 flex-wrap">

                                                                    <span className="font-bold text-green-600 text-lg">
                                                                        ₹ {
                                                                            Number(
                                                                                item.price
                                                                            ).toLocaleString("en-IN")
                                                                        }
                                                                    </span>

                                                                    {
                                                                        item.mrp > item.price && (

                                                                            <span className="text-gray-400 line-through text-sm">

                                                                                ₹ {
                                                                                    Number(
                                                                                        item.mrp
                                                                                    ).toLocaleString("en-IN")
                                                                                }

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

                                                        </div>

                                                    </div>

                                                );

                                            })}

                                        </div>

                                    </div>

                                )}

                            <div className="mt-5 flex gap-3">

                                {o.status === "CONFIRMED" && (

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                o.orderId,
                                                "SHIPPED"
                                            )
                                        }
                                        className="
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        px-5
                                        py-3
                                        rounded-xl
                                        "
                                    >
                                        Ship
                                    </button>

                                )}

                                {o.status === "SHIPPED" && (

                                    <span className="text-yellow-600 font-semibold">
                                        Shipped
                                    </span>

                                )}

                                {o.status === "OUT_FOR_DELIVERY" && (

                                    <span className="text-orange-600 font-semibold">
                                        Out For Delivery
                                    </span>

                                )}

                                {o.status === "DELIVERED" && (

                                    <span className="text-green-600 font-semibold">
                                        Delivered
                                    </span>

                                )}

                            </div>

                        </div>



                    </div>

                ))}

            </div>


        </div >
    );
}

export default MerchantOrders;