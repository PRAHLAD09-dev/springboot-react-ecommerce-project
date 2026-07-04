import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
    ShoppingCart,
    User,
    Package,
    LayoutDashboard,
    Store,
    Grid3X3,
    BadgePercent,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Settings,
    Bell,
} from "lucide-react";
import API from "../services/api";
import { Avatar, Badge } from "./ui";
import NotificationBell from "./NotificationBell";

function NavItem({ to, icon, children, onClick }) {
    const Icon = icon;
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                }`
            }
        >
            <Icon size={16} />
            {children}
        </NavLink>
    );
}

function Navbar() {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [isMerchant, setIsMerchant] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const email = typeof window !== "undefined" ? localStorage.getItem("email") : "";
    const profileRef = useRef(null);

    const loadCartCount = async () => {
        try {
            const res = await API.get("/cart");
            const count = res.data.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            setCartCount(count);
        } catch {
            setCartCount(0);
        }
    };

    useEffect(() => {
        if (isLoggedIn && role === "user") loadCartCount();
    }, [isLoggedIn, role]);

    useEffect(() => {
        const updateAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setRole(localStorage.getItem("role") || "");
        };
        updateAuth();
        window.addEventListener("authChanged", updateAuth);
        return () => window.removeEventListener("authChanged", updateAuth);
    }, []);

    useEffect(() => {
        if (!isLoggedIn || role !== "user") {
            setIsMerchant(false);
            return;
        }
        const checkMerchant = async () => {
            try {
                const res = await API.get("/merchant/profile");
                const merchant = res.data.data;
                setIsMerchant(merchant && merchant.active === true && merchant.approved === true);
            } catch {
                setIsMerchant(false);
            }
        };
        checkMerchant();
    }, [isLoggedIn, role]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [role, isLoggedIn]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("authChanged"));
        setProfileOpen(false);
        navigate("/");
    };

    const userLinks = isLoggedIn && role === "user";
    const adminLinks = isLoggedIn && role === "admin";

    return (
        <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-ink-200/70 bg-white/90 shadow-sm backdrop-blur-xl" : "border-transparent bg-white/85 backdrop-blur-lg"}`}>
            <div className={`container-app flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14 lg:h-16" : "h-16 lg:h-[72px]"}`}>
                {/* LOGO */}
                <Link to="/" className="flex shrink-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-extrabold text-white shadow-sm lg:h-10 lg:w-10">
                        C
                    </div>
                    <span className="font-display text-xl font-extrabold leading-none text-ink-950 lg:text-2xl">
                        Commerce<span className="text-brand-600">Hub</span>
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden items-center gap-1 lg:flex">
                    <NavItem to="/" icon={Store}>Home</NavItem>

                    {userLinks && isMerchant && (
                        <>
                            <NavItem to="/merchant/products" icon={Package}>Products</NavItem>
                            <NavItem to="/merchant/orders" icon={ShoppingCart}>Merchant Orders</NavItem>
                        </>
                    )}

                    {adminLinks && (
                        <>
                            <NavItem to="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                            <NavItem to="/admin/users" icon={User}>Users</NavItem>
                            <NavItem to="/admin/merchants" icon={Store}>Merchants</NavItem>
                            <NavItem to="/admin/orders" icon={ShoppingCart}>Orders</NavItem>
                            <NavItem to="/admin/categories" icon={Grid3X3}>Categories</NavItem>
                            <NavItem to="/admin/promotions" icon={BadgePercent}>Promotions</NavItem>
                        </>
                    )}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 lg:gap-3">
                    {userLinks && (
                        <div className="hidden sm:block">
                            <NotificationBell notifications={[]} />
                        </div>
                    )}

                    {userLinks && (
                        <Link
                            to="/cart"
                            className="relative hidden h-11 w-11 items-center justify-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 sm:flex"
                            aria-label="Cart"
                        >
                            <ShoppingCart size={19} />
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {!isLoggedIn && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                to="/login"
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {isLoggedIn && (
                        <div className="relative hidden sm:block" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen((s) => !s)}
                                className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-ink-100"
                            >
                                <Avatar name={email || role} size="sm" />
                                <ChevronDown size={15} className={`text-ink-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 origin-top-right animate-scale-in rounded-2xl border border-ink-200/70 bg-white p-2 shadow-lg">
                                    <div className="border-b border-ink-100 px-3 py-2.5">
                                        <p className="truncate text-sm font-semibold text-ink-900">{email || "My Account"}</p>
                                        <Badge variant="brand" className="mt-1 capitalize">{role}</Badge>
                                    </div>
                                    <div className="py-1.5">
                                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 hover:text-ink-900">
                                            <User size={16} /> My Profile
                                        </Link>
                                        {role === "user" && (
                                            <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 hover:text-ink-900">
                                                <Package size={16} /> My Orders
                                            </Link>
                                        )}
                                        <Link to="/change-password" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 hover:text-ink-900">
                                            <Settings size={16} /> Settings
                                        </Link>
                                    </div>
                                    <div className="border-t border-ink-100 pt-1.5">
                                        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-danger-600 hover:bg-danger-50">
                                            <LogOut size={16} /> Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MOBILE TOGGLE */}
                    <button
                        onClick={() => setMobileOpen((s) => !s)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 hover:bg-ink-100 lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`overflow-hidden border-t border-ink-100 bg-white transition-all duration-300 ease-out lg:hidden ${
                    mobileOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="container-app flex flex-col gap-1 py-4">
                    {isLoggedIn && (
                        <div className="mb-2 flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-3">
                            <Avatar name={email || role} size="md" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-ink-900">{email || "My Account"}</p>
                                <Badge variant="brand" className="mt-0.5 capitalize">{role}</Badge>
                            </div>
                        </div>
                    )}

                    <NavItem to="/" icon={Store} onClick={() => setMobileOpen(false)}>Home</NavItem>

                    {userLinks && (
                        <>
                            <NavItem to="/cart" icon={ShoppingCart} onClick={() => setMobileOpen(false)}>
                                Cart {cartCount > 0 && <Badge variant="danger" className="ml-1">{cartCount}</Badge>}
                            </NavItem>
                            <NavItem to="/orders" icon={Package} onClick={() => setMobileOpen(false)}>My Orders</NavItem>
                            <NavItem to="/notifications" icon={Bell} onClick={() => setMobileOpen(false)}>Notifications</NavItem>
                            <NavItem to="/profile" icon={User} onClick={() => setMobileOpen(false)}>Profile</NavItem>
                            {isMerchant && (
                                <>
                                    <NavItem to="/merchant/products" icon={Package} onClick={() => setMobileOpen(false)}>Merchant Products</NavItem>
                                    <NavItem to="/merchant/orders" icon={ShoppingCart} onClick={() => setMobileOpen(false)}>Merchant Orders</NavItem>
                                </>
                            )}
                        </>
                    )}

                    {adminLinks && (
                        <>
                            <NavItem to="/admin/dashboard" icon={LayoutDashboard} onClick={() => setMobileOpen(false)}>Dashboard</NavItem>
                            <NavItem to="/admin/users" icon={User} onClick={() => setMobileOpen(false)}>Users</NavItem>
                            <NavItem to="/admin/merchants" icon={Store} onClick={() => setMobileOpen(false)}>Merchants</NavItem>
                            <NavItem to="/admin/orders" icon={ShoppingCart} onClick={() => setMobileOpen(false)}>Orders</NavItem>
                            <NavItem to="/admin/categories" icon={Grid3X3} onClick={() => setMobileOpen(false)}>Categories</NavItem>
                            <NavItem to="/admin/promotions" icon={BadgePercent} onClick={() => setMobileOpen(false)}>Promotions</NavItem>
                        </>
                    )}

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="mt-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-danger-600 hover:bg-danger-50"
                        >
                            <LogOut size={16} /> Log out
                        </button>
                    ) : (
                        <div className="mt-2 flex gap-2">
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-center text-sm font-semibold text-ink-700">
                                Log in
                            </Link>
                            <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
