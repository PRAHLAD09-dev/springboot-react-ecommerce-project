import { useState } from "react";

function Category() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    const handleAdd = () => {
        if (!name) {
            alert("Enter category name");
            return;
        }

        const newCategory = {
            id: Date.now(),
            name: name,
        };

        setCategories([...categories, newCategory]);
        setName("");

        console.log("CREATE API → /api/categories?name=" + name);
    };

    const handleDelete = (id) => {
        setCategories(categories.filter((c) => c.id !== id));

        console.log("DELETE API → /api/categories/" + id);
    };

    return (
        <div className="p-6 max-w-lg mx-auto">

            <h1 className="text-2xl font-bold mb-4">Category Management</h1>

            {/* ADD CATEGORY */}
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