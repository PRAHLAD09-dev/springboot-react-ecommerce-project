import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= FETCH PRODUCT =================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/products/${id}`
                );
                setProduct(res.data.data);
            } catch (err) {
                console.log(err);
                alert("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // ================= ADD TO CART =================
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

    // ================= BUY NOW =================
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

            const orderId = res.data.data.orderId;

            navigate(`/payment/${orderId}`);

        } catch (err) {
            console.log(err);
            alert("Buy now failed");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                {/* CARD */}
                <div className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-6">

                    {/* IMAGE */}
                    <div>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-80 object-cover rounded-xl"
                        />
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col justify-between">

                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {product.name}
                            </h1>

                            <p className="text-gray-600 mb-4">
                                {product.description}
                            </p>

                            <p className="text-2xl font-semibold text-green-600">
                                ₹ {product.price}
                            </p>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-4 mt-6">

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
                            >
                                Buy Now
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProductDetail;