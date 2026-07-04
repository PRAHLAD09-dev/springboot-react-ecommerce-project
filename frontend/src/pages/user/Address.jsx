import { useEffect, useState } from "react";
import API from "../../services/api";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { Input, Select, Button, EmptyState } from "../../components/ui";
import { getAddressTypeInfo } from "../../utils/addressType";

const EMPTY_FORM = {
    addressType: "HOME",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: ""
};

function Address() {
    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onlyDigits = (name, maxLength) => (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
        setForm({ ...form, [name]: value });
    };

    const onlyLetters = (name) => (e) => {
        const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        setErrors({});
        if (!form.phoneNumber || !form.street) {
            setErrors({ form: "Please fill required fields" });
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                await API.put(`/user/address/${editingId}`, form);
            } else {
                await API.post("/user/address", form);
            }

            setForm(EMPTY_FORM);
            setEditingId(null);
            fetchAddresses();
        } catch (err) {
            console.log(err.response?.data);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        await API.delete(`/user/address/${id}`);
        fetchAddresses();
    };

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
        <div className="mt-6">
            {/* FORM */}
            <div className="card-surface mb-6 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold text-ink-900">
                    {editingId ? "Update address" : "Add new address"}
                </h2>

                {errors.form && (
                    <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{errors.form}</div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Select label="Address type" name="addressType" value={form.addressType} onChange={handleChange}>
                        <option value="HOME">Home</option>
                        <option value="OFFICE">Office</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="SHOP">Shop</option>
                        <option value="OTHER">Other</option>
                    </Select>

                    <Input
                        label="Phone number"
                        name="phoneNumber"
                        maxLength={10}
                        value={form.phoneNumber}
                        onChange={onlyDigits("phoneNumber", 10)}
                        placeholder="10-digit phone number"
                        error={errors.phoneNumber}
                    />

                    <Input
                        label="Street"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="House no, street"
                        error={errors.street}
                        className="md:col-span-2"
                    />

                    <Input
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={onlyLetters("city")}
                        placeholder="City"
                    />

                    <Input
                        label="State"
                        name="state"
                        value={form.state}
                        onChange={onlyLetters("state")}
                        placeholder="State"
                    />

                    <Input
                        label="Country"
                        name="country"
                        value={form.country}
                        onChange={onlyLetters("country")}
                        placeholder="Country"
                    />

                    <Input
                        label="Zip code"
                        name="zipCode"
                        maxLength={6}
                        value={form.zipCode}
                        onChange={onlyDigits("zipCode", 6)}
                        placeholder="Zip / postal code"
                    />
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    {editingId && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setEditingId(null);
                                setForm(EMPTY_FORM);
                            }}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button icon={Plus} loading={loading} onClick={handleSubmit}>
                        {editingId ? "Update address" : "Add address"}
                    </Button>
                </div>
            </div>

            {/* LIST */}
            {addresses.length === 0 ? (
                <EmptyState icon={MapPin} title="No addresses added" description="Add a delivery address using the form above." />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => {
                        const addressInfo = getAddressTypeInfo(addr.addressType);

                        return (
                            <div key={addr.id} className="card-surface p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${addressInfo.style}`}>
                                            <addressInfo.Icon size={16} />
                                            {addressInfo.label}
                                        </span>

                                        <p className="mt-3 text-ink-700">{addr.street}</p>
                                        <p className="text-ink-600">{addr.city}, {addr.state}</p>
                                        <p className="text-ink-500">{addr.country} - {addr.zipCode}</p>
                                        <p className="mt-2 text-ink-500">{addr.phoneNumber}</p>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <Button variant="secondary" size="sm" icon={Pencil} onClick={() => handleEdit(addr)} />
                                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(addr.id)} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Address;
