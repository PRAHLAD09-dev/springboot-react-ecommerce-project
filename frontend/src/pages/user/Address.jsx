import { useState, useEffect } from "react";

function Address() {
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState({
        id: null,
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // 🔥 LOAD
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("addresses")) || [];
        setAddresses(data);
    }, []);

    // 🔥 SAVE
    const saveData = (data) => {
        setAddresses(data);
        localStorage.setItem("addresses", JSON.stringify(data));
    };

    // 🔥 HANDLE CHANGE
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 ADD / UPDATE
    const handleSubmit = () => {
        if (!form.street || !form.city || !form.state || !form.zip) {
            alert("All fields required");
            return;
        }

        if (isEditing) {
            // UPDATE
            const updated = addresses.map((addr) =>
                addr.id === form.id ? form : addr
            );
            saveData(updated);
            alert("Address updated");
        } else {
            // ADD
            const newAddress = {
                ...form,
                id: Date.now(),
            };
            saveData([...addresses, newAddress]);
            alert("Address added");
        }

        // RESET
        setForm({
            id: null,
            street: "",
            city: "",
            state: "",
            zip: "",
        });
        setIsEditing(false);
    };

    // 🔥 DELETE
    const handleDelete = (id) => {
        if (!window.confirm("Delete address?")) return;

        const updated = addresses.filter((addr) => addr.id !== id);
        saveData(updated);
    };

    // 🔥 EDIT
    const handleEdit = (addr) => {
        setForm(addr);
        setIsEditing(true);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">My Addresses</h1>

            {/* FORM */}
            <div className="border p-4 rounded mb-6 bg-white shadow">
                <input
                    name="street"
                    placeholder="Street"
                    value={form.street}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2"
                />

                <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2"
                />

                <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2"
                />

                <input
                    name="zip"
                    placeholder="ZIP Code"
                    value={form.zip}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3"
                />

                <button
                    onClick={handleSubmit}
                    className={`w-full text-white py-2 rounded ${isEditing ? "bg-blue-500" : "bg-green-500"
                        }`}
                >
                    {isEditing ? "Update Address" : "Add Address"}
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-3">
                {addresses.length === 0 && (
                    <p className="text-gray-500 text-center">
                        No addresses found
                    </p>
                )}

                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="border p-3 rounded bg-white shadow flex justify-between"
                    >
                        <div>
                            <p>{addr.street}</p>
                            <p>
                                {addr.city}, {addr.state} - {addr.zip}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(addr)}
                                className="bg-yellow-500 text-white px-2 py-1"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(addr.id)}
                                className="bg-red-500 text-white px-2 py-1"
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

export default Address;