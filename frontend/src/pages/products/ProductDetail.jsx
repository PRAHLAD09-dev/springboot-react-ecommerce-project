import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const product = {
        id,
        name: "Shoes",
        price: 1200,
        description: "High quality shoes",
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

        alert("Product added to cart");
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">

            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-500"
            >
                ← Back
            </button>

            <div className="border p-6 rounded-xl shadow bg-white">

                <h1 className="text-2xl font-bold">{product.name}</h1>

                <p className="mt-2 text-gray-600">
                    {product.description}
                </p>

                <p className="mt-3 text-xl font-semibold">
                    ₹ {product.price}
                </p>

                <button
                    onClick={handleAddToCart}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    Add to Cart
                </button>

            </div>
        </div>
    );
}

export default ProductDetail;