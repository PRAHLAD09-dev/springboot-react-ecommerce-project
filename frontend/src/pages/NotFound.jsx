import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            <p className="font-display text-8xl font-extrabold text-ink-900 sm:text-9xl">404</p>
            <h1 className="mt-4 text-xl font-bold text-ink-900 sm:text-2xl">This page wandered off</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
                The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
                <Home size={16} /> Back to home
            </Link>
        </div>
    );
}
