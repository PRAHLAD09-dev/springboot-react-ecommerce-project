import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft, Grid3X3, Trash2, Plus, Search } from "lucide-react";
import { Card, Button, Input, EmptyState } from "../../components/ui";

function Category() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchCategories = async () => {
        try {
            const res = await API.get("/categories", { headers: { Authorization: `Bearer ${token}` } });
            setCategories(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        setError("");
        if (!name.trim()) {
            setError("Enter a category name");
            return;
        }

        try {
            setLoading(true);
            await API.post(`/categories?name=${name}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setName("");
            fetchCategories();
        } catch (err) {
            console.log(err);
            setError("Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            setDeletingId(id);
            await API.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchCategories();
        } catch (err) {
            console.log(err);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCategories = categories.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase().trim()));

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">Category Management</h1>
            </div>

            <Card className="mb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex-1">
                        <Input
                            placeholder="Enter category name"
                            value={name}
                            error={error}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <Button icon={Plus} loading={loading} onClick={handleAdd} className="sm:mt-0">
                        Add category
                    </Button>
                </div>
            </Card>

            {categories.length > 0 && (
                <div className="relative mb-5 max-w-sm">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-base pl-10"
                    />
                </div>
            )}

            {filteredCategories.length === 0 ? (
                <EmptyState
                    icon={Grid3X3}
                    title={categories.length === 0 ? "No categories yet" : "No matching categories"}
                    description={categories.length === 0 ? "Add your first category above." : "Try a different search term."}
                />
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredCategories.map((c) => (
                        <Card key={c.id} padding="sm" hover className="group relative flex flex-col items-center gap-2 py-6 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                                <Grid3X3 size={18} />
                            </div>
                            <span className="line-clamp-2 text-sm font-semibold text-ink-800">{c.name}</span>
                            <button
                                onClick={() => handleDelete(c.id)}
                                disabled={deletingId === c.id}
                                aria-label={`Delete ${c.name}`}
                                className="absolute right-2 top-2 rounded-lg p-1.5 text-ink-300 opacity-0 transition-all hover:bg-danger-50 hover:text-danger-600 group-hover:opacity-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
