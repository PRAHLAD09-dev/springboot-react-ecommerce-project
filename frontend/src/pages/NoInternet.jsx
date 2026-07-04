import { WifiOff, RotateCw } from "lucide-react";

export default function NoInternet() {
    return (
        <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
                <WifiOff size={28} className="text-ink-500" />
            </div>
            <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">No internet connection</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
                Please check your network settings and try again.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
                <RotateCw size={16} /> Retry
            </button>
        </div>
    );
}
