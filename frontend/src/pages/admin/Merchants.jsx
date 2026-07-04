import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft, Store, Search, ShieldAlert, CheckCircle2, Ban } from "lucide-react";
import { Card, Badge, Button, EmptyState, SectionHeader, SkeletonCard, Pagination, Modal, Avatar } from "../../components/ui";

const STATUS_VARIANT = { PENDING: "warning", APPROVED: "success", BLOCKED: "danger", UNKNOWN: "neutral" };
const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "BLOCKED"];

function getStatus(m) {
    if (!m.approved) return "PENDING";
    if (m.approved && m.active) return "APPROVED";
    if (m.approved && !m.active) return "BLOCKED";
    return "UNKNOWN";
}

function Merchants() {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [confirmAction, setConfirmAction] = useState(null); // { merchant, type }
    const PER_PAGE = 8;

    const fetchMerchants = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/merchants", { headers: { Authorization: `Bearer ${token}` } });
            setMerchants(res.data.data || []);
        } catch (err) {
            console.log(err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, []);

    const runAction = async (url, id) => {
        try {
            setActingId(id);
            await API.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
            await fetchMerchants();
        } catch (err) {
            console.log(err.response?.data || err);
        } finally {
            setActingId(null);
            setConfirmAction(null);
        }
    };

    const approve = (id) => runAction(`/admin/approve/${id}`, id);
    const block = (id) => runAction(`/admin/block/${id}`, id);
    const unblock = (id) => runAction(`/admin/unblock/${id}`, id);

    const filteredMerchants = merchants.filter((m) => {
        const status = getStatus(m);
        const matchesStatus = statusFilter === "ALL" || status === statusFilter;
        const q = search.toLowerCase().trim();
        const matchesSearch = !q || m.businessName?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredMerchants.length / PER_PAGE));
    const paginatedMerchants = filteredMerchants.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const ACTION_CONFIG = {
        approve: { title: "Approve merchant", icon: CheckCircle2, color: "text-success-600", desc: "This merchant will be able to list and sell products immediately.", confirmLabel: "Approve", variant: "success", run: approve },
        block: { title: "Block merchant", icon: Ban, color: "text-danger-600", desc: "This merchant will no longer be able to sell or manage products.", confirmLabel: "Block", variant: "danger", run: block },
        unblock: { title: "Unblock merchant", icon: ShieldAlert, color: "text-brand-600", desc: "This merchant will regain access to their store.", confirmLabel: "Unblock", variant: "primary", run: unblock },
    };

    return (
        <div>
            <div className="mb-5 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={18} />
                </button>
                <SectionHeader
                    title="Merchants Management"
                    subtitle={`${merchants.length} merchant ${merchants.length === 1 ? "account" : "accounts"}`}
                    className="mb-0 flex-1"
                />
            </div>

            {!loading && merchants.length > 0 && (
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                        <input
                            type="text"
                            placeholder="Search by business or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input-base pl-10"
                        />
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
                                {s === "ALL" ? "All" : s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredMerchants.length === 0 ? (
                <EmptyState
                    icon={Store}
                    title={merchants.length === 0 ? "No merchants found" : "No matching merchants"}
                    description={merchants.length === 0 ? "Merchant applications will appear here." : "Try a different search or filter."}
                />
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {paginatedMerchants.map((m) => {
                            const status = getStatus(m);
                            const busy = actingId === m.id;

                            return (
                                <Card key={m.id} hover>
                                    <div className="flex items-start gap-3">
                                        <Avatar name={m.businessName || "Merchant"} size="md" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="truncate font-semibold text-ink-900">{m.businessName || "No Business"}</p>
                                                <Badge variant={STATUS_VARIANT[status]} className="shrink-0">{status}</Badge>
                                            </div>
                                            <p className="truncate text-sm text-ink-500">{m.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        {status === "PENDING" && (
                                            <Button variant="success" size="sm" fullWidth loading={busy} onClick={() => setConfirmAction({ merchant: m, type: "approve" })}>
                                                Approve
                                            </Button>
                                        )}
                                        {status === "APPROVED" && (
                                            <Button variant="danger" size="sm" fullWidth loading={busy} onClick={() => setConfirmAction({ merchant: m, type: "block" })}>
                                                Block
                                            </Button>
                                        )}
                                        {status === "BLOCKED" && (
                                            <Button size="sm" fullWidth loading={busy} onClick={() => setConfirmAction({ merchant: m, type: "unblock" })}>
                                                Unblock
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
                    )}
                </>
            )}

            {/* CONFIRMATION DIALOG */}
            <Modal
                open={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                title={confirmAction ? ACTION_CONFIG[confirmAction.type].title : ""}
                footer={
                    confirmAction && (
                        <>
                            <Button variant="secondary" onClick={() => setConfirmAction(null)}>Cancel</Button>
                            <Button
                                variant={ACTION_CONFIG[confirmAction.type].variant}
                                loading={actingId === confirmAction.merchant.id}
                                onClick={() => ACTION_CONFIG[confirmAction.type].run(confirmAction.merchant.id)}
                            >
                                {ACTION_CONFIG[confirmAction.type].confirmLabel}
                            </Button>
                        </>
                    )
                }
            >
                {confirmAction && (
                    <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 ${ACTION_CONFIG[confirmAction.type].color}`}>
                            {(() => { const Icon = ACTION_CONFIG[confirmAction.type].icon; return <Icon size={20} />; })()}
                        </div>
                        <div>
                            <p className="font-semibold text-ink-900">{confirmAction.merchant.businessName}</p>
                            <p className="mt-1 text-sm text-ink-600">{ACTION_CONFIG[confirmAction.type].desc}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Merchants;
