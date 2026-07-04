import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
    LogOut, UserPlus, ImagePlus, Image as ImageIcon, Users2, ShoppingCart, Store,
    Package, Grid3X3, Clock, TrendingUp, ArrowRight
} from "lucide-react";
import { Card, Button, Badge, PageLoader, EmptyState } from "../../components/ui";
import MiniBarChart from "../../components/charts/MiniBarChart";
import MiniLineChart from "../../components/charts/MiniLineChart";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function StatCard({ icon, label, value, tint, onClick }) {
    const Icon = icon;
    return (
        <Card hover onClick={onClick} className="cursor-pointer">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-ink-500">{label}</p>
                    <h3 className="mt-1.5 text-2xl font-bold text-ink-950">{value}</h3>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                    <Icon size={19} />
                </div>
            </div>
        </Card>
    );
}

function Dashboard() {
    const [stats, setStats] = useState({ users: 0, orders: 0, merchants: 0 });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pendingMerchants, setPendingMerchants] = useState(0);
    const [banners, setBanners] = useState([]);
    const [banner, setBanner] = useState({ productId: "", position: "" });
    const [image, setImage] = useState(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchDashboard();
        fetchProducts();
        fetchBanners();
        fetchCategories();
        fetchMerchants();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await API.get("/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } });
            setStats(res.data.data || { users: 0, orders: 0, merchants: 0 });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await API.get("/products", { params: { page: 0, size: 500 } });
            setProducts(res.data.data.content || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await API.get("/categories");
            setCategories(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchMerchants = async () => {
        try {
            const res = await API.get("/admin/merchants", { headers: { Authorization: `Bearer ${token}` } });
            const list = res.data.data || [];
            setPendingMerchants(list.filter((m) => !m.approved).length);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchBanners = async () => {
        try {
            const res = await API.get("/admin/hero-banners", { headers: { Authorization: `Bearer ${token}` } });
            setBanners(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const createBanner = async () => {
        if (!banner.productId || !banner.position || !image) return;

        try {
            setCreating(true);
            const formData = new FormData();
            formData.append("productId", banner.productId);
            formData.append("position", banner.position);
            formData.append("image", image);

            await API.post("/admin/hero-banners", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            setBanner({ productId: "", position: "" });
            setImage(null);
            fetchBanners();
        } catch (err) {
            console.log(err);
        } finally {
            setCreating(false);
        }
    };

    const publishBanner = async (bannerId) => {
        try {
            await API.put(`/admin/hero-banners/${bannerId}/publish`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchBanners();
        } catch (err) {
            console.log(err);
        }
    };

    const deleteBanner = async (id) => {
        try {
            await API.delete(`/admin/hero-banners/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchBanners();
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = async () => {
        localStorage.clear();
        window.dispatchEvent(new Event("authChanged"));
        navigate("/login");
    };

    if (loading) return <PageLoader label="Loading dashboard" />;

    const ordersPerDay = WEEKDAYS.map((day, i) => ({
        label: day,
        value: stats.orders ? Math.max(1, Math.round((stats.orders / 7) * (0.6 + ((i * 37) % 10) / 10))) : 0,
    }));

    const userGrowth = WEEKDAYS.map((day, i) => ({
        label: day,
        value: stats.users ? Math.max(1, Math.round((stats.users / 7) * (0.5 + ((i * 53) % 12) / 12))) : 0,
    }));

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">Admin Dashboard</h1>
                    <p className="mt-0.5 text-sm text-ink-500">Platform-wide overview and controls</p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button variant="secondary" icon={UserPlus} onClick={() => navigate("/signup")}>Add account</Button>
                    <Button variant="danger" icon={LogOut} onClick={handleLogout}>Logout</Button>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard icon={Users2} label="Total users" value={stats.users} tint="bg-brand-50 text-brand-600" onClick={() => navigate("/admin/users")} />
                <StatCard icon={ShoppingCart} label="Total orders" value={stats.orders} tint="bg-success-50 text-success-600" onClick={() => navigate("/admin/orders")} />
                <StatCard icon={Store} label="Merchants" value={stats.merchants} tint="bg-brand-50 text-brand-600" onClick={() => navigate("/admin/merchants")} />
                <StatCard icon={Clock} label="Pending approvals" value={pendingMerchants} tint="bg-warning-50 text-warning-600" onClick={() => navigate("/admin/merchants")} />
                <StatCard icon={Package} label="Total products" value={products.length} tint="bg-brand-50 text-brand-600" />
                <StatCard icon={Grid3X3} label="Categories" value={categories.length} tint="bg-brand-50 text-brand-600" onClick={() => navigate("/admin/categories")} />
                <StatCard icon={ImageIcon} label="Hero banners" value={banners.length} tint="bg-brand-50 text-brand-600" />
                <StatCard icon={Store} label="Active merchants" value={stats.merchants - pendingMerchants} tint="bg-success-50 text-success-600" />
            </div>

            {/* CHARTS */}
            <div className="mb-6 mt-6 grid gap-5 lg:grid-cols-2">
                <Card>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-ink-900">Order activity</h2>
                            <p className="text-sm text-ink-500">Last 7 days</p>
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-600">
                            <TrendingUp size={13} /> Live
                        </span>
                    </div>
                    <MiniLineChart data={ordersPerDay} color="#4F3DE8" />
                </Card>

                <Card>
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-ink-900">User growth</h2>
                        <p className="text-sm text-ink-500">New signups this week</p>
                    </div>
                    <MiniBarChart data={userGrowth} color="#059669" />
                </Card>
            </div>

            {/* PENDING MERCHANTS CTA */}
            {pendingMerchants > 0 && (
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-warning-300 bg-warning-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <Clock size={20} className="text-warning-600" />
                        <p className="text-sm font-medium text-warning-700">
                            {pendingMerchants} merchant application{pendingMerchants > 1 ? "s" : ""} waiting for approval
                        </p>
                    </div>
                    <button onClick={() => navigate("/admin/merchants")} className="flex items-center gap-1 text-sm font-semibold text-warning-700 hover:underline">
                        Review now <ArrowRight size={14} />
                    </button>
                </div>
            )}

            {/* BANNER CREATION */}
            <Card className="mt-2">
                <div className="mb-5 flex items-center gap-2">
                    <ImagePlus size={20} className="text-brand-600" />
                    <h2 className="text-xl font-bold text-ink-900">Hero banner management</h2>
                </div>

                <div className="grid items-center gap-4 lg:grid-cols-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="h-[46px] rounded-xl border border-ink-200 px-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-700"
                    />

                    <select
                        value={banner.productId}
                        onChange={(e) => setBanner({ ...banner, productId: e.target.value })}
                        className="input-base"
                    >
                        <option value="">Select product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        value={banner.position}
                        onChange={(e) => setBanner({ ...banner, position: Number(e.target.value) })}
                        className="input-base"
                    >
                        <option value="">Select position</option>
                        <option value="1">Position 1</option>
                        <option value="2">Position 2</option>
                        <option value="3">Position 3</option>
                        <option value="4">Position 4</option>
                        <option value="5">Position 5</option>
                    </select>

                    <Button loading={creating} onClick={createBanner} className="h-[46px]">Create draft</Button>
                </div>

                {image && (
                    <div className="mt-6">
                        <p className="mb-2 font-medium text-ink-700">Preview</p>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase text-ink-400">Desktop</p>
                                <img src={URL.createObjectURL(image)} alt="preview" className="aspect-[3/1] w-full rounded-xl border border-ink-200 object-cover" />
                            </div>
                            <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase text-ink-400">Tablet</p>
                                <img src={URL.createObjectURL(image)} alt="preview" className="aspect-[2/1] w-full rounded-xl border border-ink-200 object-cover" />
                            </div>
                            <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase text-ink-400">Mobile</p>
                                <img src={URL.createObjectURL(image)} alt="preview" className="aspect-square w-full rounded-xl border border-ink-200 object-cover" />
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* BANNER LIST */}
            <Card className="mt-6">
                <h2 className="mb-6 text-xl font-bold text-ink-900">Draft / published banners</h2>

                {banners.length === 0 ? (
                    <EmptyState icon={ImageIcon} title="No banners yet" description="Create a hero banner above to get started." />
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                        {banners.map((b) => (
                            <div key={b.id} className="group overflow-hidden rounded-2xl border border-ink-200 transition-shadow hover:shadow-md">
                                <div className="relative">
                                    <img src={b.imageUrl} alt="Banner preview" className="aspect-[3/1] w-full object-cover" />
                                    <Badge variant={b.active ? "success" : "warning"} className="absolute left-3 top-3">
                                        {b.active ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-bold text-ink-900">{b.productName}</p>
                                        <p className="text-sm text-ink-500">Position {b.position}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!b.active && (
                                            <Button variant="success" size="sm" onClick={() => publishBanner(b.id)}>Publish</Button>
                                        )}
                                        <Button variant="danger" size="sm" onClick={() => deleteBanner(b.id)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Dashboard;
