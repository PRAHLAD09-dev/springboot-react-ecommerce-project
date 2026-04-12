import { useState } from "react";

function Product() {
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
    });

    const [file, setFile] = useState(null);
    const [editId, setEditId] = useState(null);

    // 🔥 INPUT HANDLE
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 ADD / UPDATE
    const handleSubmit = () => {
        if (!form.name || !form.price) {
            alert("Name and Price required");
            return;
        }

        if (editId) {
            // UPDATE
            setProducts(
                products.map((p) =>
                    p.id === editId ? { ...p, ...form, file } : p
                )
            );
            console.log("PUT → /api/merchant/product/update/" + editId);
            setEditId(null);
        } else {
            // ADD
            const newProduct = {
                id: Date.now(),
                ...form,
                file,
            };

            setProducts([...products, newProduct]);
            console.log("POST → /api/merchant/product/add");
        }

        // RESET
        setForm({
            name: "",
            price: "",
            category: "",
            description: "",
        });
        setFile(null);
    };

    // 🔥 DELETE
    const handleDelete = (id) => {
        if (!window.confirm("Delete product?")) return;

        setProducts(products.filter((p) => p.id !== id));
        console.log("DELETE → /api/merchant/product/delete/" + id);
    };

    // 🔥 EDIT
    const handleEdit = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description,
        });
        setEditId(p.id);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">
                Merchant Product Management
            </h1>

            {/* FORM */}
            <div className="bg-white p-4 rounded shadow space-y-3 mb-6">

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    className="border p-2 w-full rounded"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="border p-2 w-full rounded"
                    value={form.price}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    className="border p-2 w-full rounded"
                    value={form.category}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    className="border p-2 w-full rounded"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    type="file"
                    className="border p-2 w-full rounded"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                    onClick={handleSubmit}
                    className={`w-full py-2 text-white rounded ${editId ? "bg-blue-500" : "bg-green-500"
                        }`}
                >
                    {editId ? "Update Product" : "Add Product"}
                </button>
            </div>

            {/* PRODUCT LIST */}
            <div className="space-y-3">

                {products.length === 0 && (
                    <p className="text-gray-500 text-center">
                        No products yet
                    </p>
                )}

                {products.map((p) => (
                    <div
                        key={p.id}
                        className="border p-4 rounded shadow-sm bg-white"
                    >
                        <h2 className="font-bold text-lg">{p.name}</h2>
                        <p className="text-green-600 font-semibold">
                            ₹ {p.price}
                        </p>
                        <p className="text-sm text-gray-600">
                            Category: {p.category}
                        </p>
                        <p className="text-sm">{p.description}</p>

                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={() => handleEdit(p)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Product;