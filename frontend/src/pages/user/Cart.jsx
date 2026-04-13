import { useState } from "react";

function Cart() {
    const [cart, setCart] = useState({
        items: [
            {
                id: 1,
                productId: 101,
                name: "Shoes",
                price: 1000,
                quantity: 1,
            },
        ],
    });

    const handleAdd = () => {
        const newItem = {
            id: Date.now(),
            productId: 200,
            name: "New Product",
            price: 500,
            quantity: 1,
        };

        setCart({
            items: [...cart.items, newItem],
        });

        console.log("POST → /api/cart/add");
    };

    const handleUpdate = (id, qty) => {
        if (qty < 1) return;

        setCart({
            items: cart.items.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
            ),
        });

        console.log(`PUT → /api/cart/update/${id}?quantity=${qty}`);
    };

    const handleRemove = (id) => {
        if (!window.confirm("Remove item?")) return;

        setCart({
            items: cart.items.filter((item) => item.id !== id),
        });

        console.log(`DELETE → /api/cart/remove/${id}`);
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

            {/* CART ITEMS */}
            <div className="space-y-4">

                {cart.items.length === 0 && (
                    <p className="text-center text-gray-500">
                        Cart is empty
                    </p>
                )}

                {cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="border p-4 rounded-xl shadow bg-white flex justify-between items-center"
                    >
                        <div>
                            <h2 className="font-bold">{item.name}</h2>
                            <p>₹ {item.price}</p>

                            {/* QUANTITY */}
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() =>
                                        handleUpdate(item.id, item.quantity - 1)
                                    }
                                    className="px-2 bg-gray-300 rounded"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() =>
                                        handleUpdate(item.id, item.quantity + 1)
                                    }
                                    className="px-2 bg-gray-300 rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">
                                ₹ {item.price * item.quantity}
                            </p>

                            <button
                                onClick={() => handleRemove(item.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TOTAL */}
            {cart.items.length > 0 && (
                <div className="mt-6 p-4 border rounded-xl bg-gray-100">
                    <h2 className="font-bold text-lg">
                        Total: ₹ {total}
                    </h2>
                </div>
            )}
        </div>
    );
}

export default Cart;