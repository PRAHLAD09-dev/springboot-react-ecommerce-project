import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import { COLORS } from "../../constants/colors";
import {
    Truck,
    ChevronLeft,
    ChevronRight,
    Star,
    BadgeCheck,
    MessageSquare,
    ImageIcon,
    Package,
    Tag,
    ArrowLeft,
    Home,
    Building2,
    Building,
    Store,
    MapPin,
    Phone
} from "lucide-react";


function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [recentProducts, setRecentProducts] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const sliderRef = useRef();
    const similarRef = useRef();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewImages, setReviewImages] = useState([]);

    const [selectedColor, setSelectedColor] = useState("");


    const scrollSimilarLeft = () => {
        similarRef.current?.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    };

    const scrollSimilarRight = () => {
        similarRef.current?.scrollBy({
            left: 300,
            behavior: "smooth"
        });
    };

    const recentRef = useRef();

    const scrollRecentLeft = () => {
        recentRef.current?.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    };

    const scrollRecentRight = () => {
        recentRef.current?.scrollBy({
            left: 300,
            behavior: "smooth"
        });
    };

    const getAddressType = (type) => {

        switch (type) {

            case "HOME":
                return {
                    icon: <Home size={16} />,
                    label: "Home"
                };

            case "OFFICE":
                return {
                    icon: <Building2 size={16} />,
                    label: "Office"
                };

            case "APARTMENT":
                return {
                    icon: <Building size={16} />,
                    label: "Apartment"
                };

            case "SHOP":
                return {
                    icon: <Store size={16} />,
                    label: "Shop"
                };

            default:
                return {
                    icon: <MapPin size={16} />,
                    label: "Other"
                };
        }
    };

    // ================= FETCH PRODUCT =================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(
                    `/products/${id}`
                );
                setProduct(res.data.data);
                if (
                    res.data.data.colors &&
                    res.data.data.colors.length > 0
                ) {
                    setSelectedColor(
                        res.data.data.colors[0]
                    );
                }

                const similar =
                    await API.get(
                        `/products/${id}/similar`
                    );

                setSimilarProducts(
                    similar.data.data
                );
                const viewed =
                    JSON.parse(
                        localStorage.getItem(
                            "recentProducts"
                        ) || "[]"
                    );

                const updated = [
                    res.data.data,
                    ...viewed.filter(
                        p => p.id !== res.data.data.id
                    )
                ].slice(0, 6);

                localStorage.setItem(
                    "recentProducts",
                    JSON.stringify(updated)
                );

                setRecentProducts(
                    updated.filter(
                        p => p.id !== res.data.data.id
                    )
                );
            } catch (err) {
                console.log(err);
                alert("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {

        try {

            const res =
                await API.get(
                    `/reviews/product/${id}`
                );

            setReviews(res.data);

        }
        catch (err) {

            console.log(err);

        }
    };

    // ================= ADD TO CART =================
    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Login first");
            navigate("/login");
            return;
        }

        try {
            await API.post(
                "/cart/add",
                null,
                {
                    params: {
                        productId: product.id,
                        quantity: 1,
                        selectedColor
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Added to cart");
        } catch (err) {
            console.log(err);
            alert("Failed to add to cart");
        }
    };

    // ================= BUY NOW =================
    const handleBuyNow = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert("Login first");
            navigate("/login");
            return;
        }

        try {

            const res =
                await API.get(
                    "/user/address"
                );

            setAddresses(
                res.data.data
            );

            setShowAddressModal(
                true
            );

        }
        catch (err) {

            console.log(err);

            alert(
                "Failed to load addresses"
            );
        }
    };

    const handlePlaceOrder = async () => {

        try {

            const token =
                localStorage.getItem("token");

            await API.post(
                "/cart/add",
                null,
                {
                    params: {
                        productId: product.id,
                        quantity: 1,
                        selectedColor
                    }
                }
            );

            const res =
                await API.post(
                    `/user/orders/place?addressId=${selectedAddressId}`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const orderId =
                res.data.data.orderId;

            navigate(
                `/payment/${orderId}`
            );

        }
        catch (err) {

            console.log(err);

            alert(
                "Order failed"
            );
        }
    };

    const handleReviewSubmit = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert("Login first");
            return;
        }

        try {

            const formData =
                new FormData();

            formData.append(
                "rating",
                rating
            );

            formData.append(
                "comment",
                comment
            );

            reviewImages.forEach(file => {

                formData.append(
                    "images",
                    file
                );

            });

            await API.post(
                `/reviews/product/${product.id}`,
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            alert(
                "Review added successfully"
            );

            setComment("");
            setRating(5);
            setReviewImages([]);

            fetchReviews();

        }
        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Failed to add review"
            );
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-[1600px] mx-auto">

                {/* HEADER */}
                <button
                    onClick={() => navigate(-1)}
                    className="
                        mb-6
                        w-11
                        h-11
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-sm
                        hover:bg-blue-50
                        hover:border-blue-300
                        flex
                        items-center
                        justify-center
                        transition
                        "
                >

                    <ArrowLeft size={20} />

                </button>

                {/* CARD */}
                <div className="grid grid-cols-12 gap-8">

                    {/* IMAGE */}
                    <div className="col-span-4 bg-white p-5 rounded-xl shadow">

                        <div
                            className="w-full
                                    h-[500px]
                                    bg-white
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    "
                            onClick={() => setShowPreview(true)}
                        >
                            <img
                                src={product.imageUrls?.[selectedImage]}
                                alt={product.name}
                                className="
                                w-full
                                h-full
                                object-contain
                                hover:scale-105
                                transition
                                duration-300
                                "
                            />
                        </div>

                        <div className="flex gap-3 mt-4 overflow-x-auto">

                            {product.imageUrls?.map((img, index) => (

                                <img
                                    key={index}
                                    src={img}
                                    alt=""
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2
                    ${selectedImage === index
                                            ? "border-blue-500 shadow-lg"
                                            : "border-gray-200"
                                        }`}
                                />

                            ))}

                        </div>

                    </div>

                    {/* DETAILS */}
                    <div className="col-span-5 bg-white p-5 rounded-xl shadow">

                        <h1 className="text-3xl font-bold mb-2">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 mb-4 leading-relaxed">
                            {product.aiDescription}
                        </p>

                        <div className="space-y-2">

                            <div className="flex items-center gap-2 text-gray-600">

                                <Tag size={16} />

                                <span>
                                    {product.categoryName}
                                </span>

                            </div>

                            <div className="flex items-center gap-2 text-gray-600">

                                <Package size={16} />

                                <span>
                                    Stock: {product.stock}
                                </span>

                            </div>

                        </div>

                        <div className="flex items-center gap-3 mt-4">

                            <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">

                                <Star
                                    size={14}
                                    fill="white"
                                />

                                {product.averageRating || 0}

                            </span>

                            <span className="text-gray-600 text-sm font-medium">
                                {product.totalReviews || 0} Reviews
                            </span>

                        </div>

                    </div>

                    {/* BUY BOX */}
                    <div className="col-span-3">

                        <div className="bg-white rounded-xl shadow p-5 sticky top-24">

                            <div>

                                <div className="flex items-center gap-3">

                                    <h2 className="text-4xl font-bold">
                                        ₹ {(product.price).toLocaleString("en-IN")}
                                    </h2>

                                    {
                                        product.discountPercentage > 0 && (
                                            <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                                {product.discountPercentage}% OFF
                                            </span>
                                        )
                                    }

                                </div>

                                {
                                    product.mrp > 0 && (
                                        <p className="text-gray-500 line-through text-lg mt-1">
                                            ₹ {product.mrp}
                                        </p>
                                    )
                                }

                            </div>

                            <p className="text-green-600 font-semibold mt-3">
                                In Stock
                            </p>

                            <p className="text-gray-500 mt-2">
                                FREE Delivery
                            </p>

                            <div className="mt-5">

                                <h3 className="font-semibold mb-3">
                                    Select Color
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    {product.colors?.map((colorName) => {

                                        const colorObj =
                                            COLORS.find(
                                                c => c.name === colorName
                                            );

                                        return (

                                            <button
                                                key={colorName}
                                                title={colorName}
                                                onClick={() =>
                                                    setSelectedColor(colorName)
                                                }
                                                className={`w-10 h-10 rounded-full border-2 transition ${selectedColor === colorName
                                                    ? "scale-110 border-black"
                                                    : "border-gray-300"
                                                    }`}
                                                style={{
                                                    backgroundColor:
                                                        colorObj?.hex || "#ccc"
                                                }}
                                            />

                                        );

                                    })}

                                    <p className="mt-3 text-sm text-gray-600">
                                        Selected:
                                        <span className="font-semibold ml-1">
                                            {selectedColor}
                                        </span>
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-full mt-6 font-semibold"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full mt-3 font-semibold"
                            >
                                Buy Now
                            </button>

                        </div>

                    </div>

                </div>
                {showAddressModal && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl">

                            <h2 className="text-2xl font-bold mb-5">
                                Select Address
                            </h2>

                            <div className="space-y-3">

                                {addresses.map((address) => {

                                    const addressInfo =
                                        getAddressType(
                                            address.addressType || "OTHER"
                                        );

                                    return (

                                        <label
                                            key={address.id}
                                            className={`block border rounded-lg p-4 cursor-pointer transition
                                                 ${selectedAddressId === address.id
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-300 hover:border-blue-400"
                                                }`}
                                        >

                                            <div className="flex items-start gap-3">

                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={
                                                        selectedAddressId === address.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedAddressId(
                                                            address.id
                                                        )
                                                    }
                                                    className="mt-1"
                                                />

                                                <div className="flex-1">

                                                    <div className="flex items-center gap-2 mb-2">

                                                        {addressInfo.icon}

                                                        <span className="font-medium">
                                                            {addressInfo.label}
                                                        </span>

                                                    </div>

                                                    <p className="font-semibold text-gray-900">
                                                        {address.street}
                                                    </p>

                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {address.city}, {address.state}
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        {address.country || "-"} - {address.zipCode || "-"}
                                                    </p>

                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {address.phoneNumber || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </label>

                                    );

                                })}

                            </div>

                            <button
                                onClick={() => navigate("/address")}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                + Add New Address
                            </button>

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    onClick={() =>
                                        setShowAddressModal(false)
                                    }
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={!selectedAddressId}
                                    onClick={handlePlaceOrder}
                                    className={`px-4 py-2 rounded-lg text-white
                    ${selectedAddressId
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Continue
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">

                {/* Specifications */}

                <div className="bg-white rounded-2xl shadow-md p-6">

                    <h2 className="text-2xl font-bold mb-5 border-b pb-3">
                        Specifications
                    </h2>

                    {JSON.parse(
                        product.specificationsJson || "[]"
                    ).length === 0 ? (

                        <p className="text-gray-500">
                            No specifications available
                        </p>

                    ) : (

                        <ul className="space-y-3">

                            {JSON.parse(
                                product.specificationsJson || "[]"
                            ).map((item, index) => (

                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-gray-700 border-b pb-2"
                                >
                                    <span className="text-green-600">
                                        ✓
                                    </span>

                                    {item}
                                </li>

                            ))}

                        </ul>

                    )}

                </div>

                {/* Feature Highlights */}

                <div className="bg-white rounded-2xl shadow-md p-6">

                    <h2 className="text-2xl font-bold mb-5 border-b pb-3">
                        Feature Highlights
                    </h2>

                    {JSON.parse(
                        product.featureHighlightsJson || "[]"
                    ).length === 0 ? (

                        <p className="text-gray-500">
                            No highlights available
                        </p>

                    ) : (

                        <ul className="space-y-3">

                            {JSON.parse(
                                product.featureHighlightsJson || "[]"
                            ).map((item, index) => (

                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-gray-700 border-b pb-2"
                                >
                                    <span className="text-blue-600">
                                        ★
                                    </span>

                                    {item}
                                </li>

                            ))}

                        </ul>

                    )}

                </div>

            </div>
            <div className="mt-10 bg-white rounded-2xl shadow-md p-8">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <div className="flex items-center gap-3">

                            <MessageSquare
                                size={30}
                                className="text-blue-600"
                            />

                            <h2 className="text-3xl font-bold">
                                Reviews & Ratings
                            </h2>

                        </div>

                        <p className="text-gray-500 mt-1">
                            {product.totalReviews || 0} Customer Reviews
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            setShowReviewForm(!showReviewForm)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
                    >
                        Write Review
                    </button>

                </div>

                <div className="flex items-center gap-4 mb-8">

                    <div className="bg-green-600 text-white px-5 py-3 rounded-xl text-xl font-bold flex items-center gap-2">

                        <Star
                            size={20}
                            fill="white"
                        />

                        {product.averageRating || 0}

                    </div>

                    <div>

                        <p className="font-semibold">
                            Overall Rating
                        </p>

                        <p className="text-gray-500">
                            Based on {product.totalReviews || 0} reviews
                        </p>

                    </div>

                </div>

                {showReviewForm && (

                    <div className="border rounded-2xl p-6 mb-8 bg-gray-50">

                        <h3 className="text-xl font-semibold mb-4">
                            Write Your Review
                        </h3>

                        <select
                            value={rating}
                            onChange={(e) =>
                                setRating(e.target.value)
                            }
                            className="border p-3 rounded-lg w-full mb-4"
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                            <option value="4">⭐⭐⭐⭐ (4)</option>
                            <option value="3">⭐⭐⭐ (3)</option>
                            <option value="2">⭐⭐ (2)</option>
                            <option value="1">⭐ (1)</option>
                        </select>

                        <textarea
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            className="border p-4 rounded-lg w-full mb-4"
                            rows="5"
                        />

                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setReviewImages(
                                    Array.from(e.target.files)
                                )
                            }
                            className="mb-4"
                        />

                        <button
                            onClick={handleReviewSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
                        >
                            Submit Review
                        </button>

                    </div>

                )}

                {reviews.length === 0 ? (

                    <div className="text-center py-10 text-gray-500">
                        No reviews yet
                    </div>

                ) : (

                    <div className="space-y-5">

                        {reviews.map((review) => (

                            <div
                                key={review.reviewId}
                                className="border rounded-2xl p-5 hover:shadow-md transition"
                            >

                                <div className="flex justify-between items-center mb-3">

                                    <div className="flex items-center gap-3">

                                        <span className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">

                                            <Star
                                                size={14}
                                                fill="white"
                                            />

                                            {review.rating}

                                        </span>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-2xl">
                                                    {review.userName}
                                                </h3>

                                                <span className="text-green-600 font-medium text-sm flex items-center gap-1">

                                                    <BadgeCheck size={15} />

                                                    Verified Purchase

                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                    <p className="text-gray-500">
                                        {
                                            new Date(review.createdAt)
                                                .toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )
                                        }
                                    </p>

                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {review.comment}
                                </p>

                                {review.images?.length > 0 && (

                                    <>

                                        <div className="flex items-center gap-2 mb-3 text-gray-600">

                                            <ImageIcon size={16} />

                                            <span className="text-sm font-medium">
                                                Customer Photos
                                            </span>

                                        </div>

                                        <div className="flex gap-3 flex-wrap">

                                            {review.images.map((img, index) => (

                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt=""
                                                    className="w-32 h-32 object-cover rounded-xl border cursor-pointer"
                                                    onClick={() =>
                                                        window.open(img, "_blank")
                                                    }
                                                />

                                            ))}

                                        </div>

                                    </>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>
            {similarProducts.length > 0 && (

                <div className="mt-10 bg-white rounded-2xl shadow-md p-6">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-xl font-bold text-gray-900">
                            Similar Products
                        </h2>


                    </div>

                    <div className="relative">

                        <button
                            onClick={scrollSimilarLeft}
                            className="
                            absolute
                            left-0
                            top-1/2
                            -translate-y-1/2
                            z-10
                            w-10 h-10
                            rounded-full
                            bg-white
                            border border-gray-200
                            shadow-lg
                            flex items-center justify-center
                            hover:bg-blue-50
                            "
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div
                            ref={similarRef}
                            className="flex gap-3 overflow-x-hidden scroll-smooth pb-3 px-12"
                        >

                            {similarProducts.map((p) => (

                                <div
                                    key={p.id}
                                    onClick={() =>
                                        navigate(`/product/${p.id}`)
                                    }
                                    className="w-[240px] min-w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 flex-shrink-0"
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

                        </div>
                        <button
                            onClick={scrollSimilarRight}
                            className="
                            absolute
                            right-0
                            top-1/2
                            -translate-y-1/2
                            z-10
                            w-10 h-10
                            rounded-full
                            bg-white
                            border border-gray-200
                            shadow-lg
                            flex items-center justify-center
                            hover:bg-blue-50
                            "
                        >
                            <ChevronRight size={20} />
                        </button>

                    </div>

                </div>

            )}

            <div className="mt-10 bg-white rounded-2xl shadow-md p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-xl font-bold text-gray-900">
                        Recently Viewed
                    </h2>

                </div>

                <div className="relative">

                    <div
                        ref={recentRef}
                        className="flex gap-3 overflow-x-hidden scroll-smooth pb-3 px-12"
                    >
                        <button
                            onClick={scrollRecentLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {recentProducts.map((p) => (

                            <div
                                key={p.id}
                                onClick={() =>
                                    navigate(`/product/${p.id}`)
                                }
                                className="w-[240px] min-w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 flex-shrink-0"
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
                            onClick={scrollRecentRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50"
                        >
                            <ChevronRight size={20} />
                        </button>

                    </div>

                </div>

            </div>

        </div >
    );
}

export default ProductDetail;