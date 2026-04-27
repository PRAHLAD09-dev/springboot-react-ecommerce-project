import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Category() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= FETCH =================
    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/categories",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCategories(res.data.data || []);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ================= ADD =================
    const handleAdd = async () => {

        if (!name.trim()) {
            alert("Enter category name");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `http://localhost:8080/api/categories?name=${name}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setName("");
            fetchCategories();

        } catch (err) {
            console.log(err);
            alert("Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            await axios.delete(
                `http://localhost:8080/api/categories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchCategories();

        } catch (err) {
            console.log(err);
            alert("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-2xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold">
                        Category Management
                    </h1>
                </div>

                {/* ADD CARD */}
                <div className="bg-white p-5 rounded-xl shadow mb-6">

                    <div className="flex gap-3">

                        <input
                            type="text"
                            placeholder="Enter category name"
                            className="border p-3 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 rounded"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>

                    </div>

                </div>

                {/* LIST */}
                <div className="space-y-3">

                    {categories.length === 0 && (
                        <p className="text-gray-500 text-center">
                            No categories yet
                        </p>
                    )}

                    {categories.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md"
                        >
                            <span className="font-medium">
                                {c.name}
                            </span>

                            <button
                                onClick={() => handleDelete(c.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                            >
                                Delete
                            </button>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default Category;