import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    const userId = localStorage.getItem("userId") || "guest";

    useEffect(() => {
        const data =
            JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        setCart(data);
    }, [userId]);

    const updateCart = (items) => {
        setCart(items);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    };

    const changeQty = (id, delta) => {
        const updated = cart.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: Math.max(1, item.quantity + delta),
                }
                : item
        );
        updateCart(updated);
    };

    const removeItem = (id) => {
        const updated = cart.filter((item) => item.id !== id);
        updateCart(updated);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const orderId = Date.now();

        const existingOrders =
            JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];

        const newOrder = {
            id: orderId,
            items: cart,
            total,
            date: new Date().toISOString(),
        };

        localStorage.setItem(
            `orders_${userId}`,
            JSON.stringify([...existingOrders, newOrder])
        );

        localStorage.removeItem(`cart_${userId}`);
        setCart([]);

        navigate("/payment");
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
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
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border rounded-xl p-4 shadow"
                            >
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {item.name}
                                    </h2>
                                    <p className="text-gray-500">
                                        ₹ {item.price}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                changeQty(item.id, -1)
                                            }
                                            className="px-2 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                changeQty(item.id, 1)
                                            }
                                            className="px-2 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold">
                                        ₹ {item.price * item.quantity}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t pt-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Total: ₹ {total}
                        </h2>

                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 text-white px-6 py-3 rounded"
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