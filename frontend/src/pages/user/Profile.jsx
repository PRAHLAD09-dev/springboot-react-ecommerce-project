import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UpdateProfile from "./UpdateProfile";
import MerchantProfile from "../merchant/MerchantProfile";
import BecomeMerchant from "../merchant/BecomeMerchant";
import ChangePassword from "./ChangePassword";
import Address from "./Address";
import DeleteAccount from "./DeleteAccount";

import {
    User,
    Store,
    Shield,
    MapPin,
    AlertTriangle,
    Mail,
    LogOut,
    UserPlus
} from "lucide-react";

function Profile() {


    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    const [openSection, setOpenSection] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const userRes =
                    await API.get("/user/profile");

                setUser(userRes.data.data);

                try {

                    const merchantRes =
                        await API.get("/merchant/profile");

                    if (
                        merchantRes.data.success
                    ) {
                        setMerchant(
                            merchantRes.data.data
                        );
                    }

                } catch {

                    setMerchant(null);

                }

            }
            catch (err) {

                console.log(err);

            }
            finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);

    const handleLogout = () => {

        localStorage.clear();

        window.dispatchEvent(
            new Event("authChanged")
        );

        window.location.href = "/login";

    };

    if (loading) {

        return (
            <div className="text-center mt-10">
                Loading...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto p-8 space-y-8">

                {/* HEADER */}

                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-4xl font-bold">
                            My Account
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage your account settings
                        </p>

                    </div>
                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => navigate("/signup")}
                            className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        px-5
                                        py-3
                                        rounded-xl
                                        "
                        >

                            <UserPlus size={18} />

                            Add Account

                        </button>

                        <button
                            onClick={handleLogout}
                            className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        px-5
                                        py-3
                                        rounded-xl
                                        "
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                </div>

                {/* USER */}

                <div className="bg-white rounded-3xl border p-6 shadow-sm">

                    {
                        openSection === "profile" ? (

                            <>
                                <div className="flex justify-between items-center">

                                    <div className="flex items-center gap-3">

                                        <User size={26} />

                                        <h2 className="text-2xl font-bold">
                                            Update Profile
                                        </h2>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setOpenSection(null)
                                        }
                                        className="
                        border
                        px-5
                        py-2
                        rounded-xl
                        hover:bg-gray-100
                        "
                                    >
                                        Back
                                    </button>

                                </div>

                                <div className="mt-6 pt-6 border-t">

                                    <UpdateProfile />

                                </div>

                            </>

                        ) : (

                            <>

                                <div className="flex justify-between items-center">

                                    <div>

                                        <div className="flex items-center gap-3 mb-4">

                                            <User size={26} />

                                            <h2 className="text-2xl font-bold">
                                                User Information
                                            </h2>

                                        </div>

                                        <p>
                                            <b>Name:</b> {user.name}
                                        </p>

                                        <p>
                                            <b>Email:</b> {user.email}
                                        </p>

                                        <p>
                                            <b>Role:</b> {user.role}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setOpenSection("profile")
                                        }
                                        className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        "
                                    >
                                        Update Profile
                                    </button>

                                </div>

                            </>

                        )
                    }

                </div>

                {/* MERCHANT */}

                <div className="bg-white rounded-3xl border p-6 shadow-sm">

                    {
                        openSection === "merchant" ? (

                            <>
                                <div className="flex justify-between items-center">

                                    <div className="flex items-center gap-3">

                                        <Store size={26} />

                                        <h2 className="text-2xl font-bold">
                                            Merchant Dashboard
                                        </h2>

                                    </div>

                                    <button
                                        onClick={() => setOpenSection(null)}
                                        className="
                        border
                        px-5
                        py-2
                        rounded-xl
                        hover:bg-gray-100
                        "
                                    >
                                        Back
                                    </button>

                                </div>

                                <div className="mt-6 pt-6 border-t">

                                    <MerchantProfile />

                                </div>

                            </>

                        ) : (

                            <>

                                <div className="flex justify-between items-center">

                                    <div>

                                        <div className="flex items-center gap-3 mb-4">

                                            <Store size={26} />

                                            <h2 className="text-2xl font-bold">
                                                Merchant
                                            </h2>

                                        </div>

                                        {
                                            merchant ? (

                                                <>
                                                    <p>
                                                        <b>Business:</b>{" "}
                                                        {merchant.businessName}
                                                    </p>

                                                    <p className="mt-2">

                                                        <b>Status:</b>

                                                        <span
                                                            className={
                                                                merchant.approved
                                                                    ? "text-green-600 font-semibold ml-2"
                                                                    : "text-yellow-600 font-semibold ml-2"
                                                            }
                                                        >
                                                            {
                                                                merchant.approved
                                                                    ? "Approved"
                                                                    : "Pending Approval"
                                                            }
                                                        </span>

                                                    </p>
                                                </>

                                            ) : (

                                                <p className="text-gray-500">
                                                    No merchant account
                                                </p>

                                            )
                                        }

                                    </div>

                                    {
                                        !merchant ? (

                                            <button
                                                onClick={() =>
                                                    setOpenSection(
                                                        openSection === "becomeMerchant"
                                                            ? null
                                                            : "becomeMerchant"
                                                    )
                                                }
                                                className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                "
                                            >
                                                Become Merchant
                                            </button>

                                        ) : merchant.approved ? (

                                            <button
                                                onClick={() =>
                                                    setOpenSection("merchant")
                                                }
                                                className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                "
                                            >
                                                Merchant Dashboard
                                            </button>

                                        ) : (

                                            <button
                                                disabled
                                                className="
                                bg-yellow-100
                                text-yellow-700
                                px-5
                                py-3
                                rounded-xl
                                cursor-not-allowed
                                "
                                            >
                                                Pending Approval
                                            </button>

                                        )
                                    }

                                </div>

                                {
                                    !merchant &&
                                    openSection === "becomeMerchant" && (

                                        <div className="mt-6 pt-6 border-t">

                                            <BecomeMerchant />

                                        </div>

                                    )
                                }

                            </>

                        )
                    }

                </div>

                {/* SECURITY */}

                <div className="bg-white rounded-3xl border p-6 shadow-sm">

                    <div className="flex justify-between items-center">

                        <div>

                            <div className="flex items-center gap-3 mb-4">

                                <Shield size={26} />

                                <h2 className="text-2xl font-bold">
                                    Security
                                </h2>

                            </div>

                            <p className="text-gray-500">
                                Change your password
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                setOpenSection(
                                    openSection === "password"
                                        ? null
                                        : "password"
                                )
                            }
                            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-2.5
            rounded-xl
            "
                        >
                            Change Password
                        </button>

                    </div>

                    {
                        openSection === "password" && (

                            <div className="mt-6 pt-6 border-t">

                                <ChangePassword />

                            </div>

                        )
                    }

                </div>

                {/* ADDRESS */}

                <div className="bg-white rounded-3xl border p-6 shadow-sm">

                    <div className="flex justify-between items-center">

                        <div>

                            <div className="flex items-center gap-3 mb-4">

                                <MapPin size={26} />

                                <h2 className="text-2xl font-bold">
                                    Saved Addresses
                                </h2>

                            </div>

                            <p className="text-gray-500">
                                Manage delivery addresses
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                setOpenSection(
                                    openSection === "address"
                                        ? null
                                        : "address"
                                )
                            }
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-2.5
                                rounded-xl
                                "
                        >
                            Manage Addresses
                        </button>

                    </div>

                    {
                        openSection === "address" && (

                            <div className="mt-6 pt-6 border-t">

                                <Address />

                            </div>

                        )
                    }

                </div>

                {/* DANGER */}

                <div className="bg-white rounded-3xl border p-6 shadow-sm">

                    <div className="flex justify-between items-center">

                        <div>

                            <div className="flex items-center gap-3 mb-4">

                                <AlertTriangle
                                    className="text-red-600"
                                    size={26}
                                />

                                <h2 className="text-2xl font-bold text-red-600">
                                    Danger Zone
                                </h2>

                            </div>

                            <p className="text-red-500">
                                Deactivate your account and disable login access
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                setOpenSection(
                                    openSection === "delete"
                                        ? null
                                        : "delete"
                                )
                            }
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-2.5
                                rounded-xl
                                "
                        >
                            Delete Account
                        </button>

                    </div>
                    {
                        openSection === "delete" && (

                            <div className="mt-6 pt-6 border-t">

                                <DeleteAccount />

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    );
}

export default Profile;