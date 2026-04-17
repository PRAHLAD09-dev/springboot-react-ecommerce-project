import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/products/${id}`)
            .then((res) => {
                setProduct(res.data.data);
            })
            .catch((err) => {
                console.log(err);
                alert("Failed to load product");
            });
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Login first");
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/cart/add",
                null,
                {
                    params: {
                        productId: product.id,
                        quantity: 1,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Added to cart");

        } catch (err) {
            console.log(err);
            alert("Failed to add to cart");
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Login first");
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/cart/add",
                null,
                {
                    params: {
                        productId: product.id,
                        quantity: 1,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const res = await axios.post(
                "http://localhost:8080/api/user/orders/place",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const orderId = res.data.data.id;

            navigate(`/payment?orderId=${orderId}`);

        } catch (err) {
            console.log(err);
            alert("Buy now failed");
        }
    };

    if (!product) {
        return <p className="text-center mt-10">Loading...</p>;
    }

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