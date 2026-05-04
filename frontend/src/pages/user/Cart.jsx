import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

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
                setSelectedAddress(addressData[0]);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

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
                    {/* CART ITEMS */}
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="flex justify-between border p-4 rounded"
                            >
                                <div>
                                    <h2 className="font-semibold">
                                        {item.productName}
                                    </h2>

                                    <p>
                                        ₹ {item.price}
                                    </p>

                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() =>
                                                changeQty(
                                                    item.cartItemId,
                                                    -1
                                                )
                                            }
                                        >
                                            -
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                changeQty(
                                                    item.cartItemId,
                                                    1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        removeItem(
                                            item.cartItemId
                                        )
                                    }
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ADDRESS */}
                    <div className="mt-8">
                        <h2 className="font-bold mb-3">
                            Select Address
                        </h2>

                        {addresses.length === 0 ? (
                            <p>No address found</p>
                        ) : (
                            addresses.map((a) => (
                                <div
                                    key={a.id}
                                    className="border p-3 mb-2 rounded"
                                >
                                    <input
                                        type="radio"
                                        checked={
                                            selectedAddress?.id === a.id
                                        }
                                        onChange={() =>
                                            setSelectedAddress(a)
                                        }
                                    />

                                    <span className="ml-2">
                                        {a.street}, {a.city},{" "}
                                        {a.state}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* TOTAL */}
                    <div className="mt-8 flex justify-between">
                        <h2 className="text-xl font-bold">
                            Total: ₹ {total}
                        </h2>

                        <button
                            onClick={handleCheckout}
                            className="bg-green-600 text-white px-6 py-2 rounded"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;