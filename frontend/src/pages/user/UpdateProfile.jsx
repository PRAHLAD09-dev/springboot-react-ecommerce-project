import { useEffect, useState } from "react";
import API from "../../services/api";
import { User, Mail, Save, CheckCircle2 } from "lucide-react";
import { Input, Button } from "../../components/ui";

function UpdateProfile() {
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/user/profile");
                setForm({
                    name: res.data.data.name || "",
                    email: res.data.data.email || ""
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        setError("");
        setSuccess("");
        if (!form.name.trim()) {
            setError("Name is required");
            return;
        }

        try {
            setLoading(true);
            await API.put("/user/profile", { name: form.name });
            setSuccess("Profile updated successfully");
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            {error && (
                <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</div>
            )}
            {success && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">
                    <CheckCircle2 size={16} /> {success}
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
                <Input
                    label="Full name"
                    name="name"
                    icon={User}
                    value={form.name}
                    onChange={handleChange}
                />

                <Input
                    label="Email"
                    icon={Mail}
                    value={form.email}
                    disabled
                    helper="Email cannot be changed"
                />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-ink-100 pt-5">
                <Button variant="secondary" type="button">Cancel</Button>
                <Button icon={Save} onClick={handleUpdate} loading={loading}>
                    Save changes
                </Button>
            </div>
        </div>
    );
}

export default UpdateProfile;
