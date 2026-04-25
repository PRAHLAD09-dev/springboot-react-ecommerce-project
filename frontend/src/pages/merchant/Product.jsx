import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function Product() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        stock: 1
    });

    const [file, setFile] = useState(null);
    const [editId, setEditId] = useState(null);

    // =========================
    // 🔥 LOAD MY PRODUCTS
    // =========================
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/merchant/products");
            setProducts(res.data.data);
        } catch (err) {
            console.log(err);

            if (err.response?.status === 403) {
                alert("You are not a merchant");
                navigate("/profile");
            }
        }
    };

    // =========================
    // INPUT
    // =========================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =========================
    // ADD / UPDATE
    // =========================
    const handleSubmit = async () => {

        if (!form.name || !form.price) {
            alert("Name & price required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("price", form.price);
            formData.append("categoryId", form.categoryId);
            formData.append("description", form.description);
            formData.append("stock", form.stock);

            if (file) {
                formData.append("image", file);
            }

            if (editId) {
                await API.put(`/api/merchant/product/${editId}`, formData);
                alert("Product updated");
            } else {
                await API.post("/api/merchant/product", formData);
                alert("Product added");
            }

            fetchProducts();

            setForm({
                name: "",
                price: "",
                categoryId: "",
                description: "",
                stock: 1
            });

            setFile(null);
            setEditId(null);

        } catch (err) {
            console.log(err);
            alert("Error saving product");
        }
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {

        if (!window.confirm("Delete product?")) return;

        try {
            await API.delete(`/api/merchant/product/${id}`);
            fetchProducts();
        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            categoryId: p.categoryId || "",
            description: p.description,
            stock: p.stock || 1
        });

        setEditId(p.id);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">
                Merchant Product Dashboard
            </h1>

            {/* FORM */}
            <div className="bg-white p-4 rounded shadow space-y-3 mb-6">

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="categoryId"
                    placeholder="Category ID"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 w-full rounded"
                />

                <button
                    onClick={handleSubmit}
                    className={`w-full py-2 text-white rounded ${editId ? "bg-blue-500" : "bg-green-500"
                        }`}
                >
                    {editId ? "Update Product" : "Add Product"}
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-3">

                {products.length === 0 && (
                    <p className="text-center text-gray-500">
                        No products yet
                    </p>
                )}

                {products.map((p) => (
                    <div key={p.id} className="border p-4 rounded shadow">

                        <h2 className="font-bold">{p.name}</h2>
                        <p>₹ {p.price}</p>
                        <p>{p.description}</p>

                        <div className="flex gap-2 mt-2">

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