import { useEffect, useState } from "react";
import API from "../../services/api";
import {
    User,
    Mail,
    Save
} from "lucide-react";

function UpdateProfile() {

    const [form, setForm] = useState({
        name: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await API.get("/user/profile");

                setForm({
                    name: res.data.data.name || "",
                    email: res.data.data.email || ""
                });

            }
            catch (err) {

                console.log(err);

            }

        };

        fetchUser();

    }, []);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleUpdate = async () => {

        if (!form.name.trim()) {
            alert("Name is required");
            return;
        }

        try {

            setLoading(true);

            await API.put("/user/profile", {
                name: form.name
            });

            alert("Profile updated successfully");

        }
        catch (err) {

            console.log(err);
            alert(
                err.response?.data?.message ||
                "Update failed"
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="mt-6">

            <div className="grid md:grid-cols-2 gap-5">

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Full Name
                    </label>

                    <div className="relative">

                        <User
                            size={18}
                            className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        "
                        />

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="
                        w-full
                        pl-10
                        pr-4
                        py-3
                        border
                        rounded-xl
                        focus:ring-2
                        focus:ring-blue-500
                        outline-none
                        "
                        />

                    </div>

                </div>

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Email
                    </label>

                    <div className="relative">

                        <Mail
                            size={18}
                            className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        "
                        />

                        <input
                            value={form.email}
                            disabled
                            className="
                        w-full
                        pl-10
                        pr-4
                        py-3
                        border
                        bg-gray-50
                        rounded-xl
                        "
                        />

                    </div>

                </div>

            </div>

            <div className="flex justify-end gap-3 mt-6 pt-5 border-t">

                <button
                    type="button"
                    className="
        px-5
        py-2.5
        border
        border-gray-300
        text-gray-700
        rounded-xl
        hover:bg-gray-100
        transition
        "
                >
                    Cancel
                </button>

                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="
        px-5
        py-2.5
        bg-blue-600
        hover:bg-blue-700
        text-white
        rounded-xl
        flex
        items-center
        gap-2
        transition
        disabled:bg-gray-400
        "
                >

                    <Save size={16} />

                    {
                        loading
                            ? "Updating..."
                            : "Save Changes"
                    }

                </button>

            </div>

        </div>

    );

}

export default UpdateProfile;