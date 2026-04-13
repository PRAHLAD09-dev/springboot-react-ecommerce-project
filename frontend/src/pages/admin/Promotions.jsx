import { useState } from "react";

function Promotions() {
    const [data, setData] = useState({ title: "", message: "" });

    const send = () => {
        if (!data.title || !data.message) {
            alert("Fill all fields");
            return;
        }

        console.log("POST /api/admin/promotion", data);
        alert("Promotion Sent");
    };

    return (
        <div className="p-6 max-w-md">
            <h1 className="text-xl font-bold mb-4">Send Promotion</h1>

            <input
                placeholder="Title"
                className="border p-2 w-full mb-2"
                onChange={(e) => setData({ ...data, title: e.target.value })}
            />

            <textarea
                placeholder="Message"
                className="border p-2 w-full mb-2"
                onChange={(e) => setData({ ...data, message: e.target.value })}
            />

            <button onClick={send} className="bg-blue-500 text-white px-4 py-2">
                Send
            </button>
        </div>
    );
}

export default Promotions;