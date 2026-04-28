import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../services/api";

function Product() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        categoryId: ""
    });

    const [editId, setEditId] = useState(null);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/merchant/products");
            setProducts(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH CATEGORIES =================
    const fetchCategories = async () => {
        try {
            const res = await API.get("/api/categories");
            setCategories(res.data.data || []);
        } catch (err) {
            console.log("CATEGORY ERROR:", err.response?.data || err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= RESET FORM =================
    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            description: "",
            stock: "",
            categoryId: ""
        });
        setFile(null);
        setEditId(null);
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!form.name || !form.price || !form.categoryId) {
                alert("Fill required fields ⚠️");
                return;
            }

            const formData = new FormData();

            const productData = {
                name: form.name,
                price: Number(form.price),
                description: form.description,
                stock: Number(form.stock),
                categoryId: Number(form.categoryId)
            };

            formData.append(
                "data",
                new Blob([JSON.stringify(productData)], {
                    type: "application/json"
                })
            );

            if (file) {
                formData.append("file", file);
            }

            if (editId) {
                await axios.put(
                    `http://localhost:8080/api/merchant/products/${editId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Product updated ✅");
            } else {
                await axios.post(
                    "http://localhost:8080/api/merchant/products",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Product added ✅");
            }

            fetchProducts();
            resetForm();

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Operation failed ❌");
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await API.delete(`/api/merchant/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.log(err);
        }
    };

    // ================= EDIT =================
    const handleEdit = (p) => {
        setForm({
            name: p.name || "",
            price: p.price || "",
            description: p.description || "",
            stock: p.stock || "",
            categoryId: p.category?.id || ""
        });

        setEditId(p.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold">
                        Merchant Product Dashboard
                    </h1>
                </div>

                {/* ================= FORM ================= */}
                <div className="bg-white p-6 rounded-xl shadow mb-8">

                    <h2 className="font-semibold mb-4">
                        {editId ? "Update Product" : "Add Product"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">

                        <input
                            name="name"
                            placeholder="Product Name"
                            value={form.name}
                            onChange={handleChange}
                            className="border p-3 rounded"
                        />

                        <input
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                            className="border p-3 rounded"
                        />

                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            className="border p-3 rounded"
                        >
                            <option value="">Select Category</option>

                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={handleChange}
                            className="border p-3 rounded"
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            className="border p-3 rounded md:col-span-2"
                        />

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="border p-3 rounded md:col-span-2"
                        />

                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleSubmit}
                            className={`flex-1 py-3 text-white rounded font-semibold 
                            ${editId
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {editId ? "Update Product" : "Add Product"}
                        </button>

                        {editId && (
                            <button
                                onClick={resetForm}
                                className="px-4 py-3 bg-gray-400 text-white rounded"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </div>

                {/* ================= PRODUCTS ================= */}
                <div className="grid md:grid-cols-3 gap-6">

                    {products.length === 0 && (
                        <p className="text-center text-gray-500 col-span-full">
                            No products yet
                        </p>
                    )}

                    {products.map((p) => (
                        <div key={p.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">

                            {p.imageUrl && (
                                <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded mb-2">
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}

                            <h2 className="font-bold text-lg">{p.name}</h2>

                            <p className="text-green-600 font-bold">
                                ₹ {p.price}
                            </p>

                            <p className="text-sm text-gray-500">
                                {p.category?.name}
                            </p>

                            <p className="text-sm mt-1">
                                Stock: {p.stock}
                            </p>

                            <div className="flex gap-2 mt-4">

                                <button
                                    onClick={() => handleEdit(p)}
                                    className="flex-1 bg-blue-500 text-white py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="flex-1 bg-red-500 text-white py-1 rounded"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}

export default Product;