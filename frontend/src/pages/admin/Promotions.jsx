import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft, Megaphone, CheckCircle2 } from "lucide-react";
import { Card, Input, Textarea, Button } from "../../components/ui";

function Promotions() {
    const [data, setData] = useState({ title: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const send = async () => {
        setFormError("");
        setSuccess("");
        const next = {};
        if (!data.title) next.title = "Title is required";
        if (!data.message) next.message = "Message is required";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        try {
            setLoading(true);
            await API.post("/admin/promotion", data, { headers: { Authorization: `Bearer ${token}` } });
            setSuccess("Promotion sent to all users");
            setData({ title: "", message: "" });
        } catch (err) {
            console.log(err.response?.data);
            setFormError(err.response?.data?.message || "Failed to send promotion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-xl">
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">Send Promotion</h1>
            </div>

            <Card>
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                        <Megaphone size={20} className="text-brand-600" />
                    </div>
                    <p className="text-sm text-ink-500">Broadcast a promotional message to all users instantly.</p>
                </div>

                <div className="space-y-4">
                    {formError && (
                        <div className="rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{formError}</div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">
                            <CheckCircle2 size={16} /> {success}
                        </div>
                    )}

                    <Input
                        label="Promotion title"
                        placeholder="e.g. Weekend Mega Sale"
                        value={data.title}
                        error={errors.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                    />

                    <Textarea
                        label="Promotion message"
                        placeholder="Write the message users will see..."
                        value={data.message}
                        error={errors.message}
                        rows={5}
                        onChange={(e) => setData({ ...data, message: e.target.value })}
                    />

                    <Button fullWidth size="lg" loading={loading} onClick={send}>
                        Send promotion
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Promotions;
