import { useEffect, useState } from "react";
import API from "../../services/api";
import {
    Home,
    Building2,
    Building,
    Store,
    MapPin
} from "lucide-react";

function Address() {

    const [addresses, setAddresses] = useState([]);

    const [form, setForm] = useState({
        addressType: "HOME",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // ================= FETCH =================
    const fetchAddresses = async () => {
        try {
            const res = await API.get("/user/address");
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

        if (!form.phoneNumber || !form.street) {
            alert("Please fill required fields");
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                await API.put(`/user/address/${editingId}`, form);
            } else {
                await API.post("/user/address", form);
            }

            setForm({
                addressType: "HOME",
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

            console.log(err.response?.data);

            if (err.response?.data?.errors) {

                setErrors(
                    err.response.data.errors
                );

            }

        }
    };


    const getAddressType = (type) => {

        switch (type) {

            case "HOME":
                return {
                    icon: <Home size={16} />,
                    label: "Home",
                    style: "bg-green-100 text-green-700"
                };

            case "OFFICE":
                return {
                    icon: <Building2 size={16} />,
                    label: "Office",
                    style: "bg-blue-100 text-blue-700"
                };

            case "APARTMENT":
                return {
                    icon: <Building size={16} />,
                    label: "Apartment",
                    style: "bg-purple-100 text-purple-700"
                };

            case "SHOP":
                return {
                    icon: <Store size={16} />,
                    label: "Shop",
                    style: "bg-orange-100 text-orange-700"
                };

            default:
                return {
                    icon: <MapPin size={16} />,
                    label: "Other",
                    style: "bg-gray-100 text-gray-700"
                };
        }

    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;

        await API.delete(`/user/address/${id}`);
        fetchAddresses();
    };

    // ================= EDIT =================
    const handleEdit = (addr) => {

        setForm({
            addressType: addr.addressType || "HOME",
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



            {/* ================= FORM ================= */}
            <div className="bg-white border rounded-2xl p-6 mb-6">

                <h2 className="font-semibold mb-4 text-lg">
                    {editingId ? "Update Address" : "Add New Address"}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    <select
                        name="addressType"
                        value={form.addressType}
                        onChange={handleChange}
                        className="
                                border
                                p-3
                                rounded-xl
                                focus:ring-2
                                focus:ring-blue-500
                                outline-none
                                "
                    >
                        <option value="HOME">Home</option>
                        <option value="OFFICE">Office</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="SHOP">Shop</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input
                        name="phoneNumber"
                        maxLength={10}
                        value={form.phoneNumber}
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(/\D/g, "");

                            setForm({
                                ...form,
                                phoneNumber: value
                            });

                        }}
                        placeholder="Phone Number"
                        className="
                                w-full
                                border
                                border-gray-300
                                rounded-xl
                                px-4
                                py-3
                                focus:ring-2
                                focus:ring-blue-500
                                focus:border-blue-500
                                outline-none
                                "
                    />
                    <input name="street" value={form.street} onChange={handleChange} placeholder="Street"
                        className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        px-4
                        py-3
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        " />

                    <input
                        name="city"
                        value={form.city}
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(
                                    /[^a-zA-Z ]/g,
                                    ""
                                );

                            setForm({
                                ...form,
                                city: value
                            });

                        }}
                        placeholder="City"
                        className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        px-4
                        py-3
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        "
                    />
                    <input
                        name="state"
                        value={form.state}
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(
                                    /[^a-zA-Z ]/g,
                                    ""
                                );

                            setForm({
                                ...form,
                                state: value
                            });

                        }}
                        placeholder="State"
                        className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        px-4
                        py-3
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        "
                    />

                    <input
                        name="country"
                        value={form.country}
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(
                                    /[^a-zA-Z ]/g,
                                    ""
                                );

                            setForm({
                                ...form,
                                country: value
                            });

                        }}
                        placeholder="Country"
                        className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        px-4
                        py-3
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        "
                    />

                    <input
                        name="zipCode"
                        maxLength={6}
                        value={form.zipCode}
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(/\D/g, "");

                            setForm({
                                ...form,
                                zipCode: value
                            });

                        }}
                        placeholder="Zip Code"
                        className="
                        w-full
                        border
                        border-gray-300
                        rounded-xl
                        px-4
                        py-3
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        "
                    />

                </div>

                <div className="flex justify-end gap-3 mt-5">

                    {
                        editingId && (

                            <button
                                onClick={() => {
                                    setEditingId(null);

                                    setForm({
                                        addressType: "HOME",
                                        phoneNumber: "",
                                        street: "",
                                        city: "",
                                        state: "",
                                        country: "",
                                        zipCode: ""
                                    });
                                }}
                                className="
                px-4
                py-2
                border
                rounded-xl
                "
                            >
                                Cancel
                            </button>

                        )
                    }

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
        px-5
        py-2
        bg-blue-600
        text-white
        rounded-xl
        "
                    >
                        {
                            loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Address"
                                    : "Add Address"
                        }
                    </button>

                </div>

            </div>

            {/* ================= LIST ================= */}
            <div className="grid md:grid-cols-2 gap-4">

                {addresses.length === 0 && (
                    <p className="text-gray-500">
                        No address added
                    </p>
                )}

                {addresses.map((addr) => {

                    const addressInfo =
                        getAddressType(
                            addr.addressType
                        );

                    return (

                        <div
                            key={addr.id}
                            className="
                bg-white
                border
                rounded-2xl
                p-5
                "
                        >

                            <div className="flex justify-between items-start">

                                <div>

                                    <span
                                        className={`
                            flex
                            items-center
                            gap-2
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            w-fit
                            ${addressInfo.style}
                            `}
                                    >

                                        {addressInfo.icon}

                                        {addressInfo.label}

                                    </span>

                                    <p className="mt-3 text-gray-700">
                                        {addr.street}
                                    </p>

                                    <p className="text-gray-600">
                                        {addr.city}, {addr.state}
                                    </p>

                                    <p className="text-gray-500">
                                        {addr.country} - {addr.zipCode}
                                    </p>

                                    <p className="text-gray-500 mt-2">
                                        {addr.phoneNumber}
                                    </p>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            handleEdit(addr)
                                        }
                                        className="
                            px-4
                            py-2
                            bg-yellow-500
                            text-white
                            rounded-xl
                            "
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(addr.id)
                                        }
                                        className="
                            px-4
                            py-2
                            bg-red-500
                            text-white
                            rounded-xl
                            "
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default Address;
