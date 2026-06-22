import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, User, House, Package, LayoutDashboard, Store, Grid3X3, BadgePercent } from "lucide-react";
import API from "../services/api";

function Navbar() {

    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [isMerchant, setIsMerchant] = useState(false);

    const loadCartCount = async () => {

        try {

            const res =
                await API.get("/cart");

            const count =
                res.data.data.items?.reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                ) || 0;

            setCartCount(count);

        }
        catch (err) {

            console.log(err);

            setCartCount(0);

        }

    };

    useEffect(() => {

        if (
            isLoggedIn &&
            role === "user"
        ) {

            loadCartCount();

        }

    }, [isLoggedIn, role]);

    useEffect(() => {

        const updateAuth = () => {

            const loggedIn =
                !!localStorage.getItem("token");

            const userRole =
                localStorage.getItem("role") || "";

            setIsLoggedIn(loggedIn);
            setRole(userRole);

        };

        updateAuth();

        window.addEventListener(
            "authChanged",
            updateAuth
        );

        return () => {

            window.removeEventListener(
                "authChanged",
                updateAuth
            );

        };

    }, []);

    useEffect(() => {

        if (!isLoggedIn || role !== "user") {

            setIsMerchant(false);
            return;

        }

        const checkMerchant = async () => {

            try {

                const res =
                    await API.get(
                        "/merchant/profile"
                    );

                const merchant =
                    res.data.data;

                setIsMerchant(

                    merchant &&
                    merchant.active === true &&
                    merchant.approved === true

                );

            }
            catch {

                setIsMerchant(false);

            }

        };

        checkMerchant();

    }, [isLoggedIn, role]);

    return (

        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">

            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* LOGO */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <div
                        className="
                    w-10 h-10
                    rounded-2xl
                    bg-blue-600
                    text-white
                    flex items-center
                    justify-center
                    font-bold
                    text-xl
                    shadow-md
                    "
                    >
                        P
                    </div>

                    <h1 className="text-[28px] font-extrabold leading-none">

                        <span className="text-blue-600">
                            Commerce
                        </span>

                        <span className="text-slate-900">
                            Hub
                        </span>

                    </h1>

                </Link>

                {/* NAVIGATION */}

                <div
                    className="
                flex items-center
                gap-1
                bg-white
                px-3 py-2
                rounded-2xl
                border border-gray-200
                shadow-md
                "
                >

                    <Link
                        to="/"
                        className="
                                flex items-center gap-2
                                px-5 py-2
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                font-semibold
                                text-sm
                                "
                    >
                        <House size={16} />
                        Home
                    </Link>

                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className=" px-4 py-2 rounded-xl text-slate-700  text-sm font-medium hover:bg-gray-100 "


                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="
                                                        px-5 py-2
                                                        rounded-xl
                                                        bg-blue-600
                                                        text-white
                                                        text-sm
                                                        font-medium
                                                        hover:bg-blue-700
                                                        "
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {isLoggedIn && role === "user" && (
                        <>
                            <Link
                                to="/cart"
                                className="
                                        relative
                                        flex items-center gap-2
                                        px-4 py-2
                                        rounded-xl
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        hover:bg-gray-100
                                        "
                            >
                                <ShoppingCart size={16} />
                                Cart

                                {
                                    cartCount > 0 && (

                                        <span
                                            className="
                                            absolute
                                            -top-2
                                            -right-2
                                            bg-red-500
                                            text-white
                                            text-[10px]
                                            font-semibold
                                            min-w-[18px]
                                            h-[18px]
                                            flex
                                            items-center
                                            justify-center
                                            rounded-full
                                            "
                                        >
                                            {cartCount}
                                        </span>

                                    )
                                }
                            </Link>

                            {isMerchant && (
                                <>
                                    <Link
                                        to="/merchant/products"
                                        className="
                                            flex items-center gap-2
                                            px-4 py-2
                                            rounded-xl
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            hover:bg-gray-100
                                            "
                                    >
                                        <Package size={16} />
                                        Products
                                    </Link>

                                    <Link
                                        to="/merchant/orders"
                                        className="
                                        flex items-center gap-2
                                        px-4 py-2
                                        rounded-xl
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        hover:bg-gray-100
                                        "
                                    >
                                        <ShoppingCart size={16} />
                                        Merchant Orders
                                    </Link>
                                </>
                            )}

                            <Link
                                to="/profile"
                                className="
                                ml-2
                                flex items-center gap-2
                                px-5 py-2
                                rounded-xl
                                bg-blue-600
                                text-white
                                text-sm
                                font-medium
                                hover:bg-blue-700
                                "
                            >
                                <User size={16} />
                                Profile
                            </Link>
                        </>
                    )}

                    {isLoggedIn && role === "admin" && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>

                            <Link
                                to="/admin/users"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                            >
                                <User size={16} />
                                Users
                            </Link>

                            <Link
                                to="/admin/merchants"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                            >
                                <Store size={16} />
                                Merchants
                            </Link>

                            <Link
                                to="/admin/orders"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                            >
                                <ShoppingCart size={16} />
                                Orders
                            </Link>

                            <Link
                                to="/admin/categories"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                            >
                                <Grid3X3 size={16} />
                                Categories
                            </Link>

                            <Link
                                to="/admin/promotions"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-100"
                            >
                                <BadgePercent size={16} />
                                Promotions
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;