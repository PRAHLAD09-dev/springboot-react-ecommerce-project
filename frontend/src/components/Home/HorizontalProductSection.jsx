import ProductCard from "../ProductCard";
import HorizontalScroller from "../HorizontalScroller";

function HorizontalProductSection({ title, products }) {
    if (!products?.length) {
        return null;
    }

    return (
        <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{title}</h2>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    {products.length}
                </span>
            </div>

            <HorizontalScroller>
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </HorizontalScroller>
        </div>
    );
}

export default HorizontalProductSection;
