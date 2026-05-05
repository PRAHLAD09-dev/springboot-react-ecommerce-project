import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function MerchantUpdate() {
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMerchant = async () => {
            try {
                const res = await API.get("/merchant/profile");

                if (res.data.success) {
                    setBusinessName(
                        res.data.data.businessName || ""
                    );
                }
            } catch (err) {
                console.log(err);
                alert("Failed to load merchant profile");
            } finally {
                setLoading(false);
            }
        };

        fetchMerchant();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await API.put("/merchant/profile", {
                businessName
            });

            alert(res.data.message);
            navigate("/merchant/profile");

        } catch (err) {
            console.log(err);
            alert("Update failed");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-md">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Update Merchant Profile
                </h1>

                <form onSubmit={handleUpdate}>
                    <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Business Name"
                        className="w-full border p-3 rounded mb-4"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MerchantUpdate;