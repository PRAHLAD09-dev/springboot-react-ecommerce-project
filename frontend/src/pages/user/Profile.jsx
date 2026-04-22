import { useEffect, useState } from "react";
import API from "../../services/api";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/api/user/profile");

                console.log("PROFILE ", res.data);

                setUser(res.data.data);
            } catch (err) {
                console.log(err.response?.data || err);

                if (err.response?.status === 401) {
                    alert("Session expired, login again");
                    localStorage.clear();
                    window.location.href = "/login";
                } else {
                    alert("Profile load failed ");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!user) {
        return <p className="text-center mt-10">No user data found</p>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">
                My Profile
            </h1>

            <div className="space-y-2">
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
            </div>
        </div>
    );
}

export default Profile;