import { useEffect, useState } from "react";
import axios from "axios";

function Users() {

    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(res.data);
            setUsers(res.data.data);

        } catch (err) {
            console.log(err);
            alert("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>

            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                users.map((u) => (
                    <div key={u.id} className="border p-3 mb-2 rounded shadow-sm">

                        <p className="font-semibold">{u.name || "No Name"}</p>
                        <p className="text-gray-500">{u.email}</p>

                    </div>
                ))
            )}
        </div>
    );
}

export default Users;