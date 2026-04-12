import { useState } from "react";

function UpdateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleUpdate = () => {
        alert("Profile Updated (dummy)");
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white p-6 shadow rounded w-80">
                <h2 className="text-xl font-bold mb-4">Update Profile</h2>

                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 mb-3 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 mb-3 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white w-full py-2 rounded"
                >
                    Update
                </button>
            </div>
        </div>
    );
}

export default UpdateProfile;