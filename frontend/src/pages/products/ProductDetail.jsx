import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";
import { COLORS } from "../../constants/colors";
import {
    Truck,
    Star,
    BadgeCheck,
    MessageSquare,
    ImageIcon,
    Package,
    Tag,
    ArrowLeft,
    X,
    ShoppingCart,
    Zap,
    ZoomIn,
    ShieldCheck
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import { Badge, Button, Modal, EmptyState, PageLoader, Pagination } from "../../components/ui";
import { PackageX } from "lucide-react";
import { getAddressTypeInfo } from "../../utils/addressType";
import { useToast } from "../../components/motion/useToast";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [recentProducts, setRecentProducts] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewImages, setReviewImages] = useState([]);

    const [selectedColor, setSelectedColor] = useState("");
    const [reviewPage, setReviewPage] = useState(1);
    const REVIEWS_PER_PAGE = 5;
    const [addingToCart, setAddingToCart] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const toast = useToast();

    const showToast = (msg, variant = "info") => toast[variant] ? toast[variant](msg) : toast.info(msg);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/products/${id}`);
                setProduct(res.data.data);

                if (res.data.data.colors && res.data.data.colors.length > 0) {
                    setSelectedColor(res.data.data.colors[0]);
                }

                const similar = await API.get(`/products/${id}/similar`);
                setSimilarProducts(similar.data.data);

                const viewed = JSON.parse(localStorage.getItem("recentProducts") || "[]");
                const updated = [res.data.data, ...viewed.filter((p) => p.id !== res.data.data.id)].slice(0, 6);

                localStorage.setItem("recentProducts", JSON.stringify(updated));
                setRecentProducts(updated.filter((p) => p.id !== res.data.data.id));
            } catch (err) {
                console.log(err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        fetchReviews();
        setSelectedImage(0);
        window.scrollTo({ top: 0 });
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await API.get(`/reviews/product/${id}`);
            setReviews(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setAddingToCart(true);
            await API.post("/cart/add", null, {
                params: { productId: product.id, quantity: 1, selectedColor },
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast("Added to cart", "success");
        } catch (err) {
            console.log(err);
            showToast("Failed to add to cart", "error");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await API.get("/user/address");
            setAddresses(res.data.data);
            setShowAddressModal(true);
        } catch (err) {
            console.log(err);
            showToast("Failed to load addresses", "error");
        }
    };

    const handlePlaceOrder = async () => {
        try {
            setPlacingOrder(true);
            const token = localStorage.getItem("token");

            await API.post("/cart/add", null, {
                params: { productId: product.id, quantity: 1, selectedColor }
            });

            const res = await API.post(
                `/user/orders/place?addressId=${selectedAddressId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const orderId = res.data.data.orderId;
            navigate(`/payment/${orderId}`);
        } catch (err) {
            console.log(err);
            showToast("Order failed", "error");
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleReviewSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setSubmittingReview(true);
            const formData = new FormData();
            formData.append("rating", rating);
            formData.append("comment", comment);
            reviewImages.forEach((file) => formData.append("images", file));

            await API.post(`/reviews/product/${product.id}`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });

            showToast("Review added successfully", "success");
            setComment("");
            setRating(5);
            setReviewImages([]);
            setShowReviewForm(false);
            setReviewPage(1);
            fetchReviews();
        } catch (err) {
            console.log(err);
            showToast(err.response?.data?.message || "Failed to add review", "error");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <PageLoader label="Loading product" />;

    if (notFound || !product) {
        return (
            <div className="container-app py-16">
                <EmptyState
                    icon={PackageX}
                    title="Product not found"
                    description="This product may have been removed or the link is incorrect."
                    action={
                        <Button onClick={() => navigate("/")}>Back to home</Button>
                    }
                />
            </div>
        );
    }

    const specifications = JSON.parse(product.specificationsJson || "[]");
    const highlights = JSON.parse(product.featureHighlightsJson || "[]");

    return (
        <div className="container-app py-6 sm:py-8">
            {/* TOAST */}
            {/* Toasts are now rendered globally via ToastProvider */}

            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
                <ArrowLeft size={20} />
            </button>

            {/* MAIN */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* GALLERY */}
                <div className="card-surface p-4 sm:p-5 lg:col-span-4">
                    <button
                        onClick={() => setShowPreview(true)}
                        aria-label="Zoom product image"
                        className="group relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-white sm:h-[420px] lg:h-[460px]"
                    >
                        <img
                            src={product.imageUrls?.[selectedImage]}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-ink-950/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <ZoomIn size={13} /> Click to zoom
                        </span>
                    </button>

                    <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                        {product.imageUrls?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                aria-label={`View image ${index + 1}`}
                                aria-pressed={selectedImage === index}
                                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-20 ${
                                    selectedImage === index ? "border-brand-500" : "border-ink-200 hover:border-ink-300"
                                }`}
                            >
                                <img src={img} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* DETAILS */}
                <div className="card-surface p-5 sm:p-6 lg:col-span-5">
                    <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">{product.name}</h1>
                    <p className="mt-3 leading-relaxed text-ink-600">{product.aiDescription}</p>

                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-ink-600">
                            <Tag size={15} /> <span>{product.categoryName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-ink-600">
                            <Package size={15} /> <span>Stock: {product.stock}</span>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <span className="flex items-center gap-1 rounded-lg bg-success-600 px-3 py-1.5 text-sm font-semibold text-white">
                            <Star size={13} fill="white" /> {product.averageRating || 0}
                        </span>
                        <span className="text-sm font-medium text-ink-500">{product.totalReviews || 0} reviews</span>
                    </div>
                </div>

                {/* BUY BOX */}
                <div className="lg:col-span-3">
                    <div className="card-surface sticky top-24 p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold text-ink-950 sm:text-4xl">
                                ₹{Number(product.price).toLocaleString("en-IN")}
                            </h2>
                            {product.discountPercentage > 0 && <Badge variant="success">{product.discountPercentage}% OFF</Badge>}
                        </div>

                        {product.mrp > 0 && (
                            <p className="mt-1 text-lg text-ink-400 line-through">₹{Number(product.mrp).toLocaleString("en-IN")}</p>
                        )}

                        <p className="mt-3 font-semibold text-success-600">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500">
                            <Truck size={14} /> FREE delivery
                        </p>

                        {product.colors?.length > 0 && (
                            <div className="mt-5">
                                <h3 className="mb-3 text-sm font-semibold text-ink-800">Select color</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.colors.map((colorName) => {
                                        const colorObj = COLORS.find((c) => c.name === colorName);
                                        return (
                                            <button
                                                key={colorName}
                                                title={colorName}
                                                aria-label={`Select color ${colorName}`}
                                                aria-pressed={selectedColor === colorName}
                                                onClick={() => setSelectedColor(colorName)}
                                                className={`h-9 w-9 rounded-full border-2 transition-transform ${
                                                    selectedColor === colorName ? "scale-110 border-ink-900" : "border-ink-200"
                                                }`}
                                                style={{ backgroundColor: colorObj?.hex || "#ccc" }}
                                            />
                                        );
                                    })}
                                </div>
                                {selectedColor && (
                                    <p className="mt-2.5 text-sm text-ink-500">
                                        Selected: <span className="font-semibold text-ink-800">{selectedColor}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mt-6 space-y-2.5">
                            <Button variant="warning" fullWidth size="lg" icon={ShoppingCart} loading={addingToCart} onClick={handleAddToCart} className="!rounded-full">
                                Add to cart
                            </Button>
                            <Button fullWidth size="lg" icon={Zap} onClick={handleBuyNow} className="!rounded-full !bg-ink-900 hover:!bg-ink-950">
                                Buy now
                            </Button>
                        </div>

                        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
                            <ShieldCheck size={13} /> Secure checkout
                        </p>
                    </div>
                </div>
            </div>

            {/* SPECS + HIGHLIGHTS */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="card-surface p-6">
                    <h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-bold text-ink-900">Specifications</h2>
                    {specifications.length === 0 ? (
                        <p className="text-ink-500">No specifications available</p>
                    ) : (
                        <ul className="space-y-2.5">
                            {specifications.map((item, index) => (
                                <li key={index} className="flex items-start gap-2.5 border-b border-ink-50 pb-2.5 text-ink-700">
                                    <span className="mt-0.5 text-success-600">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="card-surface p-6">
                    <h2 className="mb-4 border-b border-ink-100 pb-3 text-xl font-bold text-ink-900">Feature highlights</h2>
                    {highlights.length === 0 ? (
                        <p className="text-ink-500">No highlights available</p>
                    ) : (
                        <ul className="space-y-2.5">
                            {highlights.map((item, index) => (
                                <li key={index} className="flex items-start gap-2.5 border-b border-ink-50 pb-2.5 text-ink-700">
                                    <span className="mt-0.5 text-brand-600">★</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* REVIEWS */}
            <div id="reviews" className="card-surface mt-8 p-5 sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <MessageSquare size={24} className="text-brand-600" />
                            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">Reviews & ratings</h2>
                        </div>
                        <p className="mt-1 text-sm text-ink-500">{product.totalReviews || 0} customer reviews</p>
                    </div>

                    <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                        {showReviewForm ? "Close" : "Write a review"}
                    </Button>
                </div>

                <div className="mb-6 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 rounded-xl bg-success-600 px-4 py-2.5 text-lg font-bold text-white">
                        <Star size={17} fill="white" /> {product.averageRating || 0}
                    </div>
                    <div>
                        <p className="font-semibold text-ink-900">Overall rating</p>
                        <p className="text-sm text-ink-500">Based on {product.totalReviews || 0} reviews</p>
                    </div>
                </div>

                {showReviewForm && (
                    <div className="mb-8 animate-slide-up rounded-2xl border border-ink-200 bg-ink-50 p-5 sm:p-6">
                        <h3 className="mb-4 text-lg font-semibold text-ink-900">Write your review</h3>

                        <label htmlFor="review-rating" className="mb-2 block text-sm font-medium text-ink-700">Your rating</label>
                        <select id="review-rating" value={rating} onChange={(e) => setRating(e.target.value)} className="input-base mb-4">
                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                            <option value="4">⭐⭐⭐⭐ (4)</option>
                            <option value="3">⭐⭐⭐ (3)</option>
                            <option value="2">⭐⭐ (2)</option>
                            <option value="1">⭐ (1)</option>
                        </select>

                        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-ink-700">Your review</label>
                        <textarea
                            id="review-comment"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            className="input-base mb-4 resize-none"
                        />

                        <label htmlFor="review-images" className="mb-2 block text-sm font-medium text-ink-700">Add photos (optional)</label>
                        <input
                            id="review-images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setReviewImages(Array.from(e.target.files))}
                            className="mb-4 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-700"
                        />

                        <Button variant="success" loading={submittingReview} onClick={handleReviewSubmit}>
                            Submit review
                        </Button>
                    </div>
                )}

                {reviews.length === 0 ? (
                    <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to share your experience with this product." />
                ) : (
                    <>
                        <div className="space-y-4">
                            {reviews
                                .slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE)
                                .map((review) => (
                                <div key={review.reviewId} className="rounded-2xl border border-ink-200 p-5 transition-shadow hover:shadow-sm">
                                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 rounded-lg bg-success-600 px-2.5 py-1 text-sm font-semibold text-white">
                                                <Star size={13} fill="white" /> {review.rating}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-ink-900">{review.userName}</h3>
                                                <span className="flex items-center gap-1 text-xs font-medium text-success-600">
                                                    <BadgeCheck size={13} /> Verified
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-ink-500">
                                            {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>

                                    <p className="mb-3 leading-relaxed text-ink-700">{review.comment}</p>

                                    {review.images?.length > 0 && (
                                        <>
                                            <div className="mb-2.5 flex items-center gap-2 text-ink-600">
                                                <ImageIcon size={15} />
                                                <span className="text-sm font-medium">Customer photos</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2.5">
                                                {review.images.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt=""
                                                        onClick={() => window.open(img, "_blank")}
                                                        className="h-24 w-24 cursor-pointer rounded-xl border border-ink-200 object-cover sm:h-28 sm:w-28"
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {reviews.length > REVIEWS_PER_PAGE && (
                            <Pagination
                                page={reviewPage}
                                totalPages={Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
                                onChange={setReviewPage}
                                className="mt-6"
                            />
                        )}
                    </>
                )}
            </div>

            {/* SIMILAR PRODUCTS */}
            {similarProducts.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-ink-900">Similar products</h2>
                    <HorizontalScroller>
                        {similarProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                    </HorizontalScroller>
                </div>
            )}

            {/* RECENTLY VIEWED */}
            {recentProducts.length > 0 && (
                <div className="mt-8 mb-4">
                    <h2 className="mb-4 text-xl font-bold text-ink-900">Recently viewed</h2>
                    <HorizontalScroller>
                        {recentProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                    </HorizontalScroller>
                </div>
            )}

            {/* IMAGE PREVIEW LIGHTBOX */}
            {showPreview && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/90 p-6 animate-fade-in"
                    onClick={() => setShowPreview(false)}
                >
                    <button
                        onClick={() => setShowPreview(false)}
                        aria-label="Close image preview"
                        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={product.imageUrls?.[selectedImage]}
                        alt={product.name}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[85vh] max-w-full animate-scale-in rounded-xl object-contain"
                    />
                </div>
            )}

            {/* ADDRESS SELECT MODAL */}
            <Modal
                open={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                title="Select delivery address"
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowAddressModal(false)}>Cancel</Button>
                        <Button
                            variant="success"
                            disabled={!selectedAddressId}
                            loading={placingOrder}
                            onClick={handlePlaceOrder}
                        >
                            Continue
                        </Button>
                    </>
                }
            >
                <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
                    {addresses.map((address) => {
                        const addressInfo = getAddressTypeInfo(address.addressType || "OTHER");
                        return (
                            <label
                                key={address.id}
                                className={`block cursor-pointer rounded-xl border p-4 transition-colors ${
                                    selectedAddressId === address.id ? "border-success-500 bg-success-50" : "border-ink-200 hover:border-brand-300"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddressId === address.id}
                                        onChange={() => setSelectedAddressId(address.id)}
                                        className="mt-1 accent-brand-600"
                                    />
                                    <div className="flex-1">
                                        <div className="mb-1.5 flex items-center gap-2">
                                            <addressInfo.Icon size={16} />
                                            <span className="font-medium text-ink-800">{addressInfo.label}</span>
                                        </div>
                                        <p className="font-semibold text-ink-900">{address.street}</p>
                                        <p className="mt-0.5 text-sm text-ink-600">{address.city}, {address.state}</p>
                                        <p className="text-sm text-ink-600">{address.country || "-"} - {address.zipCode || "-"}</p>
                                        <p className="mt-0.5 text-sm text-ink-600">{address.phoneNumber || "-"}</p>
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <button onClick={() => navigate("/address")} className="mt-4 text-sm font-semibold text-brand-600 hover:underline">
                    + Add new address
                </button>
            </Modal>
        </div>
    );
}

export default ProductDetail;
