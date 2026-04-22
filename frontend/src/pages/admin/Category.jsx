import { useEffect, useState } from "react";
import axios from "axios";

function Category() {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    const token = localStorage.getItem("token");

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

            setCategories(res.data.data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!name) {
            alert("Enter category name");
            return;
        }

        try {
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
            fetchCategories(); // refresh

        } catch (err) {
            console.log(err);
            alert("Failed to add category");
        }
    };

    const handleDelete = async (id) => {
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
        <div className="p-6 max-w-lg mx-auto">

            <h1 className="text-2xl font-bold mb-4">Category Management</h1>

            {/* ADD */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter category"
                    className="border p-2 flex-1 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white px-4 rounded"
                >
                    Add
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-2">
                {categories.length === 0 && (
                    <p className="text-gray-500 text-center">No categories yet</p>
                )}

                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="flex justify-between items-center border p-3 rounded"
                    >
                        <span>{c.name}</span>

                        <button
                            onClick={() => handleDelete(c.id)}
                            className="bg-red-500 text-white px-3 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Category;