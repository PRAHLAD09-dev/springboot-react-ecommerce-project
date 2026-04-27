import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Address() {

    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);

    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // ================= FETCH =================
    const fetchAddresses = async () => {
        try {
            const res = await API.get("/api/user/address");
            setAddresses(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // ================= INPUT =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {

        if (!form.fullName || !form.phoneNumber || !form.street) {
            alert("Please fill required fields");
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                await API.put(`/api/user/address/${editingId}`, form);
            } else {
                await API.post("/api/user/address", form);
            }

            setForm({
                fullName: "",
                phoneNumber: "",
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: ""
            });

            setEditingId(null);
            fetchAddresses();

        } catch (err) {
            console.log(err);
            alert("Failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;

        await API.delete(`/api/user/address/${id}`);
        fetchAddresses();
    };

    // ================= EDIT =================
    const handleEdit = (addr) => {
        setForm({
            fullName: addr.fullName || "",
            phoneNumber: addr.phoneNumber || "",
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            country: addr.country || "",
            zipCode: addr.zipCode || ""
        });

        setEditingId(addr.id);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/*  HEADER */}
                <div className="flex items-center justify-between mb-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl font-bold">
                        My Address
                    </h1>

                    <span className="text-sm text-gray-500">
                        {addresses.length} saved
                    </span>
                </div>

                {/* ================= FORM ================= */}
                <div className="bg-white p-6 rounded-2xl shadow mb-8">

                    <h2 className="font-semibold mb-4 text-lg">
                        {editingId ? "Update Address" : "Add New Address"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">

                        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                        <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />

                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`mt-4 w-full py-2 rounded text-white 
                        ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {loading ? "Saving..." : editingId ? "Update Address" : "Add Address"}
                    </button>

                </div>

                {/* ================= LIST ================= */}
                <div className="grid md:grid-cols-2 gap-4">

                    {addresses.length === 0 && (
                        <p className="text-gray-500">No address added</p>
                    )}

                    {addresses.map(addr => (
                        <div
                            key={addr.id}
                            className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
                        >

                            <p className="font-semibold text-lg">
                                {addr.fullName}
                            </p>

                            <p className="text-gray-600">
                                {addr.street}, {addr.city}, {addr.state}
                            </p>

                            <p className="text-gray-500 text-sm">
                                {addr.country} - {addr.zipCode}
                            </p>

                            <p className="text-gray-400 text-sm mt-1">
                                📞 {addr.phoneNumber}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex gap-2 mt-4">

                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </div >
    );
}

export default Address;