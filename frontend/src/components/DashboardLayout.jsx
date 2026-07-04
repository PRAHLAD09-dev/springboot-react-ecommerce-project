import Sidebar from "./Sidebar";

export default function DashboardLayout({ title, items, children }) {
    return (
        <div className="flex">
            <Sidebar title={title} items={items} />
            <div className="min-w-0 flex-1">
                <div className="container-app py-6 sm:py-8">{children}</div>
            </div>
        </div>
    );
}
