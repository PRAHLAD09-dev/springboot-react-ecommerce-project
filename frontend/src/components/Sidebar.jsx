import { NavLink } from "react-router-dom";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ title = "Panel", items = [] }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`sticky top-16 hidden h-[calc(100vh-64px)] shrink-0 flex-col border-r border-ink-200/70 bg-white transition-all duration-300 lg:top-[72px] lg:flex lg:h-[calc(100vh-72px)] ${
                collapsed ? "w-[76px]" : "w-64"
            }`}
        >
            <div className="flex items-center justify-between px-4 py-5">
                {!collapsed && <p className="text-xs font-bold uppercase tracking-wider text-ink-400">{title}</p>}
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
                </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
                {(() => {
                    const hasGroups = items.some((i) => i.group);
                    if (!hasGroups) return items.map((item) => <SidebarLink key={item.to} item={item} collapsed={collapsed} />);

                    const groups = [];
                    items.forEach((item) => {
                        const g = item.group || "";
                        let bucket = groups.find((b) => b.name === g);
                        if (!bucket) {
                            bucket = { name: g, items: [] };
                            groups.push(bucket);
                        }
                        bucket.items.push(item);
                    });

                    return groups.map((g) => (
                        <div key={g.name} className="mb-3">
                            {g.name && !collapsed && (
                                <p className="mb-1.5 mt-3 px-3 text-[10px] font-bold uppercase tracking-wider text-ink-300">{g.name}</p>
                            )}
                            {g.items.map((item) => <SidebarLink key={item.to} item={item} collapsed={collapsed} />)}
                        </div>
                    ));
                })()}
            </nav>
        </aside>
    );
}

function SidebarLink({ item: { to, icon, label }, collapsed }) {
    const Icon = icon;
    return (
        <NavLink
            to={to}
            end
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                } ${collapsed ? "justify-center" : ""}`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && <span className="absolute left-0 h-5 w-1 rounded-r-full bg-brand-600" />}
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                </>
            )}
        </NavLink>
    );
}
