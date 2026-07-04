import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalScroller({ children }) {
    const ref = useRef(null);

    const scroll = (dir) => {
        ref.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
    };

    return (
        <div className="group/scroller relative">
            <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white shadow-md transition-opacity hover:bg-brand-50 sm:flex"
            >
                <ChevronLeft size={18} />
            </button>

            <div
                ref={ref}
                className="flex gap-3 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-11 [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>

            <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-200 bg-white shadow-md transition-opacity hover:bg-brand-50 sm:flex"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
