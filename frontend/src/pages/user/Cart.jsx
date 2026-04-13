import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState({ items: [] });

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart({ items: data });
    }, []);

    const saveCart = (items) => {
        setCart({ items });
        localStorage.setItem("cart", JSON.stringify(items));
    };

    const handleAdd = () => {
        const newItem = {
            id: Date.now(),
            productId: 200,
            name: "New Product",
            price: 500,
            quantity: 1,
        };

        const updated = [...cart.items, newItem];
        saveCart(updated);
    };

    const handleUpdate = (id, qty) => {
        if (qty < 1) return;

        const updated = cart.items.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
        );

        saveCart(updated);
    };

    const handleRemove = (id) => {
        if (!window.confirm("Remove item?")) return;

        const updated = cart.items.filter((item) => item.id !== id);
        saveCart(updated);
    };

    const handlePlaceOrder = () => {
        if (cart.items.length === 0) {
            alert("Cart is empty");
            return;
        }

        localStorage.setItem("orders", JSON.stringify(cart.items));

        localStorage.removeItem("cart");
        setCart({ items: [] });

        alert("Order placed successfully");

        navigate("/orders");
    };

    const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">My Cart</h1>

            <button
                onClick={handleAdd}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Add Dummy Product
            </button>

            <div className="space-y-4">

                {cart.items.length === 0 && (
                    <p className="text-center text-gray-500">
                        Cart is empty
                    </p>
                )}

                {cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="border p-4 rounded-xl shadow bg-white flex justify-between"
                    >
                        <div>
                            <h2 className="font-bold">{item.name}</h2>
                            <p>₹ {item.price}</p>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                    className="px-2 bg-gray-300"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                    className="px-2 bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div>
                            <p>₹ {item.price * item.quantity}</p>

                            <button
                                onClick={() => handleRemove(item.id)}
                                className="bg-red-500 text-white px-3 py-1 mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {cart.items.length > 0 && (
                <div className="mt-6 p-4 border bg-gray-100 rounded">
                    <h2 className="font-bold">Total: ₹ {total}</h2>

                    <button
                        onClick={handlePlaceOrder}
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;