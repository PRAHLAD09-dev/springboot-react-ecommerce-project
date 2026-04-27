import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Promotions() {

    const [data, setData] = useState({ title: "", message: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= SEND =================
    const send = async () => {

        if (!data.title || !data.message) { // FIX
            alert("Fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:8080/api/admin/promotion",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Promotion Sent ✅");

            setData({ title: "", message: "" });

        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Failed to send promotion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold">
                        Send Promotion
                    </h1>
                </div>

                {/* CARD */}
                <div className="bg-white p-6 rounded-xl shadow space-y-4">

                    {/* TITLE */}
                    <input
                        placeholder="Promotion Title"
                        value={data.title}
                        className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) =>
                            setData({ ...data, title: e.target.value })
                        }
                    />

                    {/* MESSAGE */}
                    <textarea
                        placeholder="Promotion Message"
                        value={data.message}
                        rows={5}
                        className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) =>
                            setData({ ...data, message: e.target.value })
                        }
                    />

                    {/* BUTTON */}
                    <button
                        onClick={send}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
                    >
                        {loading ? "Sending..." : "Send Promotion"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Promotions;