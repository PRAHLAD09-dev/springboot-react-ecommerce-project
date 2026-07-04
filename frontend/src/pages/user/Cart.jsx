import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    Package,
    ShoppingCart as CartIcon
} from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Button, EmptyState } from "../../components/ui";
import { getAddressTypeInfo } from "../../utils/addressType";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddresses, setShowAddresses] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await API.get("/cart");
            const cartResponse = res.data.data;
            setCart(cartResponse.items || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await API.get("/user/address");
            const addressData = res.data.data || [];
            setAddresses(addressData);

            if (addressData.length > 0) {
                setSelectedAddress(addressData.find((a) => a.addressType) || addressData[0]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    const changeQty = async (cartItemId, delta) => {
        const item = cart.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        const newQty = item.quantity + delta;
        if (newQty < 1) return;

        try {
            await API.put(`/cart/update/${cartItemId}?quantity=${newQty}`);
            fetchCart();
        } catch (err) {
            console.log(err);
        }
    };

    const removeItem = async (cartItemId) => {
        if (!window.confirm("Remove item?")) return;

        try {
            await API.delete(`/cart/remove/${cartItemId}`);
            fetchCart();
        } catch (err) {
            console.log(err);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (!selectedAddress) {
            setShowAddresses(true);
            return;
        }

        try {
            const res = await API.post(`/user/orders/place?addressId=${selectedAddress.id}`);
            const orderId = res.data.data?.orderId;
            navigate(`/payment/${orderId}`);
        } catch (err) {
            console.log(err);
        }
    };

    const totalMrp = cart.reduce((total, item) => total + item.mrp * item.quantity, 0);
    const SelectedAddressIcon = selectedAddress ? getAddressTypeInfo(selectedAddress.addressType).Icon : null;
    const totalSellingPrice = cart.reduce((total, item) => total + item.price, 0);
    const totalDiscount = totalMrp - totalSellingPrice;

    if (loading) {
        return (
            <div className="container-app py-6 sm:py-8">
                <div className="skeleton h-9 w-64 animate-shimmer rounded-lg" />
                <div className="mt-6 grid gap-8 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeleton h-40 w-full animate-shimmer rounded-2xl" />
                        ))}
                    </div>
                    <div className="skeleton h-72 w-full animate-shimmer rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="container-app py-6 sm:py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">Shopping Cart</h1>
                <Button variant="secondary" icon={Package} onClick={() => navigate("/orders")}>
                    My orders
                </Button>
            </div>

            {cart.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    description="Looks like you haven't added anything yet. Let's fix that."
                    action={<Button onClick={() => navigate("/")}>Start shopping →</Button>}
                    className="mt-6"
                />
            ) : (
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cart.map((item) => {
                                const colorObj = item.selectedColor
                                    ? COLORS.find((c) => c.name === item.selectedColor)
                                    : null;

                                return (
                                    <div
                                        key={item.cartItemId}
                                        onClick={() => navigate(`/product/${item.productId}`)}
                                        className="card-surface cursor-pointer p-4 transition-shadow hover:shadow-md sm:p-5"
                                    >
                                        <div className="flex gap-4 sm:gap-5">
                                            <img
                                                src={item.imageUrl || "https://via.placeholder.com/120"}
                                                alt={item.productName}
                                                className="h-24 w-24 shrink-0 rounded-xl border border-ink-100 bg-white object-contain p-2 sm:h-32 sm:w-32"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <h2 className="line-clamp-2 text-base font-semibold text-ink-900 sm:text-xl">
                                                    {item.productName}
                                                </h2>

                                                {item.selectedColor && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="text-xs text-ink-500 sm:text-sm">Color:</span>
                                                        <span
                                                            className="h-4 w-4 rounded-full border border-ink-200 sm:h-5 sm:w-5"
                                                            style={{ backgroundColor: colorObj?.hex || "#ccc" }}
                                                        />
                                                        <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium sm:text-sm">
                                                            {item.selectedColor}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-3 sm:gap-3">
                                                    <span className="text-xl font-bold text-success-600 sm:text-2xl">
                                                        ₹{Number(item.price).toLocaleString("en-IN")}
                                                    </span>
                                                    {item.mrp > item.price && (
                                                        <span className="text-sm text-ink-400 line-through sm:text-base">
                                                            ₹{Number(item.mrp).toLocaleString("en-IN")}
                                                        </span>
                                                    )}
                                                    {item.discountPercentage > 0 && (
                                                        <span className="rounded-full bg-success-600 px-2.5 py-1 text-xs font-semibold text-white sm:px-3 sm:text-sm">
                                                            {item.discountPercentage}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="mt-2 inline-flex items-center rounded-full bg-success-100 px-2.5 py-1 text-xs font-medium text-success-700">
                                                    In stock
                                                </span>

                                                <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
                                                    <div className="flex items-center gap-3 rounded-full bg-ink-100 px-1 py-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); changeQty(item.cartItemId, -1); }}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs transition-colors hover:bg-ink-50"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); changeQty(item.cartItemId, 1); }}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs transition-colors hover:bg-ink-50"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeItem(item.cartItemId); }}
                                                        className="flex items-center gap-1.5 text-sm font-medium text-danger-500 hover:text-danger-700"
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ADDRESS */}
                        <div className="card-surface mt-4 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="mb-3 text-lg font-bold text-ink-900 sm:text-xl">Delivery address</h2>

                                    {selectedAddress ? (
                                        <>
                                            <div className="mb-2 flex items-center gap-2 text-brand-600">
                                                <SelectedAddressIcon size={16} />
                                                <span className="font-semibold text-ink-800">
                                                    {getAddressTypeInfo(selectedAddress.addressType).label}
                                                </span>
                                            </div>
                                            <p className="font-medium text-ink-900">{selectedAddress.street}</p>
                                            <p className="text-ink-600">{selectedAddress.city}, {selectedAddress.state}</p>
                                            <p className="text-ink-600">{selectedAddress.country} - {selectedAddress.zipCode}</p>
                                            <p className="text-ink-600">{selectedAddress.phoneNumber}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-ink-500">No address selected</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowAddresses(!showAddresses)}
                                    className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
                                >
                                    Change
                                </button>
                            </div>

                            {showAddresses && (
                                <div className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                                    {addresses.map((a) => (
                                        <button
                                            key={a.id}
                                            onClick={() => {
                                                setSelectedAddress(a);
                                                setShowAddresses(false);
                                            }}
                                            className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                                selectedAddress?.id === a.id
                                                    ? "border-brand-400 bg-brand-50"
                                                    : "border-ink-200 hover:bg-ink-50"
                                            }`}
                                        >
                                            <p className="font-medium text-ink-800">{a.street}</p>
                                            <p className="text-sm text-ink-500">{a.city}, {a.state}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                        <div className="card-surface sticky top-24 p-6">
                            <h2 className="mb-5 text-xl font-bold text-ink-900">Price details</h2>

                            <div className="space-y-3 text-sm text-ink-600">
                                <div className="flex justify-between">
                                    <span>Price ({cart.length} items)</span>
                                    <span>₹{totalMrp.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span className="font-medium text-success-600">- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="font-medium text-success-600">FREE</span>
                                </div>
                            </div>

                            <div className="my-4 h-px bg-ink-100" />

                            <div className="flex justify-between text-xl font-bold text-ink-950">
                                <span>Total amount</span>
                                <span>₹{totalSellingPrice.toLocaleString("en-IN")}</span>
                            </div>

                            {totalDiscount > 0 && (
                                <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-success-600">
                                    You saved ₹{totalDiscount.toLocaleString("en-IN")} on this order
                                </p>
                            )}

                            <Button
                                variant="success"
                                size="lg"
                                fullWidth
                                icon={CartIcon}
                                onClick={handleCheckout}
                                className="mt-6 !rounded-full"
                            >
                                Proceed to payment
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
