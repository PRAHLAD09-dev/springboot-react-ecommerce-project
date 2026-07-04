import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { COLORS } from "../../constants/colors";
import {
    ArrowLeft,
    Package,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Search,
    Boxes,
    CircleAlert,
    Star,
    Truck,
    IndianRupee,
    UploadCloud,
    X,
    Sparkles,
    Loader2,
    LayoutGrid,
    List,
    CheckSquare,
    Square,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ImageIcon,
    Tag,
    Layers,
    Wand2,
    CheckCircle2
} from "lucide-react";
import { Card, Badge, Button, Input, Select, EmptyState, Pagination, Modal, TableContainer, Thead, Th, Tbody, Tr, Td } from "../../components/ui";

const STEPS = ["Basic info", "Pricing & stock", "Images", "Review & generate"];

function Product() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const [colorSearch, setColorSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formStep, setFormStep] = useState(0);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        price: "",
        mrp: "",
        stock: "",
        categoryId: "",
        colors: []
    });

    const [editId, setEditId] = useState(null);
    const [formError, setFormError] = useState("");

    const [productSearch, setProductSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const PRODUCTS_PER_PAGE = 10;

    const [viewMode, setViewMode] = useState("grid");
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const fileInputRef = useRef(null);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/merchant/products");
            setProducts(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await API.get("/categories");
            setCategories(res.data.data || []);
        } catch (err) {
            console.log("CATEGORY ERROR:", err.response?.data || err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({ price: "", mrp: "", stock: "", categoryId: "", colors: [] });
        setFiles([]);
        setEditId(null);
        setShowForm(false);
        setFormStep(0);
        setFormError("");
    };

    const validateStep = (step) => {
        if (step === 0 && !form.categoryId) return "Please select a category";
        if (step === 1 && (!form.price || !form.stock)) return "Price and stock are required";
        if (step === 2 && files.length === 0 && !editId) return "Add at least one product image";
        return "";
    };

    const goNext = () => {
        const err = validateStep(formStep);
        if (err) {
            setFormError(err);
            return;
        }
        setFormError("");
        setFormStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => {
        setFormError("");
        setFormStep((s) => Math.max(s - 1, 0));
    };

    const handleSubmit = async () => {
        try {
            setFormError("");
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!form.price || !form.categoryId) {
                setFormError("Fill required fields");
                setLoading(false);
                return;
            }

            const productData = {
                price: Number(form.price),
                mrp: Number(form.mrp),
                stock: Number(form.stock),
                categoryId: Number(form.categoryId),
                colors: form.colors
            };

            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify(productData)], { type: "application/json" }));
            files.forEach((file) => formData.append("files", file));

            if (editId) {
                await API.put(`/merchant/products/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await API.post("/merchant/products/add", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            await fetchProducts();
            resetForm();
        } catch (err) {
            console.log(err.response?.data || err);
            setFormError("Operation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await API.delete(`/merchant/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.log("FULL ERROR", err, err.response?.data);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Delete ${selectedIds.length} selected product(s)? This cannot be undone.`)) return;

        try {
            setBulkDeleting(true);
            await Promise.all(selectedIds.map((id) => API.delete(`/merchant/products/${id}`)));
            await fetchProducts();
            setSelectedIds([]);
            setSelectionMode(false);
        } catch (err) {
            console.log(err.response?.data || err);
        } finally {
            setBulkDeleting(false);
        }
    };

    const toggleSelected = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleEdit = (p) => {
        const selectedCategory = categories.find((c) => c.name === p.categoryName);

        setForm({
            price: p.price || "",
            stock: p.stock || "",
            categoryId: selectedCategory?.id || "",
            mrp: p.mrp || "",
            colors: p.colors || []
        });

        setEditId(p.id);
        setShowForm(true);
        setFormStep(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // --- IMAGE HANDLING ---
    const addFiles = (newFiles) => {
        setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    const moveFile = (index, dir) => {
        setFiles((prev) => {
            const next = [...prev];
            const target = index + dir;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const filteredColors = COLORS.filter((c) => c.name.toLowerCase().includes(colorSearch.toLowerCase()));

    const discountPercent =
        form.price && form.mrp && Number(form.mrp) > Number(form.price)
            ? Math.round(((form.mrp - form.price) / form.mrp) * 100)
            : null;

    const selectedCategoryName = categories.find((c) => String(c.id) === String(form.categoryId))?.name;

    const stats = [
        { label: "Total products", value: products.length, icon: Package, color: "text-ink-900" },
        { label: "In stock", value: products.filter((p) => p.stock > 0).length, icon: Boxes, color: "text-success-600" },
        { label: "Out of stock", value: products.filter((p) => p.stock <= 0).length, icon: CircleAlert, color: "text-danger-600" },
        { label: "Total reviews", value: products.reduce((sum, p) => sum + (p.totalReviews || 0), 0), icon: Star, color: "text-warning-500" },
        {
            label: "Inventory value",
            value: `₹${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "text-success-600"
        }
    ];

    const lowStock = products.filter((p) => p.stock <= 5);

    const filteredProducts = products.filter((p) =>
        p.name?.toLowerCase().includes(productSearch.toLowerCase().trim())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "stock_asc") return a.stock - b.stock;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return b.id - a.id;
    });

    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
    const paginatedProducts = sortedProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

    return (
        <div className={showForm ? "pb-24" : ""}>
            {/* HEADER */}
            <Card className="mb-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="flex items-center gap-3">
                            <Package size={26} className="text-brand-600" />
                            <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">Product Management</h1>
                        </div>
                        <p className="mt-1.5 text-sm text-ink-500">Manage products, inventory, and reviews</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-3.5">
                            <p className="text-xs font-medium text-ink-500">Active products</p>
                            <p className="text-2xl font-bold text-brand-700">{products.length}</p>
                        </div>

                        <Button
                            variant={showForm ? "danger" : "success"}
                            icon={showForm ? X : Plus}
                            onClick={() => { setShowForm(!showForm); setFormStep(0); }}
                        >
                            {showForm ? "Close form" : "Add product"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* MULTI-STEP FORM */}
            {showForm && (
                <Card className="mb-6 animate-slide-up !p-0 overflow-hidden">
                    {/* STEPPER */}
                    <div className="border-b border-ink-100 bg-ink-50 px-5 py-5 sm:px-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                                {editId ? "Update product" : "Add new product"}
                            </h2>
                            {editId && <Badge variant="brand">Editing mode</Badge>}
                        </div>

                        <div className="flex items-center">
                            {STEPS.map((label, i) => (
                                <div key={label} className="flex flex-1 items-center last:flex-none">
                                    <button
                                        onClick={() => i < formStep && setFormStep(i)}
                                        disabled={i > formStep}
                                        className="flex flex-col items-center gap-1.5 disabled:cursor-not-allowed"
                                    >
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
                                                i < formStep
                                                    ? "bg-success-600 text-white"
                                                    : i === formStep
                                                        ? "bg-brand-600 text-white"
                                                        : "bg-ink-200 text-ink-500"
                                            }`}
                                        >
                                            {i < formStep ? <CheckCircle2 size={16} /> : i + 1}
                                        </div>
                                        <span className={`hidden text-[11px] font-medium sm:block ${i === formStep ? "text-brand-700" : "text-ink-400"}`}>
                                            {label}
                                        </span>
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <div className={`mx-1.5 h-0.5 flex-1 rounded ${i < formStep ? "bg-success-500" : "bg-ink-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
                        {/* FORM CONTENT */}
                        <div>
                            {formError && (
                                <div className="mb-5 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{formError}</div>
                            )}

                            {/* STEP 0: BASIC INFO */}
                            {formStep === 0 && (
                                <div className="animate-fade-in space-y-5">
                                    <div className="mb-1 flex items-center gap-2 text-ink-800">
                                        <Tag size={17} className="text-brand-600" />
                                        <h3 className="font-semibold">Category & classification</h3>
                                    </div>

                                    <Select label="Category" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                                        <option value="">Select category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </Select>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-ink-700">Product colors</label>

                                        <div className="relative">
                                            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                                            <input
                                                type="text"
                                                placeholder="Search colors..."
                                                value={colorSearch}
                                                onChange={(e) => setColorSearch(e.target.value)}
                                                className="input-base pl-10"
                                            />
                                        </div>

                                        <div className="mt-3 max-h-56 overflow-y-auto rounded-2xl border border-ink-200 bg-ink-50 p-3">
                                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                                {filteredColors.map((color) => (
                                                    <button
                                                        key={color.name}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!form.colors.includes(color.name)) {
                                                                setForm({ ...form, colors: [...form.colors, color.name] });
                                                            }
                                                        }}
                                                        className="flex items-center gap-2.5 rounded-xl border border-ink-200 bg-white px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-sm"
                                                    >
                                                        <span className="h-5 w-5 shrink-0 rounded-full border-2 border-white shadow-xs" style={{ backgroundColor: color.hex }} />
                                                        <span className="truncate text-sm font-medium text-ink-700">{color.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {form.colors.length > 0 && (
                                            <>
                                                <p className="mb-2 mt-4 text-sm font-semibold text-ink-800">
                                                    Selected colors <span className="text-ink-400">({form.colors.length})</span>
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {form.colors.map((color) => {
                                                        const colorObj = COLORS.find((c) => c.name === color);
                                                        return (
                                                            <div key={color} className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                                                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colorObj?.hex }} />
                                                                {color}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setForm({ ...form, colors: form.colors.filter((c) => c !== color) })}
                                                                    className="transition-colors hover:text-danger-600"
                                                                >
                                                                    <X size={13} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 1: PRICING & STOCK */}
                            {formStep === 1 && (
                                <div className="animate-fade-in space-y-5">
                                    <div className="mb-1 flex items-center gap-2 text-ink-800">
                                        <IndianRupee size={17} className="text-brand-600" />
                                        <h3 className="font-semibold">Pricing & inventory</h3>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Input label="Selling price" name="price" type="number" icon={IndianRupee} placeholder="Enter selling price" value={form.price} onChange={handleChange} required />
                                        <Input label="MRP" name="mrp" type="number" icon={IndianRupee} placeholder="Enter MRP" value={form.mrp} onChange={handleChange} />
                                    </div>

                                    {discountPercent !== null && (
                                        <div className="flex items-center justify-between rounded-2xl border border-success-200 bg-success-50 px-5 py-4">
                                            <span className="font-medium text-success-700">Discount available to customers</span>
                                            <Badge variant="success">{discountPercent}% OFF</Badge>
                                        </div>
                                    )}

                                    <Input label="Available stock" name="stock" type="number" icon={Layers} placeholder="Available stock" value={form.stock} onChange={handleChange} required />
                                </div>
                            )}

                            {/* STEP 2: IMAGES */}
                            {formStep === 2 && (
                                <div className="animate-fade-in">
                                    <div className="mb-4 flex items-center gap-2 text-ink-800">
                                        <ImageIcon size={17} className="text-brand-600" />
                                        <h3 className="font-semibold">Product images</h3>
                                    </div>

                                    <label
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        className={`block cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all sm:p-10 ${
                                            isDragging ? "border-success-500 bg-success-50" : "border-ink-300 hover:border-success-500 hover:bg-success-50"
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => addFiles(e.target.files)}
                                        />
                                        <UploadCloud size={38} className="mx-auto mb-3 text-success-600" />
                                        <h3 className="text-lg font-semibold text-ink-900">Drag & drop product images</h3>
                                        <p className="mt-1 text-ink-500">or click to browse from your device</p>
                                        <p className="mt-2 text-sm text-ink-400">JPG, PNG, WEBP supported · first image is primary</p>
                                    </label>

                                    {files.length > 0 && (
                                        <div className="mt-5">
                                            <h4 className="mb-3 font-semibold text-ink-800">
                                                Uploaded images <span className="text-ink-400">({files.length})</span>
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                                                {files.map((file, index) => (
                                                    <div key={index} className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs">
                                                        {index === 0 && (
                                                            <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                                Primary
                                                            </span>
                                                        )}
                                                        <img src={URL.createObjectURL(file)} alt="" className="h-28 w-full object-cover" />

                                                        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink-950/0 opacity-0 transition-all group-hover:bg-ink-950/40 group-hover:opacity-100">
                                                            {index > 0 && (
                                                                <button type="button" onClick={() => moveFile(index, -1)} aria-label="Move left" className="rounded-full bg-white p-1.5 hover:bg-ink-100">
                                                                    <ArrowUp size={12} className="-rotate-90" />
                                                                </button>
                                                            )}
                                                            {index < files.length - 1 && (
                                                                <button type="button" onClick={() => moveFile(index, 1)} aria-label="Move right" className="rounded-full bg-white p-1.5 hover:bg-ink-100">
                                                                    <ArrowDown size={12} className="-rotate-90" />
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                                                aria-label="Remove image"
                                                                className="rounded-full bg-white p-1.5 hover:bg-danger-50"
                                                            >
                                                                <X size={12} className="text-danger-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex h-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink-200 text-ink-400 transition-colors hover:border-brand-400 hover:text-brand-600"
                                                >
                                                    <Plus size={18} />
                                                    <span className="text-xs font-medium">Add more</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: REVIEW & GENERATE */}
                            {formStep === 3 && (
                                <div className="animate-fade-in space-y-5">
                                    <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-xs">
                                            <Wand2 size={20} />
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-1.5 font-semibold text-ink-900">
                                                AI Product Generator <Badge variant="brand">AI</Badge>
                                            </p>
                                            <p className="mt-1 text-sm text-ink-600">
                                                Our AI will analyze your images and generate the product name, description, specifications, and feature highlights automatically — you don't need to write them.
                                            </p>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="rounded-2xl border border-brand-200 bg-white p-6">
                                            <div className="mb-4 flex items-center gap-3">
                                                <Loader2 size={22} className="animate-spin text-brand-600" />
                                                <h3 className="font-semibold text-brand-700">
                                                    {editId ? "Updating product using AI…" : "Generating your product using AI…"}
                                                </h3>
                                            </div>
                                            <div className="space-y-2.5 text-sm text-ink-600">
                                                {["Uploading images", "Detecting product", "Generating description & specs", "Saving product"].map((step, i) => (
                                                    <div key={step} className="flex items-center gap-2.5">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" style={{ animationDelay: `${i * 0.2}s` }} />
                                                        {step}…
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                                                <div className="h-full w-2/3 animate-pulse rounded-full bg-brand-500" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-ink-200 p-5">
                                            <h3 className="mb-3 font-semibold text-ink-900">Ready to generate</h3>
                                            <ul className="space-y-2 text-sm text-ink-600">
                                                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-600" /> Category: {selectedCategoryName || "—"}</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-600" /> Price: ₹{form.price || "—"}</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-600" /> Stock: {form.stock || "—"} units</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success-600" /> Images: {files.length || "using existing"}</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* LIVE PREVIEW */}
                        <div className="lg:sticky lg:top-24 lg:h-fit">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-400">Live preview</p>
                            <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
                                <div className="relative flex h-40 items-center justify-center bg-ink-50 p-4">
                                    {discountPercent !== null && (
                                        <span className="absolute left-3 top-3 rounded-md bg-success-600 px-2 py-1 text-[11px] font-semibold text-white">
                                            {discountPercent}% OFF
                                        </span>
                                    )}
                                    {files.length > 0 ? (
                                        <img src={URL.createObjectURL(files[0])} alt="" className="h-full w-full object-contain" />
                                    ) : (
                                        <ImageIcon size={32} className="text-ink-300" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="text-xs font-medium text-brand-600">{selectedCategoryName || "Category"}</p>
                                    <p className="mt-1 text-sm font-medium text-ink-400 italic">AI will generate product name</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-ink-900">₹{form.price || "0"}</span>
                                        {form.mrp && Number(form.mrp) > Number(form.price || 0) && (
                                            <span className="text-sm text-ink-400 line-through">₹{form.mrp}</span>
                                        )}
                                    </div>
                                    {form.colors.length > 0 && (
                                        <div className="mt-2 flex gap-1.5">
                                            {form.colors.slice(0, 5).map((c) => {
                                                const colorObj = COLORS.find((x) => x.name === c);
                                                return <span key={c} className="h-4 w-4 rounded-full border border-ink-200" style={{ backgroundColor: colorObj?.hex }} />;
                                            })}
                                        </div>
                                    )}
                                    <p className="mt-2 text-xs text-ink-400">Stock: {form.stock || 0} units</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STICKY FOOTER */}
                    <div className="sticky bottom-0 flex items-center justify-between border-t border-ink-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
                        <Button type="button" variant="secondary" disabled={formStep === 0 || loading} icon={ChevronLeft} onClick={goBack}>
                            Back
                        </Button>

                        {formStep < STEPS.length - 1 ? (
                            <Button type="button" onClick={goNext}>
                                Continue <ChevronRight size={16} />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant={editId ? "primary" : "success"}
                                loading={loading}
                                icon={editId ? Pencil : Sparkles}
                                onClick={handleSubmit}
                                className="min-w-[200px]"
                            >
                                {loading ? (editId ? "Updating…" : "Generating…") : editId ? "Update product" : "Generate & add product"}
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {/* STATS */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                {stats.map((s) => (
                    <Card key={s.label} hover padding="sm">
                        <div className="flex items-center gap-2 text-sm text-ink-500">
                            <s.icon size={15} />
                            <span>{s.label}</span>
                        </div>
                        <h2 className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</h2>
                    </Card>
                ))}
            </div>

            {/* LOW STOCK ALERT */}
            {lowStock.length > 0 && (
                <div className="mb-6 rounded-2xl border border-warning-300 bg-warning-50 p-5">
                    <div className="flex items-center gap-2">
                        <CircleAlert size={19} className="text-warning-600" />
                        <h3 className="text-lg font-bold text-warning-700">Attention required</h3>
                    </div>
                    <p className="mt-1 text-sm text-ink-600">Products running low on inventory</p>

                    <div className="mt-3 space-y-2">
                        {lowStock.map((p) => (
                            <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-200 bg-white px-3 py-2.5">
                                <div className="flex items-center gap-2 text-sm">
                                    <Package size={15} className="text-ink-500" />
                                    <span className="text-ink-700">{p.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-danger-600">{p.stock} left</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PRODUCTS */}
            {products.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No products yet"
                    description="Add your first product and let AI generate the details for you."
                    action={<Button icon={Plus} onClick={() => setShowForm(true)}>Add your first product</Button>}
                />
            ) : (
                <>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm flex-1">
                            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                            <input
                                type="text"
                                placeholder="Search your products..."
                                value={productSearch}
                                onChange={(e) => { setProductSearch(e.target.value); setPage(1); }}
                                className="input-base pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-base w-full sm:w-52"
                            >
                                <option value="newest">Newest first</option>
                                <option value="name">Name: A to Z</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="stock_asc">Stock: Low to High</option>
                            </select>

                            <div className="flex shrink-0 rounded-xl border border-ink-200 bg-white p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    aria-label="Grid view"
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${viewMode === "grid" ? "bg-brand-600 text-white" : "text-ink-400 hover:text-ink-700"}`}
                                >
                                    <LayoutGrid size={15} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    aria-label="List view"
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${viewMode === "list" ? "bg-brand-600 text-white" : "text-ink-400 hover:text-ink-700"}`}
                                >
                                    <List size={15} />
                                </button>
                            </div>

                            <Button
                                variant={selectionMode ? "danger" : "secondary"}
                                size="sm"
                                onClick={() => { setSelectionMode((s) => !s); setSelectedIds([]); }}
                            >
                                {selectionMode ? "Cancel" : "Select"}
                            </Button>
                        </div>
                    </div>

                    {/* BULK ACTION BAR */}
                    {selectionMode && selectedIds.length > 0 && (
                        <div className="mb-5 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 animate-slide-down">
                            <span className="text-sm font-semibold text-brand-700">{selectedIds.length} selected</span>
                            <Button variant="danger" size="sm" icon={Trash2} loading={bulkDeleting} onClick={handleBulkDelete}>
                                Delete selected
                            </Button>
                        </div>
                    )}

                    {filteredProducts.length === 0 ? (
                        <EmptyState icon={Search} title="No matching products" description="Try a different search term." />
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {paginatedProducts.map((p) => {
                                const isSelected = selectedIds.includes(p.id);
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => (selectionMode ? toggleSelected(p.id) : navigate(`/product/${p.id}`))}
                                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                                            isSelected ? "border-brand-500 ring-2 ring-brand-200" : "border-ink-200"
                                        }`}
                                    >
                                        {selectionMode && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleSelected(p.id); }}
                                                className="absolute left-2 top-2 z-20 rounded-md bg-white p-0.5 shadow-sm"
                                                aria-label="Select product"
                                            >
                                                {isSelected ? <CheckSquare size={18} className="text-brand-600" /> : <Square size={18} className="text-ink-400" />}
                                            </button>
                                        )}

                                        <div className="relative flex h-[180px] items-center justify-center bg-ink-50 p-3">
                                            {p.discountPercentage > 0 && (
                                                <span className="absolute left-3 top-3 z-10 rounded-md bg-success-600 px-2 py-1 text-[11px] font-semibold text-white">
                                                    {p.discountPercentage}% OFF
                                                </span>
                                            )}

                                            <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-md bg-success-600 px-2 py-1 text-[12px] font-semibold text-white">
                                                {Number(p.averageRating || 0).toFixed(1)} ★
                                            </span>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); setPreviewImage(p.imageUrls?.[0]); }}
                                                aria-label="Preview image"
                                                className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-xs transition-opacity group-hover:opacity-100"
                                            >
                                                <Eye size={13} className="text-ink-600" />
                                            </button>

                                            <img
                                                src={p.imageUrls?.[0]}
                                                alt={p.name}
                                                loading="lazy"
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="px-3 pb-3 pt-2.5">
                                            <h3 className="line-clamp-2 min-h-[2.5em] text-[13.5px] font-medium text-ink-800">
                                                {p.name || "Unknown Product"}
                                            </h3>

                                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                <span className="text-[17px] font-bold text-ink-900">₹{Number(p.price).toLocaleString("en-IN")}</span>
                                                {p.mrp > p.price && (
                                                    <span className="text-[13px] text-ink-400 line-through">₹{Number(p.mrp).toLocaleString("en-IN")}</span>
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-[12px] font-medium text-brand-600">
                                                    <Truck size={13} /> Free delivery
                                                </div>
                                                {p.stock > 5 ? (
                                                    <Badge variant="success">In stock</Badge>
                                                ) : p.stock > 0 ? (
                                                    <Badge variant="warning">{p.stock} left</Badge>
                                                ) : (
                                                    <Badge variant="danger">Out of stock</Badge>
                                                )}
                                            </div>

                                            {!selectionMode && (
                                                <div className="mt-3 grid grid-cols-3 gap-1.5">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}
                                                        className="flex items-center justify-center gap-1 rounded-lg bg-success-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-success-700"
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                                                        className="flex items-center justify-center gap-1 rounded-lg bg-brand-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                                                    >
                                                        <Pencil size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                                        className="flex items-center justify-center gap-1 rounded-lg bg-danger-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-danger-700"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <TableContainer>
                            <Thead>
                                {selectionMode && <Th className="w-10"></Th>}
                                <Th>Product</Th>
                                <Th>Price</Th>
                                <Th>Stock</Th>
                                <Th>Rating</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </Thead>
                            <Tbody>
                                {paginatedProducts.map((p) => {
                                    const isSelected = selectedIds.includes(p.id);
                                    return (
                                        <Tr key={p.id} className={isSelected ? "bg-brand-50/50" : ""}>
                                            {selectionMode && (
                                                <Td>
                                                    <button onClick={() => toggleSelected(p.id)} aria-label="Select product">
                                                        {isSelected ? <CheckSquare size={18} className="text-brand-600" /> : <Square size={18} className="text-ink-400" />}
                                                    </button>
                                                </Td>
                                            )}
                                            <Td>
                                                <div className="flex items-center gap-3">
                                                    <img src={p.imageUrls?.[0]} alt="" className="h-11 w-11 rounded-lg border border-ink-100 bg-ink-50 object-contain p-1" />
                                                    <span className="max-w-[220px] truncate font-medium text-ink-900">{p.name}</span>
                                                </div>
                                            </Td>
                                            <Td>
                                                <span className="font-semibold text-ink-900">₹{Number(p.price).toLocaleString("en-IN")}</span>
                                                {p.mrp > p.price && <span className="ml-1.5 text-xs text-ink-400 line-through">₹{p.mrp}</span>}
                                            </Td>
                                            <Td>{p.stock}</Td>
                                            <Td>★ {Number(p.averageRating || 0).toFixed(1)} <span className="text-ink-400">({p.totalReviews || 0})</span></Td>
                                            <Td>
                                                {p.stock > 5 ? <Badge variant="success">In stock</Badge> : p.stock > 0 ? <Badge variant="warning">Low stock</Badge> : <Badge variant="danger">Out of stock</Badge>}
                                            </Td>
                                            <Td>
                                                <div className="flex justify-end gap-1.5">
                                                    <button onClick={() => navigate(`/product/${p.id}`)} aria-label="View" className="rounded-lg p-2 text-ink-400 hover:bg-success-50 hover:text-success-600"><Eye size={15} /></button>
                                                    <button onClick={() => handleEdit(p)} aria-label="Edit" className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-600"><Pencil size={15} /></button>
                                                    <button onClick={() => handleDelete(p.id)} aria-label="Delete" className="rounded-lg p-2 text-ink-400 hover:bg-danger-50 hover:text-danger-600"><Trash2 size={15} /></button>
                                                </div>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </TableContainer>
                    )}

                    {totalPages > 1 && (
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-8" />
                    )}
                </>
            )}

            {/* IMAGE PREVIEW MODAL */}
            <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} title="Image preview" size="lg">
                {previewImage && <img src={previewImage} alt="Product preview" className="max-h-[70vh] w-full rounded-xl object-contain" />}
            </Modal>
        </div>
    );
}

export default Product;
