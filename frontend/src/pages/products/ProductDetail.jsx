import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();


    const product = {
        id: Number(id),
        name: "Shoes",
        price: 1200,
        description: "High quality shoes for daily wear",
    };

    const handleAddToCart = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn) {
            alert("Login first");
            navigate("/login");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Added to cart");
    };

    const handleBuyNow = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn) {
            alert("Login first");
            navigate("/login");
            return;
        }

        const order = [
            {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
            },
        ];

        const orderId = Date.now();

        localStorage.setItem("currentOrderId", orderId);
        localStorage.setItem("orders", JSON.stringify(order));

        navigate("/payment");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-500 hover:underline"
            >
                ← Back
            </button>

            <div className="border rounded-xl shadow-md p-6 bg-white">

                <h1 className="text-3xl font-bold">{product.name}</h1>

                <p className="mt-3 text-gray-600">
                    {product.description}
                </p>

                <p className="mt-4 text-2xl font-semibold text-green-600">
                    ₹ {product.price}
                </p>

                <div className="flex gap-4 mt-6">

                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    >
                        Add to Cart
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
                    >
                        Buy Now
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductDetail;