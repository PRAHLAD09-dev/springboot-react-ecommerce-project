import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white px-6 py-3 flex items-center">

            <h1 className="text-lg font-bold">E-Commerce</h1>

            <div className="ml-auto flex gap-6 items-center">

                <Link to="/">Home</Link>

                {/* NOT LOGGED IN */}
                {!isLoggedIn && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}

                {/* USER */}
                {isLoggedIn && role === "user" && (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/profile/update">Update</Link>
                        <Link to="/change-password">Change Password</Link>
                        <Link to="/delete-account">Delete</Link>
                        <Link to="/orders">Orders</Link>
                        <Link to="/cart">Cart</Link>
                        <Link to="/addresses">Address</Link>
                    </>
                )}

                {/* MERCHANT */}
                {isLoggedIn && role === "merchant" && (
                    <>
                        <Link to="/merchant/profile">M-Profile</Link>
                        <Link to="/merchant/update">M-Update</Link>
                        <Link to="/merchant/change-password">M-Password</Link>
                        <Link to="/merchant/delete">M-Delete</Link>
                        <Link to="/merchant/products">M-Products</Link>
                        <Link to="/merchant/orders">M-Orders</Link>
                    </>
                )}

                {/* ADMIN */}
                {isLoggedIn && role === "admin" && (
                    <>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/users">Users</Link>
                        <Link to="/admin/products">Products</Link>
                        <Link to="/admin/orders">Orders</Link>
                        <Link to="/admin/merchants">Merchants</Link>
                        <Link to="/admin/promotions">Promotions</Link>
                        <Link to="/admin/categories">Category</Link>
                    </>
                )}

                {/* LOGOUT */}
                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                )}

            </div>
        </nav>
    );
}

export default Navbar;