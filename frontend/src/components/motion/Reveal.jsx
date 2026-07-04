import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect prefers-reduced-motion: reveal immediately, no observed animation delay
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}

export function FadeIn({ children, delay = 0, className = "" }) {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${inView ? "opacity-100" : "opacity-0"} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export function SlideIn({ children, delay = 0, direction = "up", className = "" }) {
    const [ref, inView] = useInView();
    const offset = {
        up: "translate-y-6",
        down: "-translate-y-6",
        left: "translate-x-6",
        right: "-translate-x-6",
    }[direction];

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${inView ? "translate-x-0 translate-y-0 opacity-100" : `${offset} opacity-0`} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export function ScaleIn({ children, delay = 0, className = "" }) {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-500 ease-out ${inView ? "scale-100 opacity-100" : "scale-95 opacity-0"} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export function StaggerContainer({ children, staggerMs = 60, className = "" }) {
    const items = Array.isArray(children) ? children : [children];
    return (
        <div className={className}>
            {items.map((child, i) => (
                <FadeIn key={child?.key ?? i} delay={i * staggerMs}>
                    {child}
                </FadeIn>
            ))}
        </div>
    );
}
