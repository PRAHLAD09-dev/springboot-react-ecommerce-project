import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
    Home,
    Building2,
    Building,
    Store,
    MapPin,
    Phone
} from "lucide-react";
import { COLORS } from "../../constants/colors";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [selectedColor, setSelectedColor] = useState("");
    const [showAddresses, setShowAddresses] = useState(false);

    // ================= FETCH CART =================
    const fetchCart = async () => {
        try {
            const res = await API.get("/cart");

            console.log("Cart API:", res.data);

            const cartResponse = res.data.data;

            const cartItems = cartResponse.items || [];

            setCart(cartItems);

            setTotal(cartResponse.totalPrice || 0);

        } catch (err) {
            console.log(err);
            alert("Failed to load cart");
        }
    };

    // ================= FETCH ADDRESS =================
    const fetchAddresses = async () => {
        try {
            const res = await API.get("/user/address");

            console.log("Address API:", res.data);

            const addressData = res.data.data || [];

            setAddresses(addressData);

            if (addressData.length > 0) {
                setSelectedAddress(
                    addresses.find(a => a.addressType) ||
                    addresses[0]
                );
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    const getAddressType = (type) => {

        switch (type) {

            case "HOME":
                return {
                    icon: <Home size={16} />,
                    label: "Home"
                };

            case "OFFICE":
                return {
                    icon: <Building2 size={16} />,
                    label: "Office"
                };

            case "APARTMENT":
                return {
                    icon: <Building size={16} />,
                    label: "Apartment"
                };

            case "SHOP":
                return {
                    icon: <Store size={16} />,
                    label: "Shop"
                };

            default:
                return {
                    icon: <MapPin size={16} />,
                    label: "Other"
                };
        }

    };

    // ================= CHANGE QTY =================
    const changeQty = async (cartItemId, delta) => {
        const item = cart.find(
            (i) => i.cartItemId === cartItemId
        );

        if (!item) return;

        const newQty = item.quantity + delta;

        if (newQty < 1) return;

        try {
            await API.put(
                `/cart/update/${cartItemId}?quantity=${newQty}`
            );

            fetchCart();

        } catch (err) {
            console.log(err);
            alert("Update failed");
        }
    };

    // ================= REMOVE ITEM =================
    const removeItem = async (cartItemId) => {
        if (!window.confirm("Remove item?")) return;

        try {
            await API.delete(
                `/cart/remove/${cartItemId}`
            );

            fetchCart();

        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };

    // ================= CHECKOUT =================
    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        if (!selectedAddress) {
            alert("Select address first");
            return;
        }

        try {
            const res = await API.post(
                `/user/orders/place?addressId=${selectedAddress.id}`
            );

            console.log("Order placed:", res.data);

            const orderId = res.data.data?.orderId;

            navigate(`/payment/${orderId}`);

        } catch (err) {
            console.log(err);
            alert("Checkout failed");
        }
    };

    const totalMrp = cart.reduce(
        (total, item) =>
            total + (item.mrp * item.quantity),
        0
    );

    const totalSellingPrice = cart.reduce(
        (total, item) =>
            total + item.price,
        0
    );

    const totalDiscount =
        totalMrp - totalSellingPrice;
    console.log(
        totalMrp,
        totalSellingPrice,
        totalDiscount
    );
    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Shopping Cart
                </h1>

                <button
                    onClick={() => navigate("/orders")}
                    className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                    My Orders
                </button>
            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
                <div className="text-center mt-20">
                    <p className="text-gray-500 text-lg mb-4">
                        Your cart is empty 🛒
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-500 text-white px-6 py-2 rounded"
                    >
                        Start Shopping →
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* LEFT */}
                        <div className="lg:col-span-2">

                            {/* CART ITEMS */}
                            <div className="space-y-4">

                                {cart.map((item) => (

                                    <div
                                        key={item.cartItemId}
                                        onClick={() =>
                                            navigate(`/product/${item.productId}`)
                                        }
                                        className="bg-white rounded-2xl shadow-sm border p-5 cursor-pointer hover:shadow-lg transition"
                                    >

                                        <div className="flex gap-5">

                                            <img
                                                src={
                                                    item.imageUrl ||
                                                    "https://via.placeholder.com/120"
                                                }
                                                alt={item.productName}
                                                className="w-32 h-32 object-contain rounded-xl border bg-white p-2"
                                            />

                                            <div className="flex-1">

                                                <h2 className="font-semibold text-2xl">
                                                    {item.productName}
                                                </h2>

                                                {
                                                    item.selectedColor && (() => {

                                                        const colorObj =
                                                            COLORS.find(
                                                                c =>
                                                                    c.name ===
                                                                    item.selectedColor
                                                            );

                                                        return (

                                                            <div className="flex items-center gap-2 mt-2">

                                                                <span className="text-gray-500 text-sm">
                                                                    Color:
                                                                </span>

                                                                <span
                                                                    className="w-5 h-5 rounded-full border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            colorObj?.hex || "#ccc"
                                                                    }}
                                                                />

                                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                                                    {item.selectedColor}
                                                                </span>

                                                            </div>

                                                        );

                                                    })()
                                                }
                                                {/* PRICE */}
                                                <div className="mt-3">

                                                    <div className="flex items-center gap-3 flex-wrap">

                                                        <span className="text-green-600 text-3xl font-bold">
                                                            ₹ {Number(item.price).toLocaleString("en-IN")}
                                                        </span>

                                                        {
                                                            item.mrp > item.price && (

                                                                <span className="text-gray-400 line-through text-lg">
                                                                    ₹ {Number(item.mrp).toLocaleString("en-IN")}
                                                                </span>

                                                            )
                                                        }

                                                        {
                                                            item.discountPercentage > 0 && (

                                                                <span
                                                                    className="
                                                                    bg-green-600
                                                                    text-white
                                                                    text-sm
                                                                    px-4
                                                                    py-2
                                                                    rounded-full
                                                                    font-semibold
                                                                    "
                                                                >
                                                                    {item.discountPercentage}% OFF
                                                                </span>

                                                            )
                                                        }

                                                    </div>

                                                </div>

                                                <div className="mt-2">

                                                    <span
                                                        className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                bg-green-100
                                                text-green-700
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                font-medium
                                                "
                                                    >
                                                        In Stock
                                                    </span>

                                                </div>

                                                {/* QUANTITY */}
                                                <div className="flex items-center gap-3 mt-5">

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            changeQty(
                                                                item.cartItemId,
                                                                -1
                                                            );
                                                        }}
                                                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full font-bold"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="font-semibold text-lg">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            changeQty(
                                                                item.cartItemId,
                                                                1
                                                            );
                                                        }}
                                                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full font-bold"
                                                    >
                                                        +
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeItem(
                                                                item.cartItemId
                                                            );
                                                        }}
                                                        className="ml-6 text-red-500 hover:text-red-700 font-medium"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            {/* ADDRESS */}
                            <div className="bg-white rounded-xl shadow p-5 mt-4">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <h2 className="text-xl font-bold mb-3">
                                            Delivery Address
                                        </h2>

                                        {selectedAddress && (

                                            <>
                                                <div className="flex items-center gap-2 mb-2">

                                                    {
                                                        getAddressType(
                                                            selectedAddress.addressType
                                                        ).icon
                                                    }

                                                    <span className="font-semibold">
                                                        {
                                                            getAddressType(
                                                                selectedAddress.addressType
                                                            ).label
                                                        }
                                                    </span>

                                                </div>

                                                <p className="font-medium">
                                                    {selectedAddress.street}
                                                </p>

                                                <p className="text-gray-600">
                                                    {selectedAddress.city},
                                                    {" "}
                                                    {selectedAddress.state}
                                                </p>

                                                <p className="text-gray-600">
                                                    {selectedAddress.country}
                                                    {" - "}
                                                    {selectedAddress.zipCode}
                                                </p>

                                                <p className="text-gray-600">
                                                    {selectedAddress.phoneNumber}
                                                </p>

                                            </>

                                        )}

                                    </div>

                                    <button
                                        onClick={() =>
                                            setShowAddresses(
                                                !showAddresses
                                            )
                                        }
                                        className="
                                            text-blue-600
                                            font-medium
                                            "
                                    >
                                        Change
                                    </button>

                                </div>

                            </div>
                            {
                                showAddresses && (

                                    <div className="mt-3 space-y-2">

                                        {addresses.map((a) => (

                                            <button
                                                key={a.id}
                                                onClick={() => {

                                                    setSelectedAddress(a);

                                                    setShowAddresses(false);

                                                }}
                                                className="
                                                    w-full
                                                    text-left
                                                    border
                                                    rounded-lg
                                                    p-3
                                                    hover:bg-gray-50
                                                    "
                                            >

                                                {a.street}

                                                <div className="text-sm text-gray-500">

                                                    {a.city}, {a.state}

                                                </div>

                                            </button>

                                        ))}

                                    </div>

                                )
                            }
                        </div>

                        {/* RIGHT */}
                        <div>

                            <div className="bg-white rounded-2xl shadow border p-6 sticky top-24">

                                <h2 className="text-2xl font-bold mb-5">
                                    Price Details
                                </h2>

                                <div className="flex justify-between mb-3">

                                    <span>
                                        Price ({cart.length} items)
                                    </span>

                                    <span>
                                        ₹ {totalMrp.toLocaleString("en-IN")}
                                    </span>

                                </div>

                                <div className="flex justify-between mb-3">

                                    <span>
                                        Discount
                                    </span>

                                    <span className="text-green-600 font-medium">

                                        - ₹ {totalDiscount.toLocaleString("en-IN")}

                                    </span>

                                </div>

                                <div className="flex justify-between mb-3">

                                    <span>
                                        Delivery
                                    </span>

                                    <span className="text-green-600 font-medium">
                                        FREE
                                    </span>

                                </div>

                                <hr className="my-4" />

                                <div className="flex justify-between font-bold text-2xl">

                                    <span>
                                        Total Amount
                                    </span>

                                    <span>
                                        ₹ {totalSellingPrice.toLocaleString("en-IN")}
                                    </span>

                                </div>

                                {
                                    totalDiscount > 0 && (

                                        <p
                                            className="
                                            flex
                                            items-center
                                            gap-2
                                            text-green-600
                                            text-sm
                                            font-semibold
                                            mt-3
                                            "
                                        >
                                            You saved ₹
                                            {totalDiscount.toLocaleString("en-IN")}
                                            on this order
                                        </p>

                                    )
                                }

                                <button
                                    onClick={handleCheckout}
                                    className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-full font-semibold text-lg"
                                >
                                    Proceed To Payment
                                </button>

                            </div>

                        </div>

                    </div>
                </>
            )
            }
        </div >
    );
}

export default Cart;