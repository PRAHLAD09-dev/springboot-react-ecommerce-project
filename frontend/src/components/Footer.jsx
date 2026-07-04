import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const linkGroups = [
    {
        title: "Shop",
        links: [
            { label: "All Products", to: "/" },
            { label: "My Cart", to: "/cart" },
            { label: "My Orders", to: "/orders" },
            { label: "Become a Merchant", to: "/become-merchant" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "My Profile", to: "/profile" },
            { label: "Addresses", to: "/address" },
            { label: "Change Password", to: "/change-password" },
        ],
    },
];

function Footer() {
    return (
        <footer className="mt-20 border-t border-ink-800 bg-ink-950 text-ink-300">
            <div className="container-app py-14 sm:py-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                    {/* BRAND */}
                    <div>
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-extrabold text-white shadow-md">
                                C
                            </div>
                            <span className="font-display text-2xl font-extrabold text-white">
                                Commerce<span className="text-brand-400">Hub</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
                            A modern multi-vendor marketplace — discover products, sell with ease, and manage it all in one place.
                        </p>
                        <div className="mt-5 flex gap-3">
                            <a
                                href="https://github.com/PRAHLAD09-dev"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-ink-400 transition-colors hover:bg-brand-600 hover:text-white"
                            >
                                <FaGithub size={16} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/prahlad-bhakat/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-ink-400 transition-colors hover:bg-brand-600 hover:text-white"
                            >
                                <FaLinkedin size={16} />
                            </a>
                        </div>
                    </div>

                    {/* LINK GROUPS */}
                    {linkGroups.map((group) => (
                        <div key={group.title}>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">{group.title}</h3>
                            <ul className="space-y-3">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.to} className="text-sm text-ink-400 transition-colors hover:text-white">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* CONTACT + NEWSLETTER */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Get in touch</h3>
                        <div className="space-y-3 text-sm">
                            <a href="mailto:prahladbhakat05@gmail.com" className="flex items-center gap-2.5 text-ink-400 hover:text-white">
                                <Mail size={15} className="shrink-0 text-brand-400" />
                                <span className="truncate">prahladbhakat05@gmail.com</span>
                            </a>
                            <a href="tel:+917061118707" className="flex items-center gap-2.5 text-ink-400 hover:text-white">
                                <Phone size={15} className="shrink-0 text-brand-400" />
                                +91 70611 18707
                            </a>
                            <div className="flex items-center gap-2.5 text-ink-400">
                                <MapPin size={15} className="shrink-0 text-brand-400" />
                                Jamshedpur, Jharkhand, India
                            </div>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()} className="mt-5">
                            <label htmlFor="newsletter" className="mb-2 block text-xs font-medium text-ink-500">
                                Get product drops in your inbox
                            </label>
                            <div className="flex items-center gap-1 rounded-xl border border-ink-800 bg-ink-900 p-1">
                                <input
                                    id="newsletter"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-ink-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-500"
                                >
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row">
                    <p>© {new Date().getFullYear()} CommerceHub. All rights reserved.</p>
                    <div className="flex gap-5">
                        <span className="cursor-default hover:text-ink-300">Privacy Policy</span>
                        <span className="cursor-default hover:text-ink-300">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
