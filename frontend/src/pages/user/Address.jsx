import { useEffect, useState } from "react";
import API from "../../services/api";

function Address() {
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState({
        street: "",
        city: "",
        state: "",
        zip: ""
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const res = await API.get("/api/addresses");
        setAddresses(res.data.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.street || !form.city || !form.state || !form.zip) {
            alert("All fields required");
            return;
        }

        try {
            if (editId) {
                // UPDATE
                await API.put(`/api/addresses/${editId}`, form);
                alert("Updated ");
            } else {
                // ADD
                await API.post("/api/addresses", form);
                alert("Added ");
            }

            setForm({ street: "", city: "", state: "", zip: "" });
            setEditId(null);
            fetchAddresses();

        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (addr) => {
        setForm(addr);
        setEditId(addr.id);
    };

    const handleDelete = async (id) => {
        await API.delete(`/api/addresses/${id}`);
        fetchAddresses();
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">My Addresses</h1>

            {/*  FORM */}
            <div className="bg-white p-4 shadow mb-6 rounded">
                <input name="street" placeholder="Street" value={form.street} onChange={handleChange} className="border p-2 mb-2 w-full" />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 mb-2 w-full" />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="border p-2 mb-2 w-full" />
                <input name="zip" placeholder="Zip" value={form.zip} onChange={handleChange} className="border p-2 mb-3 w-full" />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white w-full py-2 rounded"
                >
                    {editId ? "Update Address" : "Add Address"}
                </button>
            </div>

            {/*  LIST */}
            {addresses.map((addr) => (
                <div key={addr.id} className="border p-3 mb-2 rounded flex justify-between">
                    <div>
                        {addr.street}, {addr.city}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(addr)} className="bg-yellow-500 px-2 text-white">Edit</button>
                        <button onClick={() => handleDelete(addr.id)} className="bg-red-500 px-2 text-white">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Address;