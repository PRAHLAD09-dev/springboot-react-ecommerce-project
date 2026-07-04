import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function SplashScreen({ onFinish }) {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const step = setInterval(() => {
            setProgress((p) => (p >= 100 ? 100 : p + 2));
        }, 48);

        const fadeTimer = setTimeout(() => setFadeOut(true), 2600);
        const doneTimer = setTimeout(() => onFinish?.(), 3000);

        return () => {
            clearInterval(step);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-ink-950 via-brand-950 to-ink-950 transition-opacity duration-500 ${
                fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
        >
            {/* GLOW PARTICLES */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-brand-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-80 w-80 animate-pulse rounded-full bg-brand-400/20 blur-3xl [animation-delay:0.6s]" />
                <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 animate-pulse rounded-full bg-brand-300/10 blur-3xl [animation-delay:1.2s]" />
            </div>

            {/* LOGO */}
            <div className="relative z-10 flex animate-scale-in flex-col items-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-xl sm:h-24 sm:w-24">
                    <ShoppingBag size={38} className="text-white" strokeWidth={2.2} />
                </div>

                <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Commerce<span className="text-brand-400">Hub</span>
                </h1>
                <p className="mt-2 text-sm text-ink-300">Shop smarter, everywhere</p>
            </div>

            {/* PROGRESS */}
            <div className="absolute bottom-16 z-10 w-52 sm:w-64">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-300 transition-all duration-150 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
