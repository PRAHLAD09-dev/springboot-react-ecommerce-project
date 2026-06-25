import { useEffect, useState } from "react";
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
    ImagePlus,
    Search,
    Tag,
    Palette,
    Boxes,
    CircleAlert,
    Star,
    Truck,
    IndianRupee,
    FolderOpen,
    UploadCloud,
    X
} from "lucide-react";

function Product() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);

    const [colorSearch, setColorSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        price: "",
        mrp: "",
        stock: "",
        categoryId: "",
        colors: []
    });

    const [colorInput, setColorInput] = useState("");

    const [editId, setEditId] = useState(null);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await API.get("/merchant/products");
            setProducts(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH CATEGORIES =================
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

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ================= RESET FORM =================
    const resetForm = () => {
        setForm({
            price: "",
            mrp: "",
            stock: "",
            categoryId: "",
            colors: []
        });

        setFiles([]);
        setEditId(null);
        setShowForm(false);
    };



    // ================= SUBMIT =================
    const handleSubmit = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            if (!form.price || !form.categoryId) {
                alert("Fill required fields");
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

            formData.append(
                "data",
                new Blob(
                    [JSON.stringify(productData)],
                    {
                        type: "application/json"
                    }
                )
            );

            files.forEach(file => {
                formData.append("files", file);
            });

            if (editId) {

                await API.put(
                    `/merchant/products/${editId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Product Updated Successfully");

            } else {

                await API.post(
                    "/merchant/products/add",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Product Added Successfully");

            }

            await fetchProducts();

            resetForm();

        }
        catch (err) {

            console.log(err.response?.data || err);

            alert("Operation Failed");

        }
        finally {

            setLoading(false);

        }

    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await API.delete(`/merchant/products/${id}`);
            fetchProducts();
        } catch (err) {

            console.log("FULL ERROR", err);

            console.log(
                err.response?.data
            );

            alert(
                JSON.stringify(
                    err.response?.data
                )
            );
        }
    };

    // ================= EDIT =================
    const handleEdit = (p) => {

        const selectedCategory =
            categories.find(
                c => c.name === p.categoryName
            );

        setForm({
            price: p.price || "",
            stock: p.stock || "",
            categoryId: selectedCategory?.id || "",
            mrp: p.mrp || "",
            colors: p.colors || []
        });

        setEditId(p.id);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        setEditId(p.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredColors = COLORS.filter(c =>
        c.name.toLowerCase()
            .includes(colorSearch.toLowerCase())
    );


    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="bg-white rounded-3xl shadow-sm border p-8 mb-8">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div>

                            <button
                                onClick={() => navigate(-1)}
                                className="
                                mb-5
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

                            <div className="flex items-center gap-3">

                                <Package
                                    size={32}
                                    className="text-blue-600"
                                />

                                <h1 className="text-4xl font-bold">
                                    Merchant Dashboard
                                </h1>

                            </div>

                            <p className="text-gray-500 mt-2">
                                Manage Products • Inventory • Reviews
                            </p>

                        </div>

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                bg-blue-50
                                border
                                border-blue-100
                                rounded-2xl
                                px-6
                                py-4
                                "
                            >

                                <div className="text-sm text-gray-500">
                                    Active Products
                                </div>

                                <div className="text-3xl font-bold text-blue-700">

                                    {products.length}

                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    setShowForm(!showForm)
                                }
                                className={`
                                flex
                                items-center
                                gap-2
                                px-6
                                py-3
                                rounded-2xl
                                text-white
                                font-semibold
                                shadow-md
                                hover:shadow-lg
                                transition-all

                                ${showForm
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                    }
                                `}
                            >

                                {
                                    showForm ? (
                                        <>
                                            <X size={18} />
                                            Close Form
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Add Product
                                        </>
                                    )
                                }

                            </button>

                        </div>

                    </div>

                </div>

                {/* ================= FORM ================= */}

                {
                    showForm && (

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <div className="bg-white p-8 rounded-2xl shadow mb-8">

                                <div className="flex justify-between items-start mb-6">

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            {editId
                                                ? "Update Product"
                                                : "Add New Product"}

                                        </h2>

                                        <p className="text-gray-500 mt-1">

                                            AI will generate product details,
                                            specifications and highlights automatically.

                                        </p>

                                    </div>

                                    {editId && (

                                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">

                                            Editing Mode

                                        </span>

                                    )}

                                </div>

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* PRICE */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            Selling Price
                                        </label>

                                        <div className="relative">

                                            <IndianRupee
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
                                                name="price"
                                                type="number"
                                                placeholder="Enter Selling Price"
                                                value={form.price}
                                                onChange={handleChange}
                                                className="
                                                        w-full
                                                        pl-11
                                                        p-4
                                                        border
                                                        rounded-xl
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-green-500
                                                        "
                                            />

                                        </div>

                                    </div>

                                    {/* MRP */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            MRP
                                        </label>

                                        <div className="relative">

                                            <IndianRupee
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
                                                name="mrp"
                                                type="number"
                                                placeholder="Enter MRP"
                                                value={form.mrp}
                                                onChange={handleChange}
                                                className="
                                                        w-full
                                                        pl-11
                                                        p-4
                                                        border
                                                        rounded-xl
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-green-500
                                                        "
                                            />

                                        </div>

                                    </div>

                                    {/* DISCOUNT */}

                                    {
                                        form.price &&
                                        form.mrp &&
                                        Number(form.mrp) > Number(form.price) && (

                                            <div className="md:col-span-2">

                                                <div
                                                    className="
                                                            flex
                                                            justify-between
                                                            items-center
                                                            bg-green-50
                                                            border
                                                            border-green-200
                                                            rounded-2xl
                                                            px-5
                                                            py-4
                                                            "
                                                >

                                                    <span className="font-medium text-green-700">
                                                        Discount Available
                                                    </span>

                                                    <span
                                                        className="
                                                                bg-green-600
                                                                text-white
                                                                px-3
                                                                py-1
                                                                rounded-full
                                                                text-sm
                                                                font-semibold
                                                                "
                                                    >
                                                        {
                                                            Math.round(
                                                                (
                                                                    (form.mrp - form.price)
                                                                    / form.mrp
                                                                ) * 100
                                                            )
                                                        }
                                                        % OFF
                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    }

                                    {/* STOCK */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            Available Stock
                                        </label>

                                        <div className="relative">

                                            <Package
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
                                                type="number"
                                                name="stock"
                                                placeholder="Available Stock"
                                                value={form.stock}
                                                onChange={handleChange}
                                                className="
                                                        w-full
                                                        pl-11
                                                        p-4
                                                        border
                                                        rounded-xl
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-green-500
                                                        "
                                            />

                                        </div>

                                    </div>

                                    {/* CATEGORY */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            Category
                                        </label>

                                        <div className="relative">

                                            <FolderOpen
                                                size={18}
                                                className="
                                                        absolute
                                                        left-4
                                                        top-1/2
                                                        -translate-y-1/2
                                                        text-gray-400
                                                        z-10
                                                        "
                                            />

                                            <select
                                                name="categoryId"
                                                value={form.categoryId}
                                                onChange={handleChange}
                                                className="
                                                        w-full
                                                        pl-11
                                                        p-4
                                                        border
                                                        rounded-xl
                                                        bg-white
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-green-500
                                                        "
                                            >

                                                <option value="">
                                                    Select Category
                                                </option>

                                                {categories.map(c => (

                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>

                                                ))}

                                            </select>

                                        </div>

                                    </div>



                                    <div>

                                        <div className="md:col-span-2">

                                            <label className="block font-semibold mb-2">
                                                Product Colors
                                            </label>

                                            {/* Search Box */}
                                            <div className="relative">

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
                                                    placeholder="Search colors..."
                                                    value={colorSearch}
                                                    onChange={(e) =>
                                                        setColorSearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="
                                                        w-full
                                                        pl-11
                                                        pr-4
                                                        py-3
                                                        border
                                                        border-gray-300
                                                        rounded-xl
                                                        bg-white
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-blue-500
                                                        focus:border-blue-500
                                                        "
                                                />

                                            </div>

                                            {/* Color List */}
                                            <div
                                                className="
                                                max-h-56
                                                overflow-y-auto
                                                border
                                                border-gray-200
                                                rounded-2xl
                                                mt-3
                                                p-3
                                                bg-gray-50
                                                "
                                            >

                                                <div className="grid grid-cols-2 gap-3">

                                                    {filteredColors.map((color) => (

                                                        <button
                                                            key={color.name}
                                                            type="button"
                                                            onClick={() => {

                                                                if (
                                                                    !form.colors.includes(
                                                                        color.name
                                                                    )
                                                                ) {

                                                                    setForm({
                                                                        ...form,
                                                                        colors: [
                                                                            ...form.colors,
                                                                            color.name
                                                                        ]
                                                                    });

                                                                }

                                                            }}
                                                            className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                            bg-white
                                                            border
                                                            border-gray-200
                                                            rounded-xl
                                                            px-3
                                                            py-2.5
                                                            hover:border-blue-500
                                                            hover:shadow-md
                                                            hover:-translate-y-0.5
                                                            transition-all
                                                            duration-200
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                w-6
                                                                h-6
                                                                rounded-full
                                                                border-2
                                                                border-white
                                                                shadow-sm
                                                                "
                                                                style={{
                                                                    backgroundColor:
                                                                        color.hex
                                                                }}
                                                            />

                                                            <span
                                                                className="
                                                                text-sm
                                                                font-medium
                                                                text-gray-700
                                                                "
                                                            >
                                                                {color.name}
                                                            </span>

                                                        </button>

                                                    ))}

                                                </div>

                                            </div>

                                            {/* Selected Colors */}
                                            {form.colors.length > 0 && (

                                                <>

                                                    <h4 className="font-semibold mt-4 mb-2">

                                                        Selected Colors
                                                        <span className="text-gray-500 ml-2">
                                                            ({form.colors.length})
                                                        </span>

                                                    </h4>

                                                    <div className="flex flex-wrap gap-2 mt-4">

                                                        {form.colors.map((color) => {

                                                            const colorObj =
                                                                COLORS.find(
                                                                    c => c.name === color
                                                                );

                                                            return (

                                                                <div
                                                                    key={color}
                                                                    className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                    bg-blue-50
                                                                    text-blue-700
                                                                    px-3
                                                                    py-1.5
                                                                    rounded-full
                                                                    text-sm
                                                                    font-medium
                                                                    "
                                                                >

                                                                    <span
                                                                        className="
                                                                        w-3
                                                                        h-3
                                                                        rounded-full
                                                                        "
                                                                        style={{
                                                                            backgroundColor:
                                                                                colorObj?.hex
                                                                        }}
                                                                    />

                                                                    <span>
                                                                        {color}
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setForm({
                                                                                ...form,
                                                                                colors: form.colors.filter(
                                                                                    c => c !== color
                                                                                )
                                                                            })
                                                                        }
                                                                        className="
                                                                        hover:text-red-600
                                                                        transition
                                                                        "
                                                                    >
                                                                        <X size={14} />
                                                                    </button>

                                                                </div>

                                                            );

                                                        })}

                                                    </div>

                                                </>

                                            )}

                                        </div>

                                    </div>

                                </div>

                                {/* IMAGE UPLOAD */}

                                <div className="mt-8">

                                    <div className="flex items-center gap-2 mb-4">

                                        <ImagePlus
                                            size={20}
                                            className="text-green-600"
                                        />

                                        <label className="font-semibold text-lg">
                                            Product Images
                                        </label>

                                    </div>

                                    <label
                                        className="
                                    block
                                    border-2
                                    border-dashed
                                    border-gray-300
                                    rounded-3xl
                                    p-10
                                    text-center
                                    cursor-pointer
                                    hover:border-green-500
                                    hover:bg-green-50
                                    transition-all
                                    "
                                    >

                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={(e) =>
                                                setFiles(
                                                    Array.from(
                                                        e.target.files
                                                    )
                                                )
                                            }
                                        />

                                        <UploadCloud
                                            size={42}
                                            className="
                                        mx-auto
                                        text-green-600
                                        mb-3
                                        "
                                        />

                                        <h3 className="font-semibold text-lg">
                                            Upload Product Images
                                        </h3>

                                        <p className="text-gray-500 mt-1">
                                            Drag & drop or click to browse
                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">
                                            JPG, PNG, WEBP supported
                                        </p>

                                    </label>

                                </div>

                                {files.length > 0 && (

                                    <div className="mt-5">

                                        <h4 className="font-semibold mb-3">

                                            Uploaded Images

                                            <span className="text-gray-500 ml-2">
                                                ({files.length})
                                            </span>

                                        </h4>

                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                                            {files.map((file, index) => (

                                                <div
                                                    key={index}
                                                    className="
                                                    relative
                                                    rounded-2xl
                                                    overflow-hidden
                                                    border
                                                    bg-white
                                                    shadow-sm
                                                    "
                                                >

                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt=""
                                                        className="
                                                        w-full
                                                        h-28
                                                        object-cover
                                                        "
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFiles(
                                                                files.filter(
                                                                    (_, i) =>
                                                                        i !== index
                                                                )
                                                            )
                                                        }
                                                        className="
                                                        absolute
                                                        top-2
                                                        right-2
                                                        bg-white
                                                        rounded-full
                                                        p-1
                                                        shadow
                                                        hover:bg-red-50
                                                        "
                                                    >

                                                        <X
                                                            size={14}
                                                            className="text-red-500"
                                                        />

                                                    </button>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                )}

                                {/* ================= BUTTON SECTION ================= */}

                                <div className="mt-8 pt-6 border-t">

                                    {/* AI Processing Card */}

                                    {loading && (

                                        <div
                                            className="
                                                    mb-5
                                                    rounded-xl
                                                    border
                                                    border-blue-200
                                                    bg-blue-50
                                                    p-4
                                                    animate-pulse
                                                "
                                        >

                                            <div className="flex items-start gap-3">

                                                <div
                                                    className="
                                                            w-6
                                                            h-6
                                                            border-[3px]
                                                            border-blue-600
                                                            border-t-transparent
                                                            rounded-full
                                                            animate-spin
                                                            mt-1
                                                        "
                                                />

                                                <div className="flex-1">

                                                    <h3 className="text-blue-700 font-semibold">

                                                        {
                                                            editId
                                                                ? "Updating Product using AI..."
                                                                : "Generating Product using AI..."
                                                        }

                                                    </h3>

                                                    <p className="text-sm text-gray-600 mt-1">

                                                        {
                                                            editId
                                                                ? "Analyzing uploaded images • Refreshing description • Updating specifications • Saving product..."
                                                                : "Uploading images • Detecting product • Generating description • Creating specifications • Saving product..."
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* Buttons */}

                                    <div className="flex justify-end gap-3">

                                        {editId && (

                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                disabled={loading}
                                                className="
                                                        px-5
                                                        h-11
                                                        rounded-xl
                                                        border
                                                        bg-white
                                                        text-gray-700
                                                        hover:bg-gray-100
                                                        transition
                                                        disabled:opacity-60
                                                    "
                                            >

                                                Cancel

                                            </button>

                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`
                                                    min-w-[220px]
                                                    h-11
                                                    rounded-xl
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    font-semibold
                                                    transition-all

                                                    ${loading
                                                    ? "bg-gray-600 text-white cursor-not-allowed"
                                                    : editId
                                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                        : "bg-green-600 hover:bg-green-700 text-white"
                                                }
                                                `}
                                        >

                                            {loading ? (

                                                <>

                                                    <div
                                                        className="
                                                                w-4
                                                                h-4
                                                                border-2
                                                                border-white
                                                                border-t-transparent
                                                                rounded-full
                                                                animate-spin
                                                            "
                                                    />

                                                    {
                                                        editId
                                                            ? "Updating..."
                                                            : "Generating..."
                                                    }

                                                </>

                                            ) : (

                                                editId ? (

                                                    <>

                                                        <Pencil size={16} />

                                                        Update Product

                                                    </>

                                                ) : (

                                                    <>

                                                        <Plus size={16} />

                                                        Generate & Add Product

                                                    </>

                                                )

                                            )}

                                        </button>

                                    </div>

                                </div>

                            </div>
                        </form>

                    )
                }

                {/* ================= STATS ================= */}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

                    <div className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition">

                        <div className="flex items-center gap-2 text-gray-500 text-sm">

                            <Package size={16} />

                            <span>Total Products</span>

                        </div>

                        <h2 className="text-3xl font-bold mt-2">
                            {products.length}
                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition">

                        <div className="flex items-center gap-2 text-gray-500 text-sm">

                            <Boxes size={16} />

                            <span>In Stock</span>

                        </div>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">

                            {
                                products.filter(
                                    p => p.stock > 0
                                ).length
                            }

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition">

                        <div className="flex items-center gap-2 text-gray-500 text-sm">

                            <CircleAlert size={16} />

                            <span>Out Of Stock</span>

                        </div>

                        <h2 className="text-3xl font-bold text-red-600 mt-2">

                            {
                                products.filter(
                                    p => p.stock <= 0
                                ).length
                            }

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition">

                        <div className="flex items-center gap-2 text-gray-500 text-sm">

                            <Star size={16} />

                            <span>Total Reviews</span>

                        </div>

                        <h2 className="text-3xl font-bold text-yellow-500 mt-2">

                            {
                                products.reduce(
                                    (sum, p) =>
                                        sum +
                                        (p.totalReviews || 0),
                                    0
                                )
                            }

                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition">

                        <div className="flex items-center gap-2 text-gray-500 text-sm">

                            <IndianRupee size={16} />

                            <span>Inventory Value</span>

                        </div>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">

                            ₹{
                                products
                                    .reduce(
                                        (sum, p) =>
                                            sum +
                                            (p.price * p.stock),
                                        0
                                    )
                                    .toLocaleString("en-IN")
                            }

                        </h2>

                    </div>

                </div>

                {/* ================= LOW STOCK ALERT ================= */}

                {
                    products.some(
                        p => p.stock <= 5
                    ) && (

                        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6">

                            <div className="flex items-center gap-2">

                                <CircleAlert
                                    size={20}
                                    className="text-amber-600"
                                />

                                <h3 className="font-bold text-amber-700 text-lg">
                                    Attention Required
                                </h3>

                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                                Products running low on inventory
                            </p>

                            <div className="mt-3 space-y-2">

                                {
                                    products
                                        .filter(
                                            p => p.stock <= 5
                                        )
                                        .map(p => (

                                            <div
                                                key={p.id}
                                                className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border"
                                            >

                                                <div className="flex items-center gap-2">

                                                    <Package
                                                        size={16}
                                                        className="text-gray-500"
                                                    />

                                                    <span>
                                                        {p.name}
                                                    </span>

                                                </div>

                                                <span className="font-semibold text-red-600">
                                                    {p.stock} left
                                                </span>

                                            </div>

                                        ))
                                }

                            </div>

                        </div>

                    )
                }
                {/* ================= PRODUCTS ================= */}
                <div
                    className=" grid grid-cols-4 gap-5 "
                >

                    {products.length === 0 && (
                        <div className="col-span-full bg-white rounded-2xl shadow p-12 text-center">

                            <h2 className="text-2xl font-bold">
                                No Products Yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Add your first product to start selling
                            </p>

                        </div>
                    )}

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

                                    <div className="flex items-center gap-1 text-blue-600 text-[13px] font-medium">

                                        <Truck size={14} />

                                        <span>
                                            Free Delivery
                                        </span>

                                    </div>

                                    {
                                        p.stock > 5 ? (

                                            <span className="text-green-600 text-[12px] font-semibold">
                                                Stock: {p.stock}
                                            </span>

                                        ) : (

                                            <span className="text-red-500 text-[12px] font-semibold">
                                                Only {p.stock} Left
                                            </span>

                                        )
                                    }

                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-4">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/product/${p.id}`);
                                        }

                                        }
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-1
                                            bg-green-600
                                            hover:bg-green-700
                                            text-white
                                            py-2
                                            rounded-lg
                                            text-sm
                                            "
                                    >

                                        <Eye size={16} />
                                        View

                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(p);
                                        }}

                                        className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-1
                                                    bg-blue-600
                                                    hover:bg-blue-700
                                                    text-white
                                                    py-2
                                                    rounded-lg
                                                    text-sm
                                                    "
                                    >

                                        <Pencil size={16} />
                                        Edit

                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(p.id);
                                        }}

                                        className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-1
                                                bg-red-600
                                                hover:bg-red-700
                                                text-white
                                                py-2
                                                rounded-lg
                                                text-sm
                                                "
                                    >

                                        <Trash2 size={16} />
                                        Delete

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}

export default Product;