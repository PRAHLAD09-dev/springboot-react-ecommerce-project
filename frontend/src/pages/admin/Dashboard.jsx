import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { LogOut, UserPlus } from "lucide-react";

function Dashboard() {

    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        merchants: 0
    });

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);

    const [banners, setBanners] = useState([]);

    const [banner, setBanner] = useState({
        productId: "",
        position: ""
    });

    const [image, setImage] = useState(null);

    useEffect(() => {

        fetchDashboard();
        fetchProducts();
        fetchBanners();

    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await API.get(
                "/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(res.data.data || {
                users: 0,
                orders: 0,
                merchants: 0
            });

        } catch (err) {
            console.log(err);
            alert("Dashboard load failed ");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {

        try {

            const res =
                await API.get("/products");

            setProducts(
                res.data.data.content || []
            );

        }
        catch (err) {

            console.log(err);

        }

    };

    const fetchBanners = async () => {

        try {

            const res =
                await API.get(
                    "/admin/hero-banners",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setBanners(
                res.data.data || []
            );

        }
        catch (err) {

            console.log(err);

        }

    };

    const createBanner = async () => {

        if (
            !banner.productId ||
            !banner.position ||
            !image
        ) {

            alert("Fill all fields");
            return;

        }

        try {

            const formData =
                new FormData();

            formData.append(
                "productId",
                banner.productId
            );

            formData.append(
                "position",
                banner.position
            );

            formData.append(
                "image",
                image
            );

            await API.post(
                "/admin/hero-banners",
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            alert(
                "Draft Banner Created"
            );

            setBanner({
                productId: "",
                position: ""
            });

            setImage(null);

            fetchBanners();

        }
        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Failed to create banner"
            );

        }

    };

    const publishBanner = async (
        bannerId
    ) => {

        try {

            await API.put(
                `/admin/hero-banners/${bannerId}/publish`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            fetchBanners();

        }
        catch (err) {

            console.log(err);

        }

    };

    const deleteBanner = async (id) => {

        try {

            await API.delete(
                `/admin/hero-banners/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            fetchBanners();

        }
        catch (err) {

            console.log(err);

        }

    };

    // ================= LOGOUT =================
    const handleLogout = async () => {
        try {

        } catch (err) {
            console.log("Logout API failed (ignore)");
        }
        finally {

            localStorage.clear();

            window.dispatchEvent(
                new Event("authChanged")
            );

            navigate("/login");

        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading Dashboard...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h1 className="text-3xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-gray-600">
                            Overview of your platform
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => navigate("/signup")}
                            className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        px-5
                                        py-3
                                        rounded-xl
                                        "
                        >

                            <UserPlus size={18} />

                            Add Account

                        </button>

                        <button
                            onClick={handleLogout}
                            className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        px-5
                                        py-3
                                        rounded-xl
                                        "
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                </div>
                {/* CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    {/* USERS */}
                    <div
                        onClick={() => navigate("/admin/users")}
                        className="bg-white p-6 rounded-xl shadow cursor-pointer 
                        hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        <h2 className="text-gray-500 text-sm">
                            Total Users
                        </h2>

                        <p className="text-3xl font-bold mt-2 text-blue-600">
                            {stats.users}
                        </p>
                    </div>

                    {/* ORDERS */}
                    <div
                        onClick={() => navigate("/admin/orders")}
                        className="bg-white p-6 rounded-xl shadow cursor-pointer 
                        hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        <h2 className="text-gray-500 text-sm">
                            Total Orders
                        </h2>

                        <p className="text-3xl font-bold mt-2 text-green-600">
                            {stats.orders}
                        </p>
                    </div>

                    {/* MERCHANTS */}
                    <div
                        onClick={() => navigate("/admin/merchants")}
                        className="bg-white p-6 rounded-xl shadow cursor-pointer 
                        hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        <h2 className="text-gray-500 text-sm">
                            Merchants
                        </h2>

                        <p className="text-3xl font-bold mt-2 text-purple-600">
                            {stats.merchants}
                        </p>
                    </div>

                </div>

                <div className="bg-white p-6 rounded-2xl shadow mt-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Hero Banner Management
                    </h2>

                    <div className="grid lg:grid-cols-4 gap-4 items-center">

                        <input
                            type="file"
                            accept="image/*"
                            className="border p-3 rounded-lg"
                            onChange={(e) =>
                                setImage(
                                    e.target.files[0]
                                )
                            }
                        />

                        <select
                            value={banner.productId}
                            className="border p-3 rounded-lg"
                            onChange={(e) =>
                                setBanner({
                                    ...banner,
                                    productId: e.target.value
                                })
                            }
                        >

                            <option value="">
                                Select Product
                            </option>

                            {products.map((p) => (

                                <option
                                    key={p.id}
                                    value={p.id}
                                >
                                    {p.name}
                                </option>

                            ))}

                        </select>

                        <select
                            value={banner.position}
                            className="border p-3 rounded-lg"
                            onChange={(e) =>
                                setBanner({
                                    ...banner,
                                    position:
                                        Number(
                                            e.target.value
                                        )
                                })
                            }
                        >

                            <option value="">
                                Select Position
                            </option>

                            <option value="1">
                                Position 1
                            </option>

                            <option value="2">
                                Position 2
                            </option>

                            <option value="3">
                                Position 3
                            </option>

                            <option value="4">
                                Position 4
                            </option>

                            <option value="5">
                                Position 5
                            </option>

                        </select>

                        <button
                            onClick={createBanner}
                            className="h-[50px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                        >
                            Create Draft
                        </button>

                    </div>

                    {image && (

                        <div className="mt-6">

                            <p className="font-medium mb-2">
                                Preview
                            </p>

                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="w-full h-auto rounded-xl border"
                            />

                        </div>

                    )}

                </div>


                <div className="bg-white p-6 rounded-2xl shadow mt-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Draft / Published Banners
                    </h2>

                    <div className="space-y-4">

                        {banners.map((b) => (

                            <div
                                key={b.id}
                                className="border rounded-2xl p-4 flex items-center justify-between"
                            >

                                <div className="flex items-center gap-6">
                                    <img
                                        src={b.imageUrl}
                                        alt="Banner Preview"
                                        className="
                                            w-full
                                            max-w-[520px]
                                            aspect-[3/1]
                                            object-cover
                                            rounded-2xl
                                            border border-gray-200
                                            shadow-sm
                                            "
                                    />

                                    <div>

                                        <p className="font-bold text-xl">
                                            {b.productName}
                                        </p>

                                        <p className="text-gray-500 mt-2">
                                            Position : {b.position}
                                        </p>

                                        <div className="mt-3">

                                            {b.active ? (

                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                    Published
                                                </span>

                                            ) : (

                                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                    Draft
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div className="flex gap-3 items-center">

                                    {!b.active && (

                                        <button
                                            onClick={() => publishBanner(b.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                                        >
                                            Publish
                                        </button>

                                    )}

                                    <button
                                        onClick={() => deleteBanner(b.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>


        </div>
    );
}

export default Dashboard;