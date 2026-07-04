import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users2, ShoppingCart, Store, Grid3X3, BadgePercent } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const items = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", group: "Overview" },
    { to: "/admin/users", icon: Users2, label: "Users", group: "Management" },
    { to: "/admin/merchants", icon: Store, label: "Merchants", group: "Management" },
    { to: "/admin/orders", icon: ShoppingCart, label: "Orders", group: "Management" },
    { to: "/admin/categories", icon: Grid3X3, label: "Categories", group: "Catalog" },
    { to: "/admin/promotions", icon: BadgePercent, label: "Promotions", group: "Catalog" },
];

export default function AdminShell() {
    return (
        <DashboardLayout title="Admin" items={items}>
            <Outlet />
        </DashboardLayout>
    );
}
