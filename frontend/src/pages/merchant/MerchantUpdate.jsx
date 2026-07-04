import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Store, CheckCircle2 } from "lucide-react";
import { Card, Input, Button, PageLoader } from "../../components/ui";

function MerchantUpdate() {
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMerchant = async () => {
            try {
                const res = await API.get("/merchant/profile");
                if (res.data.success) {
                    setBusinessName(res.data.data.businessName || "");
                }
            } catch (err) {
                console.log(err);
                setError("Failed to load merchant profile");
            } finally {
                setLoading(false);
            }
        };

        fetchMerchant();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setSaving(true);
            const res = await API.put("/merchant/profile", { businessName });
            setSuccess(res.data.message || "Profile updated");
            setTimeout(() => navigate("/merchant/profile"), 800);
        } catch (err) {
            console.log(err);
            setError("Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader label="Loading profile" />;

    return (
        <div className="mx-auto flex max-w-md flex-col items-center py-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                <Store size={22} />
            </div>
            <h1 className="mb-6 text-xl font-bold text-ink-900">Update Merchant Profile</h1>

            <Card className="w-full">
                <form onSubmit={handleUpdate} className="space-y-4">
                    {error && (
                        <div className="rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">
                            <CheckCircle2 size={16} /> {success}
                        </div>
                    )}

                    <Input
                        label="Business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your business name"
                    />

                    <Button type="submit" fullWidth size="lg" loading={saving}>
                        Update profile
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default MerchantUpdate;
