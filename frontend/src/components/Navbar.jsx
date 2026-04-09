import { Link } from "react-router-dom";

function Navbar() {
    const isLoggedIn = false;

    return (
        <nav className="bg-gray-800 text-white px-6 py-3 flex items-center">

            <h1 className="text-lg font-bold">E-Commerce</h1>

            <div className="ml-auto flex gap-6">
                <Link to="/">Home</Link>

                {!isLoggedIn && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}

                {isLoggedIn && role === "user" && (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/profile/update">Update</Link>
                        <Link to="/change-password">Change Password</Link>
                        <Link to="/delete-account">Delete Account</Link>
                    </>
                )}

                {isLoggedIn && role === "merchant" && (
                    <>
                        <Link to="/merchant/profile">M-Profile</Link>
                        <Link to="/merchant/update">M-Update</Link>
                        <Link to="/merchant/change-password">M-Password</Link>
                        <Link to="/merchant/delete">M-Delete</Link>
                    </>
                )}

                {isLoggedIn && role === "admin" && (
                    <>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/users">Users</Link>
                        <Link to="/admin/products">Products</Link>
                        <Link to="/admin/orders">Orders</Link>
                        <Link to="/admin/merchants">Merchants</Link>
                        <Link to="/admin/promotions">Promotions</Link>
                    </>
                )}

            </div>
        </nav>
    );
}

export default Navbar;