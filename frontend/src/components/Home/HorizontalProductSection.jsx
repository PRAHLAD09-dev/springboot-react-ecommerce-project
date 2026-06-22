import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";
import { Truck, ChevronLeft, ChevronRight } from "lucide-react";

function HorizontalProductSection({
    title,
    products
}) {

    const navigate = useNavigate();

    const sectionRef = useRef();

    const scrollLeft = () => {

        sectionRef.current?.scrollBy({
            left: -400,
            behavior: "smooth"
        });

    };

    const scrollRight = () => {

        sectionRef.current?.scrollBy({
            left: 400,
            behavior: "smooth"
        });

    };

    if (!products?.length) {
        return null;
    }

    return (

        <div className="mb-10">

            <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-2">

                    <h2 className="text-2xl font-bold text-slate-900">
                        {title}
                    </h2>

                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {products.length}
                    </span>

                </div>

            </div>

            <div className="relative">

                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50"
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={sectionRef}
                    className="flex gap-3 overflow-x-hidden scroll-smooth pb-3 px-12"
                >

                    {products.map((p) => (

                        <div
                            key={p.id}
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="
                                w-[240px]
                                min-w-[240px]
                                bg-white
                                rounded-2xl
                                border border-gray-200
                                shadow-sm
                                hover:shadow-lg
                                hover:-translate-y-1
                                transition-all duration-300
                                cursor-pointer
                                overflow-hidden
                                flex-shrink-0
                                "
                        >

                            <div className="relative h-[200px] bg-white p-2 flex items-end justify-center overflow-hidden">

                                {
                                    p.discountPercentage > 0 && (
                                        <span className="absolute top-3 left-3 bg-green-600 text-white text-[11px] font-semibold px-2 py-1 rounded-md z-10">
                                            {p.discountPercentage}% OFF
                                        </span>
                                    )
                                }

                                <span
                                    className="
                                     absolute
                                     bottom-3
                                     left-3
                                     bg-green-600
                                     text-white
                                     px-2 py-1
                                     rounded-md
                                     text-[12px]
                                      font-semibold
                                      flex items-center gap-1
                                        z-10
                                       "
                                >
                                    {Number(p.averageRating || 0).toFixed(1)}
                                    ★
                                </span>

                                <img
                                    src={p.imageUrls?.[0]}
                                    alt={p.name}
                                    className="
                                                                w-full
                                                                h-full
                                                                object-contain
                                                                scale-110
                                                                hover:scale-115
                                                                transition
                                                                duration-300
                                                                "
                                />

                            </div>

                            <div className="px-3 pt-1 pb-2">

                                <h3 className="text-[15px] font-medium text-gray-800 line-clamp-2">
                                    {p.name || "Unknown Product"}
                                </h3>

                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">

                                    <span className="text-[18px] font-bold text-slate-900">
                                        ₹{Number(p.price).toLocaleString("en-IN")}
                                    </span>

                                    {
                                        p.mrp > p.price && (
                                            <span className="text-gray-400 line-through text-[14px]">
                                                ₹{Number(p.mrp).toLocaleString("en-IN")}
                                            </span>
                                        )
                                    }

                                </div>

                                {
                                    p.colors?.length > 0 && (

                                        <div className="flex flex-wrap gap-2 mt-2">

                                            {
                                                p.colors.slice(0, 2).map(color => {

                                                    const colorObj =
                                                        COLORS.find(c => c.name === color);

                                                    return (

                                                        <span
                                                            key={color}
                                                            className="flex items-center gap-1 text-[12px] text-gray-700"
                                                        >

                                                            <span
                                                                className="w-3 h-3 rounded-full border"
                                                                style={{
                                                                    backgroundColor:
                                                                        colorObj?.hex || "#ccc"
                                                                }}
                                                            />

                                                            {color}

                                                        </span>

                                                    );

                                                })
                                            }

                                            {
                                                p.colors.length > 2 && (

                                                    <span className="text-[12px] text-gray-500">
                                                        +{p.colors.length - 2}
                                                    </span>

                                                )
                                            }

                                        </div>

                                    )
                                }

                                <div className="flex items-center justify-between mt-2">

                                    <div className="flex items-center gap-1 text-blue-600 text-[13px] font-medium mt-1">

                                        <Truck size={14} />

                                        <span>
                                            Free Delivery
                                        </span>

                                    </div>

                                    {
                                        p.stock <= 5 && (

                                            <span className="text-red-500 text-[12px] font-semibold">
                                                Only {p.stock} Left
                                            </span>

                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    ))}

                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50"
                    >
                        <ChevronRight size={20} />
                    </button>


                </div>

            </div>

        </div >

    );
}

export default HorizontalProductSection;