import { useState } from "react";

function Merchants() {
    const [merchants, setMerchants] = useState([
        { id: 1, email: "m1@gmail.com", status: "PENDING" },
        { id: 2, email: "m2@gmail.com", status: "APPROVED" },
    ]);

    const approve = (id) => {
        setMerchants(merchants.map(m => m.id === id ? { ...m, status: "APPROVED" } : m));
        console.log(`PUT /api/admin/approve/${id}`);
    };

    const block = (id) => {
        setMerchants(merchants.map(m => m.id === id ? { ...m, status: "BLOCKED" } : m));
        console.log(`PUT /api/admin/block/${id}`);
    };

    const unblock = (id) => {
        setMerchants(merchants.map(m => m.id === id ? { ...m, status: "APPROVED" } : m));
        console.log(`PUT /api/admin/unblock/${id}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Merchants</h1>

            {merchants.map(m => (
                <div key={m.id} className="border p-3 mb-2 flex justify-between">
                    <span>{m.email} ({m.status})</span>

                    <div className="flex gap-2">
                        {m.status === "PENDING" && (
                            <button onClick={() => approve(m.id)} className="bg-green-500 text-white px-2">Approve</button>
                        )}

                        {m.status === "APPROVED" && (
                            <button onClick={() => block(m.id)} className="bg-red-500 text-white px-2">Block</button>
                        )}

                        {m.status === "BLOCKED" && (
                            <button onClick={() => unblock(m.id)} className="bg-yellow-500 text-white px-2">Unblock</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Merchants;