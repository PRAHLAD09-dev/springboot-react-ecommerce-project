import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [isMerchant, setIsMerchant] = useState(false);

    useEffect(() => {
        const updateAuth = () => {
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
            setRole(localStorage.getItem("role") || "");
        };

        updateAuth();
        window.addEventListener("storage", updateAuth);

        return () => window.removeEventListener("storage", updateAuth);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsMerchant(false);
            return;
        }

        API.get("/api/merchant/profile")
            .then(() => setIsMerchant(true))
            .catch(() => setIsMerchant(false));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setRole("");
        setIsMerchant(false);
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

                {isLoggedIn && role === "user" && (
                    <>
                        {/* USER (always visible if logged in) */}
                        <Link to="/profile">Profile</Link>
                        {/* <Link to="/profile/update">Update</Link>
                        <Link to="/change-password">Change Password</Link>
                        <Link to="/delete-account">Delete</Link>
                        <Link to="/orders">Orders</Link> */}
                        <Link to="/cart">Cart</Link>
                        {/* <Link to="/address">Address</Link> */}

                        {/* MERCHANT (extra) */}
                        {isMerchant && (
                            <>
                                <Link to="/merchant/products">My Products</Link>
                                <Link to="/merchant/orders">My Orders</Link>
                            </>
                        )}
                    </>
                )}

                {/* ADMIN */}
                {isLoggedIn && role === "admin" && (
                    <>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/users">Users</Link>
                        <Link to="/admin/orders">Orders</Link>
                        <Link to="/admin/merchants">Merchants</Link>
                        <Link to="/admin/promotions">Promotions</Link>
                        <Link to="/admin/categories">Category</Link>
                    </>
                )}

            </div>
        </nav >
    );
}

export default Navbar;