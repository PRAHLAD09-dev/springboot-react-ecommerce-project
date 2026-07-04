import { useState, useEffect } from "react";
import { Flame, Sparkles, Search, SlidersHorizontal, X, PackageSearch, Clock, TrendingUp } from "lucide-react";
import API from "../../services/api";
import HeroCarousel from "../../components/Home/HeroCarousel";
import HorizontalProductSection from "../../components/Home/HorizontalProductSection";
import ProductCard from "../../components/ProductCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import { EmptyState, SkeletonCardGrid, Button } from "../../components/ui";
import { SlideIn } from "../../components/motion/Reveal";

function ProductList() {
    const [keyword, setKeyword] = useState("");
    const [products, setProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showFilters, setShowFilters] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("recentSearches") || "[]");
        } catch {
            return [];
        }
    });

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await API.get("/products", { params: { page: 0, size: 500 } });
                const data = res.data.data;

                const catRes = await API.get("/categories");
                setCategories(catRes.data.data || []);

                const bestRes = await API.get("/products/best-sellers");
                setBestSellers(bestRes.data.data || []);

                const latestRes = await API.get("/products/latest");
                setLatestProducts(latestRes.data.data || []);

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts(data.content || []);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((p) => {
        const search = keyword.toLowerCase().trim();

        const matchesSearch =
            !search ||
            p.name?.toLowerCase()?.includes(search) ||
            p.description?.toLowerCase()?.includes(search) ||
            p.categoryName?.toLowerCase()?.includes(search);

        const matchesCategory = !categoryId || p.categoryName?.toLowerCase() === categoryId.toLowerCase();
        const matchesMin = !minPrice || p.price >= Number(minPrice);
        const matchesMax = !maxPrice || p.price <= Number(maxPrice);

        return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });

    const sortedProducts = [...filteredProducts];

    if (sortBy === "price_asc") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        sortedProducts.sort((a, b) => b.id - a.id);
    }

    const groupedProducts = sortedProducts.reduce((acc, product) => {
        const category = product.categoryName || "Others";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    const resetFilters = () => {
        setCategoryId("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("id");
    };

    const commitSearch = (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        const next = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
        setRecentSearches(next);
        localStorage.setItem("recentSearches", JSON.stringify(next));
    };

    const removeRecentSearch = (term) => {
        const next = recentSearches.filter((s) => s !== term);
        setRecentSearches(next);
        localStorage.setItem("recentSearches", JSON.stringify(next));
    };

    const liveSuggestions = keyword.trim()
        ? products
              .filter((p) => p.name?.toLowerCase().includes(keyword.toLowerCase()))
              .slice(0, 6)
        : [];

    const sortOptions = [
        { value: "id", label: "Latest" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "name", label: "Name: A to Z" },
    ];

    return (
        <div className="container-app py-4 sm:py-6">
            {/* SEARCH + FILTER BAR */}
            <div className="relative mx-auto mb-6 max-w-3xl">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                        <input
                            type="text"
                            placeholder="Search products, brands, categories..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    commitSearch(keyword);
                                    setShowSuggestions(false);
                                    e.target.blur();
                                }
                            }}
                            className="h-12 w-full rounded-2xl border border-ink-200 bg-white pl-11 pr-10 text-sm shadow-xs outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                        />
                        {keyword && (
                            <button
                                onClick={() => setKeyword("")}
                                aria-label="Clear search"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                            >
                                <X size={16} />
                            </button>
                        )}

                        {showSuggestions && (keyword.trim() ? liveSuggestions.length > 0 : recentSearches.length > 0) && (
                            <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-ink-200/70 bg-white p-2 shadow-lg animate-scale-in">
                                {!keyword.trim() && recentSearches.length > 0 && (
                                    <>
                                        <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">Recent searches</p>
                                        {recentSearches.map((term) => (
                                            <div
                                                key={term}
                                                className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-ink-50"
                                            >
                                                <button
                                                    onMouseDown={() => { setKeyword(term); commitSearch(term); setShowSuggestions(false); }}
                                                    className="flex flex-1 items-center gap-2.5 text-left text-sm text-ink-700"
                                                >
                                                    <Clock size={14} className="text-ink-400" /> {term}
                                                </button>
                                                <button
                                                    onMouseDown={() => removeRecentSearch(term)}
                                                    className="rounded-lg p-1 text-ink-300 hover:bg-ink-100 hover:text-ink-600"
                                                    aria-label="Remove"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {keyword.trim() && liveSuggestions.length > 0 && (
                                    <>
                                        <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">Suggestions</p>
                                        {liveSuggestions.map((p) => (
                                            <button
                                                key={p.id}
                                                onMouseDown={() => { setKeyword(p.name); commitSearch(p.name); setShowSuggestions(false); }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
                                            >
                                                <TrendingUp size={14} className="text-brand-400" />
                                                <span className="truncate">{p.name}</span>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-ink-200 bg-white shadow-xs transition-colors hover:bg-ink-50"
                        aria-label="Filters"
                    >
                        <SlidersHorizontal size={18} className="text-ink-600" />
                        {activeFilters > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                                {activeFilters}
                            </span>
                        )}
                    </button>
                </div>

                {showFilters && (
                    <>
                        <div className="fixed inset-0 z-40 bg-ink-950/40 sm:hidden" onClick={() => setShowFilters(false)} />
                        <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-3xl bg-white p-5 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-16 sm:w-[300px] sm:animate-scale-in sm:rounded-2xl sm:border sm:border-ink-200/70">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-ink-900">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="rounded-lg p-1 text-ink-400 hover:bg-ink-100 sm:hidden">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-ink-700">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="input-base"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-ink-700">Price range</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Min ₹"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="input-base"
                                    />
                                    <span className="text-ink-300">—</span>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Max ₹"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="input-base"
                                    />
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-semibold text-ink-700">Sort by</label>
                                <div className="space-y-1">
                                    {sortOptions.map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                                                sortBy === opt.value ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-600 hover:bg-ink-50"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                checked={sortBy === opt.value}
                                                onChange={() => setSortBy(opt.value)}
                                                className="accent-brand-600"
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="secondary" fullWidth onClick={resetFilters}>Reset</Button>
                                <Button fullWidth onClick={() => setShowFilters(false)}>Apply</Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* LOADING */}
            {loading && (
                <div className="space-y-3">
                    <div className="skeleton h-[180px] w-full animate-shimmer rounded-3xl sm:h-[280px]" />
                    <SkeletonCardGrid count={10} />
                </div>
            )}

            {!loading && (
                <>
                    {!isSearching && (
                        <>
                            <HeroCarousel />

                            <HorizontalProductSection
                                title={
                                    <div className="flex items-center gap-2">
                                        <Flame size={20} className="text-orange-500" />
                                        <span>Best Sellers</span>
                                    </div>
                                }
                                products={bestSellers}
                            />

                            <HorizontalProductSection
                                title={
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={20} className="text-brand-500" />
                                        <span>Latest Products</span>
                                    </div>
                                }
                                products={latestProducts}
                            />
                        </>
                    )}

                    {filteredProducts.length === 0 ? (
                        <EmptyState
                            icon={PackageSearch}
                            title="No products found"
                            description="Try adjusting your search or filters to find what you're looking for."
                            action={
                                isSearching && (
                                    <Button variant="secondary" onClick={() => { setKeyword(""); resetFilters(); }}>
                                        Clear search &amp; filters
                                    </Button>
                                )
                            }
                        />
                    ) : (
                        Object.entries(groupedProducts).map(([category, items], index) => (
                            <SlideIn key={category} delay={Math.min(index, 3) * 60}>
                            <div className="mb-8">
                                <div className="mb-4 flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{category}</h2>
                                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                                        {items.length}
                                    </span>
                                </div>

                                <HorizontalScroller>
                                    {items.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </HorizontalScroller>
                            </div>
                            </SlideIn>
                        ))
                    )}
                </>
            )}
        </div>
    );
}

export default ProductList;
