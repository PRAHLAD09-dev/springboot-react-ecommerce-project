import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Tag, Package, ShieldCheck } from "lucide-react";
import { EmptyState, Badge } from "../../components/ui";

const CATEGORY_STYLE = {
    promotion: { icon: Tag, color: "text-brand-600 bg-brand-50", label: "Promotion" },
    order: { icon: Package, color: "text-success-600 bg-success-50", label: "Order" },
    security: { icon: ShieldCheck, color: "text-warning-600 bg-warning-50", label: "Security" },
};

function Notifications() {
    const navigate = useNavigate();

    // Ready for future backend wiring — no notifications endpoint exists yet.
    const notifications = [];

    return (
        <div className="container-app py-6 sm:py-8">
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">Notifications</h1>
            </div>

            {notifications.length === 0 ? (
                <EmptyState
                    icon={Bell}
                    title="No notifications yet"
                    description="Order updates, promotions, and account alerts will show up here."
                />
            ) : (
                <div className="mx-auto max-w-2xl space-y-2.5">
                    {notifications.map((n) => {
                        const style = CATEGORY_STYLE[n.category] || CATEGORY_STYLE.order;
                        const Icon = style.icon;
                        return (
                            <div
                                key={n.id}
                                className={`card-surface flex gap-4 p-4 ${!n.read ? "ring-2 ring-brand-100" : ""}`}
                            >
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.color}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-ink-900">{n.title}</p>
                                        <Badge variant="neutral">{style.label}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-ink-600">{n.message}</p>
                                    <p className="mt-1.5 text-xs text-ink-400">{n.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Notifications;
