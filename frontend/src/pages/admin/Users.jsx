import { useEffect, useState } from "react";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers([
            { id: 1, name: "Prahlad", email: "prahlad@gmail.com" },
            { id: 2, name: "User2", email: "user2@gmail.com" },
        ]);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Users</h1>

            {users.map((u) => (
                <div key={u.id} className="border p-3 mb-2 rounded">
                    <p>{u.name}</p>
                    <p className="text-gray-500">{u.email}</p>
                </div>
            ))}
        </div>
    );
}

export default Users;