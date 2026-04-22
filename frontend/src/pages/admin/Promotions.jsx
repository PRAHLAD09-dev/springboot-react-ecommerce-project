import { useState } from "react";
import axios from "axios";

function Promotions() {
    const [data, setData] = useState({ title: "", message: "" });

    const token = localStorage.getItem("token");

    const send = async () => {
        if (!data.title || !data.message) {
            alert("Fill all fields");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/api/admin/promotion",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data);

            alert("Promotion Sent ");

            setData({ title: "", message: "" });

        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Failed to send promotion ❌");
        }
    };

    return (
        <div className="p-6 max-w-md">

            <h1 className="text-xl font-bold mb-4">
                Send Promotion
            </h1>

            <input
                placeholder="Title"
                value={data.title}
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setData({ ...data, title: e.target.value })
                }
            />

            <textarea
                placeholder="Message"
                value={data.message}
                className="border p-2 w-full mb-2"
                onChange={(e) =>
                    setData({ ...data, message: e.target.value })
                }
            />

            <button
                onClick={send}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Send
            </button>

        </div>
    );
}

export default Promotions;