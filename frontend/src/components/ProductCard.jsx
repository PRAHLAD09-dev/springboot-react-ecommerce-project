import { useNavigate } from "react-router-dom";
import { Heart, Star, Truck } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../constants/colors";

export default function ProductCard({ product: p, className = "" }) {
    const navigate = useNavigate();
    const [wished, setWished] = useState(false);

    return (
        <div
            onClick={() => navigate(`/product/${p.id}`)}
            className={`group w-[200px] min-w-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:w-[240px] sm:min-w-[240px] ${className}`}
        >
            <div className="relative flex h-[180px] items-center justify-center overflow-hidden bg-ink-50 p-3 sm:h-[200px]">
                {p.discountPercentage > 0 && (
                    <span className="absolute left-3 top-3 z-10 rounded-md bg-success-600 px-2 py-1 text-[11px] font-semibold text-white">
                        {p.discountPercentage}% OFF
                    </span>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setWished((w) => !w);
                    }}
                    aria-label="Add to wishlist"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur transition-colors hover:bg-white"
                >
                    <Heart size={15} className={wished ? "fill-danger-500 text-danger-500" : "text-ink-400"} />
                </button>

                {p.averageRating > 0 && (
                    <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-md bg-ink-950/80 px-2 py-1 text-[11px] font-semibold text-white">
                        {Number(p.averageRating).toFixed(1)}
                        <Star size={10} className="fill-warning-400 text-warning-400" />
                    </span>
                )}

                <img
                    src={p.imageUrls?.[0]}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full scale-100 object-contain transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="px-3 pb-3 pt-2.5">
                <h3 className="line-clamp-2 min-h-[2.5em] text-[13.5px] font-medium leading-snug text-ink-800">
                    {p.name || "Unknown Product"}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[17px] font-bold text-ink-950">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                    </span>
                    {p.mrp > p.price && (
                        <span className="text-[13px] text-ink-400 line-through">
                            ₹{Number(p.mrp).toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                {p.colors?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {p.colors.slice(0, 3).map((color) => {
                            const colorObj = COLORS.find((c) => c.name === color);
                            return (
                                <span
                                    key={color}
                                    title={color}
                                    className="h-3.5 w-3.5 rounded-full border border-ink-200"
                                    style={{ backgroundColor: colorObj?.hex || "#ccc" }}
                                />
                            );
                        })}
                        {p.colors.length > 3 && (
                            <span className="text-[11px] font-medium text-ink-400">+{p.colors.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[12px] font-medium text-brand-600">
                        <Truck size={13} />
                        Free delivery
                    </div>

                    {p.stock > 0 && p.stock <= 5 && (
                        <span className="text-[11px] font-semibold text-danger-500">Only {p.stock} left</span>
                    )}
                    {p.stock === 0 && (
                        <span className="text-[11px] font-semibold text-ink-400">Out of stock</span>
                    )}
                </div>
            </div>
        </div>
    );
}
