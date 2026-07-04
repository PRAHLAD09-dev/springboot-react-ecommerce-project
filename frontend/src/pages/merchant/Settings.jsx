import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Lock, Bell, ShieldAlert, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui";
import MerchantUpdate from "./MerchantUpdate";
import MerchantDelete from "./MerchantDelete";

function SettingsRow({ icon, title, description, active, onClick }) {
    const Icon = icon;
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                active ? "border-brand-300 bg-brand-50" : "border-ink-100 hover:bg-ink-50"
            }`}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-white text-brand-600" : "bg-ink-100 text-ink-500"}`}>
                <Icon size={17} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900">{title}</p>
                <p className="truncate text-sm text-ink-500">{description}</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-ink-400" />
        </button>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <button
            onClick={onChange}
            role="switch"
            aria-checked={checked}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-600" : "bg-ink-200"}`}
        >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
        </button>
    );
}

function Settings() {
    const navigate = useNavigate();
    const [section, setSection] = useState("business");

    const [notifyOrders, setNotifyOrders] = useState(true);
    const [notifyPromotions, setNotifyPromotions] = useState(false);
    const [notifyLowStock, setNotifyLowStock] = useState(true);

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-ink-950 sm:text-3xl">Store settings</h1>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* NAV */}
                <div className="space-y-2.5">
                    <SettingsRow icon={Store} title="Business info" description="Store name & details" active={section === "business"} onClick={() => setSection("business")} />
                    <SettingsRow icon={Bell} title="Notifications" description="Alert preferences" active={section === "notifications"} onClick={() => setSection("notifications")} />
                    <SettingsRow icon={Lock} title="Password" description="Update account password" active={section === "password"} onClick={() => navigate("/change-password")} />
                    <SettingsRow icon={ShieldAlert} title="Danger zone" description="Deactivate merchant account" active={section === "danger"} onClick={() => setSection("danger")} />
                </div>

                {/* CONTENT */}
                <div>
                    {section === "business" && <MerchantUpdate />}

                    {section === "notifications" && (
                        <Card>
                            <h2 className="mb-5 text-lg font-bold text-ink-900">Notification preferences</h2>
                            <div className="divide-y divide-ink-100">
                                <div className="flex items-center justify-between py-3.5">
                                    <div>
                                        <p className="font-medium text-ink-800">Order updates</p>
                                        <p className="text-sm text-ink-500">Get notified for new & updated orders</p>
                                    </div>
                                    <Toggle checked={notifyOrders} onChange={() => setNotifyOrders((v) => !v)} />
                                </div>
                                <div className="flex items-center justify-between py-3.5">
                                    <div>
                                        <p className="font-medium text-ink-800">Low stock alerts</p>
                                        <p className="text-sm text-ink-500">Alert when products run low</p>
                                    </div>
                                    <Toggle checked={notifyLowStock} onChange={() => setNotifyLowStock((v) => !v)} />
                                </div>
                                <div className="flex items-center justify-between py-3.5">
                                    <div>
                                        <p className="font-medium text-ink-800">Promotions & tips</p>
                                        <p className="text-sm text-ink-500">Platform news and seller tips</p>
                                    </div>
                                    <Toggle checked={notifyPromotions} onChange={() => setNotifyPromotions((v) => !v)} />
                                </div>
                            </div>
                        </Card>
                    )}

                    {section === "danger" && <MerchantDelete />}
                </div>
            </div>
        </div>
    );
}

export default Settings;
