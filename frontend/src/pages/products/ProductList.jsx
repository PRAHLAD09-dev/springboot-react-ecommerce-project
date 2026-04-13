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
        <div className="p-6 max-w-4xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">Products</h1>

            {/* SEARCH BAR */}
            <input
                type="text"
                placeholder="Search products..."
                className="border p-2 w-full mb-4 rounded"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">

                {filteredProducts.length === 0 && (
                    <p className="text-gray-500">No products found</p>
                )}

                {filteredProducts.map((p) => (
                    <div
                        key={p.id}
                        className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
                        onClick={() => navigate('/product/${ p.id }')}
                    >
                        <h2 className="font-bold">{p.name}</h2>
                        <p>₹ {p.price}</p>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default ProductList;