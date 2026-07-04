import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
    return (
        <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-50">
                <ShieldAlert size={28} className="text-warning-500" />
            </div>
            <p className="font-display text-6xl font-extrabold text-ink-900 sm:text-7xl">403</p>
            <h1 className="mt-3 text-xl font-bold text-ink-900 sm:text-2xl">You don't have access to this page</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
                Your account doesn't have permission to view this. Try logging in with a different account.
            </p>
            <Link
                to="/login"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
                Go to login
            </Link>
        </div>
    );
}
