import { useState } from "react";

function Product() {
    const [products] = useState([
        { id: 1, name: "Laptop", price: 50000 },
        { id: 2, name: "Phone", price: 20000 },
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>

            {products.map((p) => (
                <div key={p.id} className="border p-3 mb-2 rounded">
                    <p>{p.name}</p>
                    <p>₹{p.price}</p>
                </div>
            ))}
        </div>
    );
}

export default Product;