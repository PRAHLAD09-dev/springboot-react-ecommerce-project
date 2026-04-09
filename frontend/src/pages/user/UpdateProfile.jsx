import { useState } from "react";

export default function UpdateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email });
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Update Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button className="bg-blue-500 text-white p-2">
                    Update
                </button>
            </form>
        </div>
    );
}