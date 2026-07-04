import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Store, Settings, Plus, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import FloatingActionButton from "../components/FloatingActionButton";

const items = [
    { to: "/merchant/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/merchant/profile", icon: Store, label: "Profile" },
    { to: "/merchant/products", icon: Package, label: "Products" },
    { to: "/merchant/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/merchant/settings", icon: Settings, label: "Settings" },
];

export default function MerchantShell() {
    const navigate = useNavigate();

    const fabActions = [
        { label: "Add product", icon: Plus, onClick: () => navigate("/merchant/products") },
        { label: "AI generate", icon: Sparkles, onClick: () => navigate("/merchant/products") },
    ];

    return (
        <DashboardLayout title="Merchant" items={items}>
            <Outlet />
            <FloatingActionButton actions={fabActions} />
        </DashboardLayout>
    );
}
