import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Users() {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= FETCH =================
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

            setUsers(res.data.data || []);

        } catch (err) {
            console.log(err);
            alert("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
                        Users Management
                    </h1>
                </div>

                {/* EMPTY */}
                {users.length === 0 && (
                    <p className="text-gray-500">No users found</p>
                )}

                {/* TABLE */}
                {users.length > 0 && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        {/* HEADER ROW */}
                        <div className="grid grid-cols-3 bg-gray-200 p-3 font-semibold text-sm">
                            <span>User</span>
                            <span>Email</span>
                            <span>Role</span>
                        </div>

                        {/* DATA */}
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className="grid grid-cols-3 items-center p-4 border-b hover:bg-gray-50"
                            >

                                {/* USER */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                        {u.name ? u.name[0].toUpperCase() : "U"}
                                    </div>

                                    <span className="font-medium">
                                        {u.name || "No Name"}
                                    </span>
                                </div>

                                {/* EMAIL */}
                                <span className="text-gray-600">
                                    {u.email}
                                </span>

                                {/* ROLE */}
                                <span className={`px-3 py-1 rounded text-xs font-semibold w-fit
                                    ${u.role === "ADMIN"
                                        ? "bg-red-100 text-red-600"
                                        : u.role === "MERCHANT"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-blue-100 text-blue-600"}`}
                                >
                                    {u.role}
                                </span>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Users;