import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

export default function SessionExpired() {
    const navigate = useNavigate();

    const handleLogin = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-50">
                <Clock size={28} className="text-warning-500" />
            </div>
            <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">Your session has expired</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
                For your security, please log in again to continue.
            </p>
            <button
                onClick={handleLogin}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
                Log in again
            </button>
        </div>
    );
}
