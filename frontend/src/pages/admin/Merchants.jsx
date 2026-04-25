import { useEffect, useState } from "react";
import axios from "axios";

function Merchants() {

    const [merchants, setMerchants] = useState([]);

    const token = localStorage.getItem("token");

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

    const getStatus = (m) => {
        if (!m.approved) return "PENDING";
        if (m.approved && m.active) return "APPROVED";
        if (m.approved && !m.active) return "BLOCKED";
        return "UNKNOWN";
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Merchants</h1>

            {merchants.length === 0 ? (
                <p>No merchants found</p>
            ) : (
                merchants.map(m => {
                    const status = getStatus(m);

                    return (
                        <div key={m.id} className="border p-3 mb-2 flex justify-between items-center">
                            <span>
                                {m.email} ({status})
                            </span>

                            <div className="flex gap-2">

                                {status === "PENDING" && (
                                    <button
                                        onClick={() => approve(m.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Approve
                                    </button>
                                )}

                                {status === "APPROVED" && (
                                    <button
                                        onClick={() => block(m.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Block
                                    </button>
                                )}

                                {status === "BLOCKED" && (
                                    <button
                                        onClick={() => unblock(m.id)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Unblock
                                    </button>
                                )}

                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Merchants;