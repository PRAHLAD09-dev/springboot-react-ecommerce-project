import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 480);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 left-5 z-40 flex h-11 w-11 animate-scale-in items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 shadow-md transition-all hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-lg sm:bottom-8 sm:left-8"
        >
            <ArrowUp size={18} />
        </button>
    );
}
