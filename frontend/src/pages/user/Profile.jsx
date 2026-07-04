import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UpdateProfile from "./UpdateProfile";
import MerchantProfile from "../merchant/MerchantProfile";
import BecomeMerchant from "../merchant/BecomeMerchant";
import ChangePassword from "./ChangePassword";
import Address from "./Address";
import DeleteAccount from "./DeleteAccount";

import { User, Store, Shield, MapPin, AlertTriangle, LogOut, UserPlus } from "lucide-react";
import { Avatar, Badge, Button, PageLoader } from "../../components/ui";

function SettingsCard({ icon, title, description, danger, children, action }) {
    const Icon = icon;
    return (
        <div className="card-surface p-5 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${danger ? "bg-danger-50" : "bg-brand-50"}`}>
                        <Icon size={20} className={danger ? "text-danger-600" : "text-brand-600"} />
                    </div>
                    <div>
                        <h2 className={`text-lg font-bold ${danger ? "text-danger-600" : "text-ink-900"}`}>{title}</h2>
                        {description}
                    </div>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openSection, setOpenSection] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get("/user/profile");
                setUser(userRes.data.data);

                try {
                    const merchantRes = await API.get("/merchant/profile");
                    if (merchantRes.data.success) {
                        setMerchant(merchantRes.data.data);
                    }
                } catch {
                    setMerchant(null);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("authChanged"));
        window.location.href = "/login";
    };

    const toggle = (section) => setOpenSection((s) => (s === section ? null : section));

    if (loading) return <PageLoader label="Loading your account" />;

    return (
        <div className="container-app py-6 sm:py-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar name={user?.name || user?.email} size="xl" />
                    <div>
                        <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">{user?.name || "My Account"}</h1>
                        <p className="mt-0.5 text-sm text-ink-500">{user?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button variant="secondary" icon={UserPlus} onClick={() => navigate("/signup")}>
                        Add account
                    </Button>
                    <Button variant="danger" icon={LogOut} onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="space-y-5">
                {/* USER INFO */}
                <SettingsCard
                    icon={User}
                    title={openSection === "profile" ? "Update profile" : "User information"}
                    description={
                        openSection !== "profile" && (
                            <div className="mt-1.5 space-y-1 text-sm text-ink-600">
                                <p><span className="font-semibold text-ink-800">Name:</span> {user?.name}</p>
                                <p><span className="font-semibold text-ink-800">Email:</span> {user?.email}</p>
                                <p><span className="font-semibold text-ink-800">Role:</span> <Badge variant="brand" className="ml-1 capitalize">{user?.role?.toLowerCase()}</Badge></p>
                            </div>
                        )
                    }
                    action={
                        <Button
                            variant={openSection === "profile" ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => toggle("profile")}
                        >
                            {openSection === "profile" ? "Back" : "Edit profile"}
                        </Button>
                    }
                >
                    {openSection === "profile" && <UpdateProfile />}
                </SettingsCard>

                {/* MERCHANT */}
                <SettingsCard
                    icon={Store}
                    title={openSection === "merchant" ? "Merchant dashboard" : "Merchant"}
                    description={
                        openSection !== "merchant" && (
                            <div className="mt-1.5 text-sm text-ink-600">
                                {merchant ? (
                                    <>
                                        <p><span className="font-semibold text-ink-800">Business:</span> {merchant.businessName}</p>
                                        <p className="mt-1">
                                            <span className="font-semibold text-ink-800">Status:</span>{" "}
                                            <Badge variant={merchant.approved ? "success" : "warning"}>
                                                {merchant.approved ? "Approved" : "Pending approval"}
                                            </Badge>
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-ink-500">No merchant account</p>
                                )}
                            </div>
                        )
                    }
                    action={
                        openSection === "merchant" ? (
                            <Button variant="secondary" size="sm" onClick={() => toggle("merchant")}>Back</Button>
                        ) : !merchant ? (
                            <Button variant="success" size="sm" onClick={() => toggle("becomeMerchant")}>Become merchant</Button>
                        ) : merchant.approved ? (
                            <Button size="sm" onClick={() => navigate("/merchant/dashboard")}>Merchant dashboard</Button>
                        ) : (
                            <Button size="sm" variant="secondary" disabled>Pending approval</Button>
                        )
                    }
                >
                    {openSection === "merchant" && <MerchantProfile />}
                    {!merchant && openSection === "becomeMerchant" && (
                        <div className="mt-6 border-t border-ink-100 pt-6">
                            <BecomeMerchant />
                        </div>
                    )}
                </SettingsCard>

                {/* SECURITY */}
                <SettingsCard
                    icon={Shield}
                    title="Security"
                    description={openSection !== "password" && <p className="mt-1 text-sm text-ink-500">Change your password</p>}
                    action={
                        <Button variant={openSection === "password" ? "secondary" : "primary"} size="sm" onClick={() => toggle("password")}>
                            {openSection === "password" ? "Close" : "Change password"}
                        </Button>
                    }
                >
                    {openSection === "password" && <ChangePassword />}
                </SettingsCard>

                {/* ADDRESS */}
                <SettingsCard
                    icon={MapPin}
                    title="Saved addresses"
                    description={openSection !== "address" && <p className="mt-1 text-sm text-ink-500">Manage delivery addresses</p>}
                    action={
                        <Button variant={openSection === "address" ? "secondary" : "primary"} size="sm" onClick={() => toggle("address")}>
                            {openSection === "address" ? "Close" : "Manage addresses"}
                        </Button>
                    }
                >
                    {openSection === "address" && <Address />}
                </SettingsCard>

                {/* DANGER */}
                <SettingsCard
                    icon={AlertTriangle}
                    danger
                    title="Danger zone"
                    description={openSection !== "delete" && <p className="mt-1 text-sm text-danger-500">Deactivate your account and disable login access</p>}
                    action={
                        <Button variant={openSection === "delete" ? "secondary" : "danger"} size="sm" onClick={() => toggle("delete")}>
                            {openSection === "delete" ? "Close" : "Delete account"}
                        </Button>
                    }
                >
                    {openSection === "delete" && <DeleteAccount />}
                </SettingsCard>
            </div>
        </div>
    );
}

export default Profile;
