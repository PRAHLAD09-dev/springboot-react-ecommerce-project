import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft, MapPin, Phone, PackageSearch, Search, X, CheckCircle2, Circle, Mail } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Badge, Button, EmptyState, SkeletonCard, Pagination, Drawer } from "../../components/ui";
import { ORDER_STATUS_VARIANT, ORDER_FLOW } from "../../utils/orderStatus";

const STATUS_FILTERS = ["ALL", "CREATED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const PER_PAGE = 8;

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/orders", { headers: { Authorization: `Bearer ${token}` } });
            setOrders(res.data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await API.put(`/admin/orders/${orderId}/status`, null, {
                params: { status },
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchOrders();
            setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
        } catch (err) {
            console.log(err.response?.data);
        }
    };

    const filteredOrders = orders.filter((o) => {
        const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
        const q = search.toLowerCase().trim();
        const matchesSearch = !q || String(o.orderId).includes(q) || o.userEmail?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
    const paginatedOrders = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">Admin Orders</h1>
            </div>

            {!loading && orders.length > 0 && (
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input-base pl-10 pr-9"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                                <X size={15} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_FILTERS.map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    statusFilter === s ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                                }`}
                            >
                                {s === "ALL" ? "All" : s.replaceAll("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredOrders.length === 0 ? (
                <EmptyState
                    icon={PackageSearch}
                    title={orders.length === 0 ? "No orders found" : "No matching orders"}
                    description={orders.length === 0 ? "Orders placed by users will appear here." : "Try a different search or filter."}
                />
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedOrders.map((o) => (
                            <div
                                key={o.orderId}
                                onClick={() => setSelectedOrder(o)}
                                className="card-surface cursor-pointer p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-lg font-bold text-ink-900">Order #{o.orderId}</p>
                                        <p className="mt-0.5 truncate text-sm text-ink-500">{o.userEmail || "No user"}</p>
                                    </div>
                                    <Badge variant={ORDER_STATUS_VARIANT[o.status] || "neutral"}>{o.status.replaceAll("_", " ")}</Badge>
                                </div>

                                <div className="mt-3 flex -space-x-2.5">
                                    {o.items?.slice(0, 4).map((item, i) => (
                                        <img key={i} src={item.productImage} alt="" className="h-10 w-10 rounded-lg border-2 border-white bg-ink-50 object-contain p-0.5" />
                                    ))}
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-ink-900">₹{Number(o.totalPrice || o.totalAmount || 0).toLocaleString("en-IN")}</span>
                                    <span className="text-sm font-medium text-brand-600">View details →</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-8" />
                    )}
                </>
            )}

            {/* ORDER DETAILS DRAWER */}
            <Drawer open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={selectedOrder ? `Order #${selectedOrder.orderId}` : ""}>
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Badge variant={ORDER_STATUS_VARIANT[selectedOrder.status] || "neutral"} className="text-sm">
                                {selectedOrder.status.replaceAll("_", " ")}
                            </Badge>
                            <span className="text-xl font-bold text-ink-900">₹{Number(selectedOrder.totalPrice || selectedOrder.totalAmount || 0).toLocaleString("en-IN")}</span>
                        </div>

                        {ORDER_FLOW.includes(selectedOrder.status) && (
                            <div>
                                <p className="mb-3 text-sm font-semibold text-ink-800">Order progress</p>
                                <div className="flex items-center">
                                    {ORDER_FLOW.map((step, i) => {
                                        const currentIndex = ORDER_FLOW.indexOf(selectedOrder.status);
                                        const done = i <= currentIndex;
                                        return (
                                            <div key={step} className="flex flex-1 items-center last:flex-none">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    {done ? <CheckCircle2 size={20} className="text-success-600" /> : <Circle size={20} className="text-ink-300" />}
                                                    <span className={`text-center text-[10px] font-medium ${done ? "text-success-700" : "text-ink-400"}`}>{step.replaceAll("_", " ")}</span>
                                                </div>
                                                {i < ORDER_FLOW.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${i < currentIndex ? "bg-success-500" : "bg-ink-200"}`} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl border border-ink-100 bg-ink-50 p-4">
                            <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-ink-800">
                                <Mail size={14} className="text-brand-600" /> Customer
                            </h3>
                            <p className="text-sm text-ink-700">{selectedOrder.userEmail || "—"}</p>
                        </div>

                        {selectedOrder.address && (
                            <div className="rounded-xl border border-ink-100 bg-ink-50 p-4">
                                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-ink-800">
                                    <MapPin size={14} className="text-brand-600" /> {selectedOrder.address?.addressType || "Address"}
                                </h3>
                                <div className="space-y-1 text-sm text-ink-600">
                                    <p>{selectedOrder.address?.street}</p>
                                    <p>{selectedOrder.address?.city}, {selectedOrder.address?.state}</p>
                                    <p>{selectedOrder.address?.country} - {selectedOrder.address?.zipCode}</p>
                                    <p className="mt-1.5 flex items-center gap-2"><Phone size={13} /> {selectedOrder.address?.phoneNumber}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="mb-3 text-sm font-semibold text-ink-800">Items ({selectedOrder.items?.length || 0})</p>
                            <div className="space-y-3">
                                {selectedOrder.items?.map((item, i) => {
                                    const colorObj = item.selectedColor ? COLORS.find((c) => c.name === item.selectedColor) : null;
                                    return (
                                        <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                                className="h-16 w-16 cursor-pointer rounded-lg border border-ink-100 bg-white object-contain p-1"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-semibold text-ink-900">{item.productName}</h4>
                                                {item.selectedColor && (
                                                    <div className="mt-1 flex items-center gap-1.5">
                                                        <span className="h-3 w-3 rounded-full border border-ink-200" style={{ backgroundColor: colorObj?.hex || "#ccc" }} />
                                                        <span className="text-xs text-ink-500">{item.selectedColor}</span>
                                                    </div>
                                                )}
                                                <p className="mt-0.5 text-xs text-ink-500">Qty: {item.quantity}</p>
                                                <span className="text-sm font-bold text-ink-900">₹{item.price}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedOrder.payment ? (
                            <div className="rounded-xl border border-success-200 bg-success-50 p-4 text-sm">
                                <p className="font-semibold text-success-700">Payment successful</p>
                                <p className="mt-1">Transaction ID: {selectedOrder.payment.transactionId}</p>
                                <p>Amount: ₹{Number(selectedOrder.payment.amount).toLocaleString("en-IN")}</p>
                            </div>
                        ) : selectedOrder.status === "CREATED" ? (
                            <div className="rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm">
                                <p className="font-semibold text-warning-700">Awaiting payment</p>
                            </div>
                        ) : selectedOrder.status === "CANCELLED" ? (
                            <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm">
                                <p className="font-semibold text-danger-700">Order cancelled</p>
                                <p className="mt-1 text-ink-600">
                                    {selectedOrder.cancelReason === "PAYMENT_TIMEOUT" ? "Payment was not completed within 30 minutes." : "Cancelled by administrator."}
                                </p>
                            </div>
                        ) : null}

                        {(selectedOrder.status === "PENDING" || selectedOrder.status === "SHIPPED" || selectedOrder.status === "OUT_FOR_DELIVERY") && (
                            <div className="flex gap-3">
                                {selectedOrder.status === "PENDING" && (
                                    <Button fullWidth onClick={() => updateStatus(selectedOrder.orderId, "CONFIRMED")}>Confirm order</Button>
                                )}
                                {selectedOrder.status === "SHIPPED" && (
                                    <Button fullWidth variant="warning" onClick={() => updateStatus(selectedOrder.orderId, "OUT_FOR_DELIVERY")}>Out for delivery</Button>
                                )}
                                {selectedOrder.status === "OUT_FOR_DELIVERY" && (
                                    <Button fullWidth variant="success" onClick={() => updateStatus(selectedOrder.orderId, "DELIVERED")}>Mark delivered</Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    );
}

export default AdminOrders;
