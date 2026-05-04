import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [isMerchant, setIsMerchant] = useState(false);

    // auth sync
    useEffect(() => {
        const updateAuth = () => {
            const loggedIn =
                localStorage.getItem("isLoggedIn") === "true";

            const userRole =
                localStorage.getItem("role") || "";

            setIsLoggedIn(loggedIn);
            setRole(userRole);
        };

        updateAuth();

        window.addEventListener("storage", updateAuth);

        return () => {
            window.removeEventListener("storage", updateAuth);
        };
    }, []);

    // merchant check
    useEffect(() => {
        const checkMerchant = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsMerchant(false);
                return;
            }

            try {
                const res = await API.get("/merchant/profile");

                console.log("Merchant API:", res.data);

                if (res.data?.data || res.data) {
                    setIsMerchant(true);
                }

            } catch (err) {
                if (err.response?.status === 404) {
                    console.log("Normal user → no merchant account");
                    setIsMerchant(false);
                } else {
                    console.log(err);
                }
            }
        };

        if (isLoggedIn && role === "user") {
            checkMerchant();
        }

    }, [isLoggedIn, role]);

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

                {/* USER */}
                {isLoggedIn && role === "user" && (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/cart">Cart</Link>

                        {/* Merchant links */}
                        {isMerchant && (
                            <>
                                <Link to="/merchant/products">
                                    My Products
                                </Link>

                                <Link to="/merchant/orders">
                                    My Orders
                                </Link>
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
        </nav>
    );
}

export default Navbar;