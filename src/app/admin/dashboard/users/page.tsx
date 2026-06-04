"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, UserX, User2 } from "lucide-react"

type UserRow = { id: string; name: string | null; email: string | null; role: string; createdAt: string; _count?: { bookings: number } }

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/admin/users")
            .then((r) => r.json())
            .then((d) => setUsers(d.users || []))
            .finally(() => setIsLoading(false))
    }, [])

    async function blockUser(id: string) {
        if (!confirm("Block this user? They will not be able to sign in.")) return
        await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "block" }) })
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    const filtered = users.filter((u) => {
        const matchSearch = !search || (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
        const matchRole = roleFilter === "ALL" || u.role === roleFilter
        return matchSearch && matchRole
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-primary">User Management</h1>
                <p className="text-secondary text-sm mt-0.5">{users.length} total users on the platform</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-2.5 text-primary text-sm outline-none focus:border-primary placeholder:text-muted" />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-surface border border-border rounded-xl px-4 py-2.5 text-primary text-sm outline-none">
                    {["ALL", "USER", "PROVIDER", "ADMIN"].map((r) => <option key={r} value={r} className="bg-surface text-primary">{r === "ALL" ? "All Roles" : r}</option>)}
                </select>
            </div>

            {isLoading ? (
                <div className="space-y-3">{[1, 2, 3, 4, 5].map((n) => <div key={n} className="h-16 rounded-2xl bg-white/5 animate-pulse border border-white/10" />)}</div>
            ) : (
                <div className="rounded-3xl border border-border bg-surface overflow-hidden shadow-sm">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-bold text-muted uppercase tracking-wider bg-background/50">
                        <div className="col-span-4">User</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Joined</div>
                        <div className="col-span-1">Actions</div>
                    </div>
                    {filtered.map((u, i) => (
                        <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-stone-50 items-center transition-colors">
                            <div className="md:col-span-4 flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-sm shrink-0">
                                    {u.name?.charAt(0) || "?"}
                                </div>
                                <p className="font-bold text-primary text-sm">{u.name || "—"}</p>
                            </div>
                            <div className="md:col-span-3"><p className="text-secondary text-sm truncate">{u.email}</p></div>
                            <div className="md:col-span-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${u.role === "ADMIN" ? "bg-red-500/10 text-red-400 border-red-500/20" : u.role === "PROVIDER" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                                    {u.role}
                                </span>
                            </div>
                            <div className="md:col-span-2"><p className="text-muted text-xs">{new Date(u.createdAt).toLocaleDateString("en-IN")}</p></div>
                            <div className="md:col-span-1">
                                <button onClick={() => blockUser(u.id)} className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors" title="Block user">
                                    <UserX size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-12"><User2 size={36} className="mx-auto text-gray-600 mb-2" /><p className="text-gray-500">No users found</p></div>
                    )}
                </div>
            )}
        </div>
    )
}
