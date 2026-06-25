import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Sparkles } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Truck } from "lucide-react";
import { Search, SlidersHorizontal } from "lucide-react";
import API from "../../services/api";
import { COLORS } from "../../constants/colors";
import HeroCarousel from "../../components/Home/HeroCarousel";
import HorizontalProductSection from "../../components/Home/HorizontalProductSection";

function ProductList() {

    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [products, setProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const categoryRef = useRef({});

    const [showFilters, setShowFilters] = useState(false);

    const [categoryId, setCategoryId] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("id");

    const [categories, setCategories] = useState([]);

    const isSearching =
        keyword.trim() !== "" ||
        categoryId !== "" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        sortBy !== "id";

    const activeFilters =
        (categoryId ? 1 : 0) +
        (minPrice ? 1 : 0) +
        (maxPrice ? 1 : 0) +
        (sortBy !== "id" ? 1 : 0);

    const scrollLeft = (category) => {

        categoryRef.current[category]?.scrollBy({
            left: -400,
            behavior: "smooth"
        });

    };

    const scrollRight = (category) => {

        categoryRef.current[category]?.scrollBy({
            left: 400,
            behavior: "smooth"
        });

    };

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const res = await API.get("/products", {
                    params: {
                        page: 0,
                        size: 500,
                    },
                });

                const data = res.data.data;

                const catRes =
                    await API.get("/categories");

                setCategories(
                    catRes.data.data || []
                );
                const bestRes =
                    await API.get("/products/best-sellers");

                setBestSellers(
                    bestRes.data.data || []
                );

                const latestRes =
                    await API.get("/products/latest");

                setLatestProducts(
                    latestRes.data.data || []
                );

                if (Array.isArray(data)) {
                    setProducts(data);
                }
                else {
                    setProducts(
                        data.content || []
                    );
                }

            }
            catch (err) {
                console.log(err);
            }
        };

        fetchProducts();

    }, []);

    if (products.length > 0) {

        console.log(
            "PRODUCT",
            JSON.stringify(
                products[0],
                null,
                2
            )
        );

    }
    const filteredProducts = products.filter((p) => {

        const search =
            keyword.toLowerCase().trim();

        const matchesSearch =
            !search ||
            p.name?.toLowerCase()?.includes(search) ||
            p.description?.toLowerCase()?.includes(search) ||
            p.categoryName?.toLowerCase()?.includes(search);

        const matchesCategory =
            !categoryId ||
            p.categoryName?.toLowerCase() ===
            categoryId.toLowerCase();

        const matchesMin =
            !minPrice ||
            p.price >= Number(minPrice);

        const matchesMax =
            !maxPrice ||
            p.price <= Number(maxPrice);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesMin &&
            matchesMax
        );

    });

    const sortedProducts =
        [...filteredProducts];

    if (sortBy === "price_asc") {

        sortedProducts.sort(
            (a, b) => a.price - b.price
        );

    }
    else if (sortBy === "price_desc") {

        sortedProducts.sort(
            (a, b) => b.price - a.price
        );

    }
    else if (sortBy === "name") {

        sortedProducts.sort(
            (a, b) => a.name.localeCompare(b.name)
        );

    }
    else {

        sortedProducts.sort(
            (a, b) => b.id - a.id
        );

    }

    const groupedProducts = sortedProducts.reduce((acc, product) => {

        const category = product.categoryName || "Others";

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(product);

        return acc;

    }, {});


    return (
        <div className="w-full max-w-7xl mx-auto px-4">

            <div className="max-w-3xl mx-auto mt-3 mb-5">

                <div className="flex items-center gap-2">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(e) =>
                                setKeyword(e.target.value)
                            }
                            className="
                w-full
                h-11
                pl-11
                pr-4
                rounded-xl
                bg-white
                border
                border-gray-200
                shadow-sm
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                "
                        />

                    </div>

                    <button
                        onClick={() =>
                            setShowFilters(!showFilters)
                        }
                        className="
            w-11
            h-11
            rounded-xl
            bg-white
            border
            border-gray-200
            shadow-sm
            hover:bg-gray-50
            transition
            relative
            flex
            items-center
            justify-center
            "
                    >

                        <SlidersHorizontal
                            size={18}
                            className="text-gray-600"
                        />

                        {activeFilters > 0 && (

                            <span
                                className="
                    absolute
                    -top-1
                    -right-1
                    bg-red-500
                    text-white
                    text-[10px]
                    w-4
                    h-4
                    rounded-full
                    flex
                    items-center
                    justify-center
                    "
                            >
                                {activeFilters}
                            </span>

                        )}

                    </button>

                </div>

                {
                    showFilters && (

                        <div
                            className="
            absolute
            right-0
            top-16
            w-[280px]
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-xl
            p-4
            z-50
            "
                        >

                            <h3 className="text-xl font-bold mb-4">
                                Filters
                            </h3>

                            {/* CATEGORY */}

                            <div className="mb-4">

                                <label className="block text-sm font-semibold mb-2">
                                    Category
                                </label>

                                <select
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(
                                            e.target.value
                                        )
                                    }
                                    className="
                    w-full
                    h-10
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    "
                                >
                                    <option value="">
                                        All Categories
                                    </option>

                                    {categories.map((cat) => (

                                        <option
                                            key={cat.id}
                                            value={cat.name}
                                        >
                                            {cat.name}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* PRICE */}

                            <div className="mb-4">

                                <label className="block text-sm font-semibold mb-2">
                                    Price Range
                                </label>

                                <div className="flex items-center gap-2">

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Min ₹"
                                        value={minPrice}
                                        onChange={(e) =>
                                            setMinPrice(
                                                e.target.value
                                            )
                                        }
                                        className="
                        w-full
                        h-10
                        border
                        border-gray-300
                        rounded-lg
                        px-3
                        text-sm
                        "
                                    />

                                    <span className="text-gray-400">
                                        —
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Max ₹"
                                        value={maxPrice}
                                        onChange={(e) =>
                                            setMaxPrice(
                                                e.target.value
                                            )
                                        }
                                        className="
                        w-full
                        h-10
                        border
                        border-gray-300
                        rounded-lg
                        px-3
                        text-sm
                        "
                                    />

                                </div>

                            </div>

                            {/* SORT */}

                            <div className="mb-5">

                                <label className="block text-sm font-semibold mb-2">
                                    Sort By
                                </label>

                                <div className="space-y-2 text-sm">

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={sortBy === "id"}
                                            onChange={() =>
                                                setSortBy("id")
                                            }
                                        />
                                        Latest
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={sortBy === "price_asc"}
                                            onChange={() =>
                                                setSortBy("price_asc")
                                            }
                                        />
                                        Price Low → High
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={sortBy === "price_desc"}
                                            onChange={() =>
                                                setSortBy("price_desc")
                                            }
                                        />
                                        Price High → Low
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={sortBy === "name"}
                                            onChange={() =>
                                                setSortBy("name")
                                            }
                                        />
                                        Name A → Z
                                    </label>

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="flex gap-2">

                                <button
                                    onClick={() => {

                                        setCategoryId("");
                                        setMinPrice("");
                                        setMaxPrice("");
                                        setSortBy("id");

                                    }}
                                    className="
                    flex-1
                    h-10
                    border
                    border-gray-300
                    rounded-lg
                    text-sm
                    font-medium
                    hover:bg-gray-50
                    "
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={() =>
                                        setShowFilters(false)
                                    }
                                    className="
                    flex-1
                    h-10
                    bg-blue-600
                    text-white
                    rounded-lg
                    text-sm
                    font-medium
                    hover:bg-blue-700
                    "
                                >
                                    Apply
                                </button>

                            </div>

                        </div>

                    )
                }
            </div>

            {
                !isSearching && (
                    <>
                        <HeroCarousel />

                        <HorizontalProductSection
                            title={
                                <div className="flex items-center gap-2">
                                    <Flame
                                        size={20}
                                        className="text-orange-500"
                                    />
                                    <span>
                                        Best Sellers
                                    </span>
                                </div>
                            }
                            products={bestSellers}
                        />

                        <HorizontalProductSection
                            title={
                                <div className="flex items-center gap-2">
                                    <Sparkles
                                        size={20}
                                        className="text-blue-500"
                                    />
                                    <span>
                                        Latest Products
                                    </span>
                                </div>
                            }
                            products={latestProducts}
                        />
                    </>
                )
            }

            {
                filteredProducts.length === 0 ? (

                    <p className="text-center text-gray-500">
                        No products found
                    </p>

                ) : (

                    <>
                        {
                            Object.entries(groupedProducts)
                                .map(([category, items]) => (

                                    <div
                                        key={category}
                                        className="mb-6"
                                    >

                                        <div className="flex items-center justify-between mb-3">

                                            <div className="flex items-center gap-2">

                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {category}
                                                </h2>

                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                    {items.length}
                                                </span>

                                            </div>


                                        </div>
                                        <div className="relative">
                                            <div
                                                ref={(el) =>
                                                    categoryRef.current[category] = el
                                                }
                                                className="flex gap-3 overflow-x-hidden scroll-smooth pb-3 px-12"
                                            >
                                                <button
                                                    onClick={() => scrollLeft(category)}
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>

                                                {items.map((p) => (

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
                                                    onClick={() => scrollRight(category)}
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>

                                            </div>

                                        </div>
                                    </div>



                                ))
                        }

                    </>
                )
            }

        </div >

    );
}

export default ProductList;