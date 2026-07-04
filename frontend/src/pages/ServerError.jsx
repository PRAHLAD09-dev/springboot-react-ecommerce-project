import { Link } from "react-router-dom";
import { ServerCrash, RotateCw } from "lucide-react";

export default function ServerError() {
    return (
        <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50">
                <ServerCrash size={28} className="text-danger-500" />
            </div>
            <p className="font-display text-6xl font-extrabold text-ink-900 sm:text-7xl">500</p>
            <h1 className="mt-3 text-xl font-bold text-ink-900 sm:text-2xl">Something went wrong on our end</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
                Our servers hit a snag. Please try again in a moment.
            </p>
            <div className="mt-8 flex gap-3">
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                    <RotateCw size={16} /> Try again
                </button>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}
