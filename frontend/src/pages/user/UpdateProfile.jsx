import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function UpdateProfile() {

    const [form, setForm] = useState({
        name: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ================= FETCH USER =================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/api/user/profile");
                setForm({
                    name: res.data.data.name || "",
                    email: res.data.data.email || ""
                });
            } catch (err) {
                console.log(err.response?.data || err);
                alert("Failed to load profile");
            }
        };

        fetchUser();
    }, []);

    // ================= INPUT =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= UPDATE =================
    const handleUpdate = async () => {

        if (!form.name.trim()) {
            alert("Name is required");
            return;
        }

        try {
            setLoading(true);

            await API.put("/api/user/profile", {
                name: form.name
            });

            alert("Profile updated successfully");

            navigate("/profile");

        } catch (err) {
            console.log(err.response?.data || err);
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md relative">

                {/*BACK BUTTON */}
                <button
                    onClick={() => navigate("/profile")}
                    className="absolute top-4 left-4 text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Update Profile
                </h1>

                {/* NAME */}
                <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* EMAIL (READ ONLY) */}
                <input
                    type="email"
                    value={form.email}
                    disabled
                    className="border p-2 mb-4 w-full rounded bg-gray-100 cursor-not-allowed"
                />

                {/* BUTTON */}
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className={`w-full py-2 rounded text-white transition
                        ${loading
                            ? "bg-gray-400"
                            : "bg-green-600 hover:bg-green-700"}`}
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>

            </div>
        </div>
    );
}

export default UpdateProfile;