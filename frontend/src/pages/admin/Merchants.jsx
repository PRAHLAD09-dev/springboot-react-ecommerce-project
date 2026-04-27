import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Merchants() {

    const [merchants, setMerchants] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= FETCH =================
    const fetchMerchants = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/admin/merchants",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMerchants(res.data.data || []);

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Failed to load merchants");
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, []);

    // ================= ACTIONS =================
    const approve = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/approve/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchMerchants();
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

    const block = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/block/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchMerchants();
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

    const unblock = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/unblock/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchMerchants();
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

    // ================= STATUS =================
    const getStatus = (m) => {
        if (!m.approved) return "PENDING";
        if (m.approved && m.active) return "APPROVED";
        if (m.approved && !m.active) return "BLOCKED";
        return "UNKNOWN";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "bg-yellow-500";
            case "APPROVED": return "bg-green-600";
            case "BLOCKED": return "bg-red-500";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <h1 className="text-3xl font-bold">
                        Merchants Management
                    </h1>
                </div>

                {/* EMPTY */}
                {merchants.length === 0 && (
                    <p className="text-gray-500">No merchants found</p>
                )}

                {/* LIST */}
                <div className="grid md:grid-cols-2 gap-6">

                    {merchants.map((m) => {
                        const status = getStatus(m);

                        return (
                            <div
                                key={m.id}
                                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                            >

                                {/* TOP */}
                                <div className="flex justify-between items-center mb-3">

                                    <div>
                                        <p className="font-semibold">
                                            {m.businessName || "No Business"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {m.email}
                                        </p>
                                    </div>

                                    <span className={`text-white px-3 py-1 rounded text-xs ${getStatusColor(status)}`}>
                                        {status}
                                    </span>

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2 mt-4">

                                    {status === "PENDING" && (
                                        <button
                                            onClick={() => approve(m.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded"
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {status === "APPROVED" && (
                                        <button
                                            onClick={() => block(m.id)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                                        >
                                            Block
                                        </button>
                                    )}

                                    {status === "BLOCKED" && (
                                        <button
                                            onClick={() => unblock(m.id)}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded"
                                        >
                                            Unblock
                                        </button>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default Merchants;