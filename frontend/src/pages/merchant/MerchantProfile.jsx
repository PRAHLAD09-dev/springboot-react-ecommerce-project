import { useEffect, useState } from "react";
import API from "../../services/api";
import { ShieldAlert, Package, ShoppingCart, IndianRupee } from "lucide-react";
import { Card, Badge, Button, Input, PageLoader, Avatar } from "../../components/ui";

function MerchantProfile() {
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

    const [openAction, setOpenAction] = useState(null);
    const [businessName, setBusinessName] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");

    const [merchantOtp, setMerchantOtp] = useState("");
    const [merchantOtpSent, setMerchantOtpSent] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        const fetchMerchantProfile = async () => {
            try {
                const res = await API.get("/merchant/profile");

                if (res.data.success && res.data.data) {
                    setMerchant(res.data.data);
                    setBusinessName(res.data.data.businessName || "");
                } else {
                    setMerchant(null);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setMerchant(null);
                } else if (err.response?.status === 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                } else {
                    console.log(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMerchantProfile();

        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.allSettled([
                    API.get("/merchant/products"),
                    API.get("/merchant/orders"),
                ]);
                const products = productsRes.status === "fulfilled" ? productsRes.value.data.data || [] : [];
                const orders = ordersRes.status === "fulfilled" ? ordersRes.value.data.data || [] : [];
                const revenue = orders.filter((o) => o.status === "DELIVERED").reduce((sum, o) => sum + (o.totalPrice || 0), 0);
                setStats({ products: products.length, orders: orders.length, revenue });
            } catch (err) {
                console.log(err);
            }
        };
        fetchStats();
    }, []);

    const handleUpdateMerchant = async () => {
        setUpdateError("");
        try {
            setUpdateLoading(true);
            await API.put("/merchant/profile", { businessName });
            setMerchant((prev) => ({ ...prev, businessName }));
            setOpenAction(null);
        } catch (err) {
            console.log(err);
            setUpdateError(err.response?.data?.message || "Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleSendMerchantOtp = async () => {
        setDeleteError("");
        try {
            setDeleteLoading(true);
            await API.post("/merchant/delete/request");
            setMerchantOtpSent(true);
        } catch (err) {
            console.log(err);
            setDeleteError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteMerchant = async () => {
        setDeleteError("");
        if (!merchantOtp.trim()) {
            setDeleteError("Enter OTP");
            return;
        }

        const confirmDelete = window.confirm("Do you want to deactivate your merchant account?");
        if (!confirmDelete) return;

        try {
            setDeleteLoading(true);
            await API.delete("/merchant/delete", { params: { otp: merchantOtp } });
            setMerchant(null);
            setOpenAction(null);
        } catch (err) {
            console.log(err);
            setDeleteError(err.response?.data?.message || "Failed to deactivate merchant account");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <PageLoader label="Loading merchant profile" />;
    if (!merchant) return null;

    const statusText = !merchant.approved
        ? "Pending approval"
        : merchant.approved && merchant.active
            ? "Approved"
            : "Blocked";

    const statusVariant = !merchant.approved ? "warning" : merchant.approved && merchant.active ? "success" : "danger";

    return (
        <>
            <Card className="mb-6 overflow-hidden !p-0">
                <div className="relative bg-gradient-to-br from-brand-600 to-ink-950 px-5 py-7 text-white sm:px-7">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative flex items-center gap-4">
                        <Avatar name={merchant.businessName} size="xl" />
                        <div>
                            <h2 className="text-xl font-bold sm:text-2xl">{merchant.businessName}</h2>
                            <p className="text-sm text-brand-100">{merchant.email}</p>
                            <Badge variant={statusVariant} className="mt-2">{statusText}</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-ink-100 border-t border-ink-100">
                    <div className="flex flex-col items-center gap-1 py-4">
                        <Package size={16} className="text-brand-600" />
                        <p className="text-lg font-bold text-ink-900">{stats.products}</p>
                        <p className="text-xs text-ink-500">Products</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-4">
                        <ShoppingCart size={16} className="text-brand-600" />
                        <p className="text-lg font-bold text-ink-900">{stats.orders}</p>
                        <p className="text-xs text-ink-500">Orders</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-4">
                        <IndianRupee size={16} className="text-success-600" />
                        <p className="text-lg font-bold text-success-600">₹{stats.revenue.toLocaleString("en-IN")}</p>
                        <p className="text-xs text-ink-500">Revenue</p>
                    </div>
                </div>
            </Card>

            <div className="mb-6 flex flex-wrap gap-3">
                <Button onClick={() => setOpenAction(openAction === "update" ? null : "update")}>
                    Update merchant
                </Button>
                <Button variant="danger" onClick={() => setOpenAction(openAction === "delete" ? null : "delete")}>
                    Deactivate merchant
                </Button>
            </div>

            {openAction === "update" && (
                <div className="max-w-lg animate-slide-up rounded-2xl border border-brand-100 bg-brand-50 p-5">
                    <h3 className="mb-4 font-semibold text-ink-900">Update business name</h3>

                    {updateError && (
                        <div className="mb-3 rounded-xl bg-danger-50 px-4 py-2.5 text-sm font-medium text-danger-700">{updateError}</div>
                    )}

                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />

                    <div className="mt-4 flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setOpenAction(null)}>Cancel</Button>
                        <Button loading={updateLoading} onClick={handleUpdateMerchant}>Save</Button>
                    </div>
                </div>
            )}

            {openAction === "delete" && (
                <div className="max-w-lg animate-slide-up rounded-2xl border border-danger-200 bg-danger-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-danger-600" />
                        <h3 className="font-semibold text-danger-600">Deactivate merchant account</h3>
                    </div>
                    <p className="mb-4 text-sm text-ink-600">Your merchant account will be deactivated.</p>

                    {deleteError && (
                        <div className="mb-3 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-danger-700">{deleteError}</div>
                    )}

                    <Input placeholder="Enter OTP" value={merchantOtp} onChange={(e) => setMerchantOtp(e.target.value)} />

                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setOpenAction(null);
                                setMerchantOtp("");
                            }}
                        >
                            Cancel
                        </Button>

                        {!merchantOtpSent && (
                            <Button loading={deleteLoading} onClick={handleSendMerchantOtp}>Send OTP</Button>
                        )}

                        <Button variant="danger" loading={deleteLoading} onClick={handleDeleteMerchant}>
                            Deactivate
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default MerchantProfile;
