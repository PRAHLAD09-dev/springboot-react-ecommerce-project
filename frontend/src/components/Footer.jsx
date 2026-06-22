import { Mail, MapPin, Phone, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("isLoggedIn");

        window.dispatchEvent(
            new Event("authChanged")
        );

        navigate("/");

    };

    return (

        <footer className="bg-gray-900 text-gray-300 mt-16">

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* BRAND */}

                    <div className="flex items-center gap-3 mb-4">

                        <div
                            className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-500
                            to-blue-700
                            flex
                            items-center
                            justify-center
                            text-white
                            text-2xl
                            font-extrabold
                            shadow-lg
                            "
                        >
                            P
                        </div>

                        <div>

                            <h2 className="text-3xl font-extrabold">

                                <span className="text-blue-500">
                                    Commerce
                                </span>

                                <span className="text-white">
                                    Hub
                                </span>

                            </h2>

                            <p className="text-xs text-gray-500">
                                Smart Shopping Platform
                            </p>

                        </div>

                    </div>

                    {/* QUICK LINKS */}

                    <div>

                        <h3 className="text-xl font-semibold text-white mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-white transition"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="hover:text-white transition"
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/cart"
                                    className="hover:text-white transition"
                                >
                                    My Cart
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/orders"
                                    className="hover:text-white transition"
                                >
                                    My Orders
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* ACCOUNT */}

                    <div>

                        <h3 className="text-xl font-semibold text-white mb-4">
                            Account
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    to="/profile"
                                    className="hover:text-white transition"
                                >
                                    My Profile
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/address"
                                    className="hover:text-white transition"
                                >
                                    Addresses
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/change-password"
                                    className="hover:text-white transition"
                                >
                                    Change Password
                                </Link>
                            </li>

                            <li>

                                <button
                                    onClick={handleLogout}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-red-400
                                        hover:text-red-300
                                        transition
                                        "
                                >

                                    <LogOut size={16} />

                                    Logout

                                </button>

                            </li>

                        </ul>

                    </div>
                    {/* CONTACT */}

                    <div>

                        <h3 className="text-xl font-semibold text-white mb-4">
                            Contact
                        </h3>

                        <div className="space-y-4">

                            <div className="flex items-center gap-3">

                                <Mail
                                    size={18}
                                    className="text-blue-400"
                                />

                                <span>
                                    prahladbhakat05@gmail.com
                                </span>

                            </div>

                            <div className="flex items-center gap-3">

                                <Phone
                                    size={18}
                                    className="text-green-400"
                                />

                                <span>
                                    +91 70611 18707
                                </span>

                            </div>

                            <div className="flex items-center gap-3">

                                <MapPin
                                    size={18}
                                    className="text-red-400"
                                />

                                <span>
                                    Jamshedpur, Jharkhand, India
                                </span>

                            </div>

                            {/* SOCIAL LINKS */}

                            <div className="flex gap-4 pt-3">

                                <a
                                    href="https://github.com/PRAHLAD09-dev"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-white transition"
                                >
                                    <FaGithub size={22} />
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/prahlad-bhakat/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-white transition"
                                >
                                    <FaLinkedin size={22} />
                                </a>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">

                    © {new Date().getFullYear()} P CommerceHube.
                    All Rights Reserved.

                </div>

            </div>

        </footer>

    );
}

export default Footer;