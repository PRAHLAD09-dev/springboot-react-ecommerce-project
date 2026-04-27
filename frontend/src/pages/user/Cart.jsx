import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const token = localStorage.getItem("token");

    // ================= FETCH CART =================
    const fetchCart = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            setCart(data.data?.items || []);
            setTotal(data.data?.totalPrice || 0);

        } catch (err) {
            console.log(err);
            alert("Failed to load cart");
        }
    };

    // ================= FETCH ADDRESS =================
    const fetchAddresses = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/user/address", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            setAddresses(data.data || []);

            if (data.data?.length > 0) {
                setSelectedAddress(data.data[0]);
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
        const item = cart.find(i => i.cartItemId === cartItemId);
        if (!item) return;

        const newQty = item.quantity + delta;
        if (newQty < 1) return;

        try {
            await fetch(
                `http://localhost:8080/api/cart/update/${cartItemId}?quantity=${newQty}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            fetchCart();

        } catch (err) {
            console.log(err);
            alert("Update failed");
        }
    };

    // ================= REMOVE =================
    const removeItem = async (cartItemId) => {
        if (!window.confirm("Remove item?")) return;

        try {
            await fetch(
                `http://localhost:8080/api/cart/remove/${cartItemId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            fetchCart();

        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };

    // ================= CHECKOUT =================
    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (!selectedAddress) {
            alert("Please select address");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/user/orders/place?addressId=${selectedAddress.id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();

            const orderId = data.data?.orderId;

            navigate(`/payment/${orderId}`);

        } catch (err) {
            console.log(err);
            alert("Checkout failed");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center justify-between mb-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>
                </div>

                <h1 className="text-3xl font-bold">Shopping Cart</h1>

                <button
                    onClick={() => navigate("/orders")}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    My Orders
                </button>
            </div>

            {/* ================= EMPTY ================= */}
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">

                    <p className="text-gray-500 text-lg mb-4">
                        Your cart is empty 🛒
                    </p>

                    <div className="flex gap-4">

                        <button
                            onClick={() => navigate("/")}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Start Shopping →
                        </button>

                    </div>
                </div>
            ) : (
                <>
                    {/* ================= CART ITEMS ================= */}
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="flex justify-between items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                            >
                                <div>
                                    <h2 className="font-semibold">
                                        {item.productName}
                                    </h2>

                                    <p className="text-gray-600">
                                        ₹ {item.price}
                                    </p>

                                    <div className="flex items-center gap-3 mt-2">

                                        <button
                                            onClick={() => changeQty(item.cartItemId, -1)}
                                            className="px-2 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() => changeQty(item.cartItemId, 1)}
                                            className="px-2 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>

                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.cartItemId)}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ================= ADDRESS ================= */}
                    <div className="mt-10">
                        <div className="flex justify-between mb-3">

                            <h2 className="font-bold text-lg">
                                Select Address
                            </h2>

                            <button
                                onClick={() => navigate("/address")}
                                className="text-blue-600 hover:underline"
                            >
                                Manage Address
                            </button>

                        </div>

                        {addresses.length === 0 ? (
                            <p className="text-gray-500">
                                No address found
                            </p>
                        ) : (
                            addresses.map(a => (
                                <div
                                    key={a.id}
                                    className="border p-3 mb-2 rounded flex items-center"
                                >
                                    <input
                                        type="radio"
                                        checked={selectedAddress?.id === a.id}
                                        onChange={() => setSelectedAddress(a)}
                                    />

                                    <span className="ml-2">
                                        {a.street}, {a.city}, {a.state}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ================= TOTAL ================= */}
                    <div className="mt-8 flex justify-between items-center border-t pt-4">

                        <h2 className="text-xl font-bold">
                            Total: ₹ {total}
                        </h2>

                        <button
                            onClick={handleCheckout}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                        >
                            Proceed to Payment →
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;