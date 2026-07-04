import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Tag, Package, ShieldCheck } from "lucide-react";
import { EmptyState } from "./ui";

const CATEGORY_STYLE = {
    promotion: { icon: Tag, color: "text-brand-600 bg-brand-50" },
    order: { icon: Package, color: "text-success-600 bg-success-50" },
    security: { icon: ShieldCheck, color: "text-warning-600 bg-warning-50" },
};

export default function NotificationBell({ notifications = [] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();
    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((s) => !s)}
                aria-label="Notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
                <Bell size={19} />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-[9px] w-[9px] items-center justify-center rounded-full bg-danger-500 ring-2 ring-white" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 origin-top-right animate-scale-in overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                        <p className="font-semibold text-ink-900">Notifications</p>
                        {unreadCount > 0 && <span className="text-xs font-medium text-brand-600">{unreadCount} new</span>}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-2">
                                <EmptyState
                                    icon={Bell}
                                    title="No notifications"
                                    description="You're all caught up. New updates will show up here."
                                />
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const style = CATEGORY_STYLE[n.category] || CATEGORY_STYLE.order;
                                const Icon = style.icon;
                                return (
                                    <div
                                        key={n.id}
                                        className={`flex gap-3 border-b border-ink-50 px-4 py-3 transition-colors last:border-0 hover:bg-ink-50 ${!n.read ? "bg-brand-50/40" : ""}`}
                                    >
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.color}`}>
                                            <Icon size={15} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-ink-900">{n.title}</p>
                                            <p className="mt-0.5 truncate text-xs text-ink-500">{n.message}</p>
                                            <p className="mt-1 text-[11px] text-ink-400">{n.time}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <button
                        onClick={() => { setOpen(false); navigate("/notifications"); }}
                        className="block w-full border-t border-ink-100 px-4 py-2.5 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50"
                    >
                        View all
                    </button>
                </div>
            )}
        </div>
    );
}
