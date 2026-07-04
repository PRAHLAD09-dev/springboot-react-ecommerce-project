import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ArrowLeft, Users as UsersIcon, Search, Mail, ShieldCheck } from "lucide-react";
import { Avatar, Badge, EmptyState, SectionHeader, TableContainer, Thead, Th, Tbody, Tr, Td, Drawer, Pagination } from "../../components/ui";
import { SkeletonTable } from "../../components/ui/Skeleton";

const ROLE_VARIANT = { ADMIN: "danger", MERCHANT: "success", USER: "brand" };
const ROLE_FILTERS = ["ALL", "USER", "MERCHANT", "ADMIN"];

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const PER_PAGE = 8;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u) => {
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        const q = search.toLowerCase().trim();
        const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
        return matchesRole && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));
    const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div>
            <div className="mb-5 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                    <ArrowLeft size={18} />
                </button>
                <SectionHeader
                    title="Users Management"
                    subtitle={`${users.length} registered ${users.length === 1 ? "user" : "users"}`}
                    className="mb-0 flex-1"
                />
            </div>

            {!loading && users.length > 0 && (
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input-base pl-10"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ROLE_FILTERS.map((r) => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    roleFilter === r ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                                }`}
                            >
                                {r === "ALL" ? "All roles" : r}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <TableContainer>
                    <Thead><Th>User</Th><Th>Email</Th><Th>Role</Th></Thead>
                    <SkeletonTable rows={6} cols={3} />
                </TableContainer>
            ) : filteredUsers.length === 0 ? (
                <EmptyState
                    icon={UsersIcon}
                    title={users.length === 0 ? "No users found" : "No matching users"}
                    description={users.length === 0 ? "Registered users will appear here." : "Try a different search or filter."}
                />
            ) : (
                <>
                    <TableContainer>
                        <Thead>
                            <Th>User</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                        </Thead>
                        <Tbody>
                            {paginatedUsers.map((u) => (
                                <Tr key={u.id} onClick={() => setSelectedUser(u)} className="cursor-pointer">
                                    <Td>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={u.name || "User"} size="sm" />
                                            <span className="font-semibold text-ink-900">{u.name || "No Name"}</span>
                                        </div>
                                    </Td>
                                    <Td>{u.email}</Td>
                                    <Td>
                                        <Badge variant={ROLE_VARIANT[u.role] || "neutral"}>{u.role}</Badge>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </TableContainer>

                    {totalPages > 1 && (
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
                    )}
                </>
            )}

            {/* USER DETAILS DRAWER */}
            <Drawer open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User details">
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar name={selectedUser.name || "User"} size="lg" />
                            <div>
                                <p className="text-lg font-bold text-ink-900">{selectedUser.name || "No Name"}</p>
                                <Badge variant={ROLE_VARIANT[selectedUser.role] || "neutral"} className="mt-1">{selectedUser.role}</Badge>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-xl border border-ink-100 bg-ink-50 p-4">
                            <div className="flex items-center gap-2.5 text-sm">
                                <Mail size={14} className="text-brand-600" />
                                <span className="text-ink-700">{selectedUser.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm">
                                <ShieldCheck size={14} className="text-brand-600" />
                                <span className="text-ink-700">User ID: {selectedUser.id}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

export default Users;
