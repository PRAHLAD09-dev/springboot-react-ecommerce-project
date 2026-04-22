import { useState, useEffect } from "react";
import API from "../../services/api";

function UpdateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/api/user/profile");
                setName(res.data.data.name);
                setEmail(res.data.data.email);
            } catch (err) {
                console.log(err);
                alert("Profile load failed");
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        if (!name || !email) {
            alert("All fields required");
            return;
        }

        try {
            await API.put("/api/user/profile", { name, email });
            alert("Profile updated successfully");
        } catch (err) {
            console.log(err);
            alert("Update failed");
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white p-6 shadow rounded w-80">

                <h2 className="text-xl font-bold mb-4">Update Profile</h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 mb-3 w-full"
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 mb-3 w-full"
                />

                <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white w-full py-2"
                >
                    Update
                </button>

            </div>
        </div>
    );
}

export default UpdateProfile;