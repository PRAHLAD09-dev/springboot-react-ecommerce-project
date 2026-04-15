import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");

    const [products] = useState([
        { id: 1, name: "Shoes", price: 1200 },
        { id: 2, name: "T-shirt", price: 500 },
        { id: 3, name: "Watch", price: 2000 },
    ]);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* HEADER */}
            <h1 className="text-3xl font-bold mb-6">Explore Products</h1>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search products..."
                className="border p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            {/* GRID */}
            {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                    No products found
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer bg-white"
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