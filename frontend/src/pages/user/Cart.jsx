import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    // 🔥 LOAD CART
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    // 🔥 SAVE CART
    const updateCart = (items) => {
        setCart(items);
        localStorage.setItem("cart", JSON.stringify(items));
    };

    // 🔥 UPDATE QTY
    const changeQty = (id, delta) => {
        const updated = cart.map((item) =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        updateCart(updated);
    };

    // 🔥 REMOVE
    const removeItem = (id) => {
        const updated = cart.filter((item) => item.id !== id);
        updateCart(updated);
    };

    // 🔥 PLACE ORDER → PAYMENT FLOW
    const handleCheckout = () => {
        if (cart.length === 0) return;

        const orderId = Date.now();

        localStorage.setItem("currentOrderId", orderId);
        localStorage.setItem("orders", JSON.stringify(cart));

        localStorage.removeItem("cart");
        setCart([]);

        navigate("/payment");
    };

    // 🔥 TOTAL
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">

            {/* HEADER */}
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center mt-20">
                    <p className="text-gray-500 text-lg mb-4">
                        Your cart is empty 🛒
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-500 text-white px-5 py-2 rounded"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    {/* CART ITEMS */}
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                            >
                                {/* LEFT */}
                                <div>
                                    <h2 className="font-semibold text-lg">{item.name}</h2>
                                    <p className="text-gray-500">₹ {item.price}</p>

                                    {/* QTY */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => changeQty(item.id, -1)}
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            -
                                        </button>

                                        <span className="px-2">{item.quantity}</span>

                                        <button
                                            onClick={() => changeQty(item.id, 1)}
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        ₹ {item.price * item.quantity}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="mt-2 text-red-500 hover:underline text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-8 border-t pt-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Total: ₹ {total}
                        </h2>

                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
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