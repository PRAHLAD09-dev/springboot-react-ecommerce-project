import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft, MapPin, Phone, CreditCard, PackageSearch, PackageX, Search, X } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Badge, Button, EmptyState, SkeletonCard, Pagination } from "../../components/ui";
import { ORDER_STATUS_VARIANT } from "../../utils/orderStatus";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const ORDERS_PER_PAGE = 6;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/user/orders/my-orders");
                setOrders(res.data.data || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleSelectOrder = async (orderId) => {
        try {
            setDetailLoading(true);
            const [orderRes, trackingRes] = await Promise.all([
                API.get(`/user/orders/${orderId}`),
                API.get(`/user/orders/${orderId}/tracking`)
            ]);

            setSelectedOrder({ ...orderRes.data.data, tracking: trackingRes.data.data });
        } catch (err) {
            console.log(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const filteredOrders = orders.filter((o) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return (
            String(o.orderId).includes(q) ||
            o.items?.some((i) => i.productName?.toLowerCase().includes(q))
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const paginatedOrders = filteredOrders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);

    return (
        <div className="container-app py-6 sm:py-8">
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">My Orders</h1>
            </div>

            {!loading && orders.length > 0 && (
                <div className="relative mb-6 max-w-sm">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or product..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="input-base pl-10 pr-9"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
            )}

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredOrders.length === 0 ? (
                <EmptyState
                    icon={PackageSearch}
                    title={search ? "No matching orders" : "No orders yet"}
                    description={search ? "Try a different order ID or product name." : "Your placed orders will show up here."}
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* LIST */}
                    <div>
                        <div className="space-y-4">
                        {paginatedOrders.map((order) => (
                            <div
                                key={order.orderId}
                                onClick={() => handleSelectOrder(order.orderId)}
                                className={`card-surface cursor-pointer p-4 transition-shadow hover:shadow-md ${
                                    selectedOrder?.orderId === order.orderId ? "ring-2 ring-brand-400" : ""
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-4">
                                        <div className="flex -space-x-3">
                                            {order.items?.slice(0, 3).map((item, index) => (
                                                <img
                                                    key={index}
                                                    src={item.productImage}
                                                    alt=""
                                                    className="h-16 w-16 rounded-lg border-2 border-white bg-white object-cover"
                                                />
                                            ))}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-ink-900">Order #{order.orderId}</h3>
                                            <p className="mt-1 text-sm text-ink-600">
                                                {order.items?.slice(0, 2).map((i) => i.productName).join(", ")}
                                                {order.items?.length > 2 && ` + ${order.items.length - 2} more`}
                                            </p>
                                            <p className="text-sm text-ink-500">{order.items?.length || 0} item(s)</p>
                                            <p className="mt-1 font-bold text-success-600">₹{order.totalPrice}</p>
                                        </div>
                                    </div>

                                    <Badge variant={ORDER_STATUS_VARIANT[order.status] || "neutral"} className="shrink-0">
                                        {order.status.replaceAll("_", " ")}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
                        )}
                    </div>

                    {/* DETAILS */}
                    <div>
                        {!selectedOrder && !detailLoading && (
                            <EmptyState icon={PackageX} title="Select an order" description="Choose an order from the list to view its details." />
                        )}

                        {detailLoading && <SkeletonCard />}

                        {selectedOrder && !detailLoading && (
                            <div className="card-surface space-y-4 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-ink-900">Order #{selectedOrder.orderId}</h2>
                                    <Badge variant={ORDER_STATUS_VARIANT[selectedOrder.status] || "neutral"}>{selectedOrder.status}</Badge>
                                </div>

                                <p className="text-lg font-semibold text-ink-900">
                                    Total: ₹{Number(selectedOrder.totalPrice).toLocaleString("en-IN")}
                                </p>

                                {/* ITEMS */}
                                <div>
                                    <p className="mb-3 text-lg font-semibold text-ink-900">Items</p>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, i) => {
                                            const colorObj = item.selectedColor
                                                ? COLORS.find((c) => c.name === item.selectedColor)
                                                : null;

                                            return (
                                                <div key={i} className="flex items-center gap-4 rounded-xl border border-ink-100 p-3 hover:bg-ink-50">
                                                    <img
                                                        src={item.productImage}
                                                        alt=""
                                                        onClick={() => navigate(`/product/${item.productId}`)}
                                                        className="h-20 w-20 cursor-pointer rounded-lg object-cover"
                                                    />

                                                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                                                        <h3 className="font-semibold text-ink-900">{item.productName}</h3>

                                                        {item.selectedColor && (
                                                            <div className="mt-1 flex items-center gap-2">
                                                                <span
                                                                    className="h-4 w-4 rounded-full border border-ink-200"
                                                                    style={{ backgroundColor: colorObj?.hex || "#ccc" }}
                                                                />
                                                                <span className="text-sm text-ink-600">{item.selectedColor}</span>
                                                            </div>
                                                        )}

                                                        <p className="mt-1 text-sm text-ink-500">Qty: {item.quantity}</p>

                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            <span className="text-lg font-bold text-success-600">
                                                                ₹{Number(item.price).toLocaleString("en-IN")}
                                                            </span>
                                                            {item.mrp > item.price && (
                                                                <span className="text-sm text-ink-400 line-through">
                                                                    ₹{Number(item.mrp).toLocaleString("en-IN")}
                                                                </span>
                                                            )}
                                                            {item.discountPercentage > 0 && (
                                                                <Badge variant="danger">{item.discountPercentage}% OFF</Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {selectedOrder.status === "DELIVERED" && (
                                                        <Button size="sm" onClick={() => navigate(`/product/${item.productId}#reviews`)}>
                                                            Review
                                                        </Button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ADDRESS */}
                                <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
                                    <h3 className="mb-3 text-lg font-semibold text-ink-900">Delivery address</h3>
                                    <div className="mb-3 flex items-center gap-2">
                                        <MapPin size={16} className="text-brand-600" />
                                        <span className="font-medium text-ink-800">{selectedOrder.address?.addressType || "Address"}</span>
                                    </div>
                                    <div className="space-y-1 text-ink-700">
                                        <p className="font-medium">{selectedOrder.address?.street}</p>
                                        <p>{selectedOrder.address?.city}, {selectedOrder.address?.state}</p>
                                        <p>{selectedOrder.address?.country} - {selectedOrder.address?.zipCode}</p>
                                        <p className="mt-2 flex items-center gap-2">
                                            <Phone size={15} className="text-ink-500" />
                                            {selectedOrder.address?.phoneNumber}
                                        </p>
                                    </div>
                                </div>

                                {/* PAYMENT DETAILS */}
                                {(selectedOrder.payment || selectedOrder.status === "CREATED") && (
                                    <div className="card-surface p-5">
                                        <div className="mb-4 flex items-center gap-2">
                                            <CreditCard size={18} className="text-brand-600" />
                                            <h3 className="text-lg font-bold text-ink-900">Payment details</h3>
                                        </div>

                                        {selectedOrder.payment ? (
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-ink-500">Payment status</span>
                                                    <Badge variant="success">{selectedOrder.payment.status}</Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-ink-500">Transaction ID</span>
                                                    <span className="font-medium text-ink-800">{selectedOrder.payment.transactionId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-ink-500">Paid at</span>
                                                    <span className="text-ink-800">{new Date(selectedOrder.payment.paidAt).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-ink-100 pt-3">
                                                    <span className="text-ink-500">Amount paid</span>
                                                    <span className="text-lg font-bold text-success-600">
                                                        ₹{Number(selectedOrder.payment.amount).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="font-medium text-warning-600">Payment pending</p>
                                                <p className="text-sm text-ink-500">No payment has been received yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* CANCELLED */}
                                {selectedOrder.status === "CANCELLED" && (
                                    <div className="rounded-2xl border border-danger-200 bg-danger-50 p-5">
                                        <h3 className="font-semibold text-danger-700">Order cancelled</h3>
                                        {selectedOrder.cancelReason === "PAYMENT_TIMEOUT" && (
                                            <>
                                                <p className="mt-2 text-sm text-ink-600">Payment was not completed within 30 minutes.</p>
                                                <p className="text-sm text-ink-600">This order was automatically cancelled.</p>
                                            </>
                                        )}
                                        {selectedOrder.cancelReason === "ADMIN_CANCELLED" && (
                                            <p className="mt-2 text-sm text-ink-600">This order was cancelled by administrator.</p>
                                        )}
                                        {selectedOrder.cancelReason === "USER_CANCELLED" && (
                                            <p className="mt-2 text-sm text-ink-600">You cancelled this order.</p>
                                        )}
                                    </div>
                                )}

                                {/* PAYMENT PENDING CTA */}
                                {selectedOrder.status === "CREATED" && (
                                    <div className="rounded-2xl border border-warning-200 bg-warning-50 p-5">
                                        <h3 className="font-semibold text-warning-700">Awaiting payment</h3>
                                        <p className="mt-2 text-sm text-ink-600">Complete your payment within 30 minutes to confirm this order.</p>
                                        <p className="mb-5 text-sm text-ink-600">Unpaid orders are automatically cancelled.</p>
                                        <Button variant="success" icon={CreditCard} onClick={() => navigate(`/payment/${selectedOrder.orderId}`)}>
                                            Pay now
                                        </Button>
                                    </div>
                                )}

                                {/* TIMELINE */}
                                <div>
                                    <p className="mb-4 text-lg font-semibold text-ink-900">Tracking</p>
                                    <div className="relative">
                                        {selectedOrder.tracking?.map((t, i) => {
                                            const isLast = i === selectedOrder.tracking.length - 1;
                                            const isCancelled = t.status === "CANCELLED";

                                            return (
                                                <div key={i} className="relative mb-6 flex items-start gap-4">
                                                    {!isLast && (
                                                        <div className={`absolute left-[10px] top-6 h-full w-[2px] ${isCancelled ? "bg-danger-300" : "bg-ink-300"}`} />
                                                    )}

                                                    <div className={`z-10 h-5 w-5 rounded-full ${isCancelled ? "bg-danger-500" : "bg-success-500"}`} />

                                                    <div>
                                                        <p className={`font-semibold capitalize ${isCancelled ? "text-danger-600" : "text-success-600"}`}>
                                                            {t.status.replaceAll("_", " ").toLowerCase()}
                                                        </p>
                                                        <p className="text-sm text-ink-500">{new Date(t.updatedAt).toLocaleString()}</p>

                                                        {isCancelled && selectedOrder.cancelReason === "PAYMENT_TIMEOUT" && (
                                                            <p className="mt-1 text-xs text-danger-500">Payment not completed within 30 minutes</p>
                                                        )}
                                                        {isCancelled && selectedOrder.cancelReason === "ADMIN_CANCELLED" && (
                                                            <p className="mt-1 text-xs text-danger-500">Cancelled by administrator</p>
                                                        )}
                                                        {isCancelled && selectedOrder.cancelReason === "USER_CANCELLED" && (
                                                            <p className="mt-1 text-xs text-danger-500">Cancelled by user</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
