import { useState } from "react";

function Merchants() {
    const [merchants, setMerchants] = useState([
        { id: 1, name: "Shop1", status: "Pending" },
        { id: 2, name: "Shop2", status: "Approved" },
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Merchants</h1>

            {merchants.map((m) => (
                <div key={m.id} className="border p-3 mb-2 rounded">
                    <p>{m.name}</p>
                    <p>Status: {m.status}</p>
                </div>
            ))}
        </div>
    );
}

export default Merchants;