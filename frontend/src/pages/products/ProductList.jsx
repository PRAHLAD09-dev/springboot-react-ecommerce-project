import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProductList() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/products")
            .then((res) => {
                console.log(res.data);
                setProducts(res.data.data.content);
            })
            .catch((err) => console.log(err));
    }, []);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">

            <h1 className="text-3xl font-bold mb-6">Explore Products</h1>

            <input
                type="text"
                placeholder="Search products..."
                className="border p-3 w-full mb-6 rounded-lg"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                    No products found
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="border rounded-xl p-5 shadow hover:shadow-lg cursor-pointer"

                            onClick={() => navigate('/product/${p.id}')}
                        >
                            <h2 className="font-semibold text-lg">{p.name}</h2>

                            <p className="text-green-600 font-bold mt-2">
                                ₹ {p.price}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Click to view details →
                            </p>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default ProductList;