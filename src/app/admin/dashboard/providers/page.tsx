"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ShieldCheck, ShieldOff, Briefcase, Trash2 } from "lucide-react"

type Provider = {
    id: string
    businessName: string | null
    verified: boolean
    stateServed: string | null
    experience: number
    user: { name: string | null; email: string | null }
    _count?: { reviews: number; bookings: number }
}

export default function AdminProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([])
    const [search, setSearch] = useState("")
    const [verifiedFilter, setVerifiedFilter] = useState("ALL")
    const [isLoading, setIsLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/admin/providers")
            .then((r) => r.json())
            .then((d) => setProviders(d.providers || []))
            .finally(() => setIsLoading(false))
    }, [])

    async function toggleVerification(id: string, current: boolean) {
        setUpdating(id)
        const res = await fetch(`/api/admin/providers/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verified: !current }),
        })
        if (res.ok) {
            setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, verified: !current } : p)))
        }
        setUpdating(null)
    }

    async function deleteProvider(id: string, name: string) {
        if (!confirm(`Are you sure you want to permanently remove "${name}"? This will delete their account, services, and all bookings.`)) return
        setDeleting(id)
        const res = await fetch(`/api/admin/providers/${id}`, { method: "DELETE" })
        if (res.ok) {
            setProviders((prev) => prev.filter((p) => p.id !== id))
        }
        setDeleting(null)
    }

    const filtered = providers.filter((p) => {
        const matchSearch = !search || (p.businessName?.toLowerCase().includes(search.toLowerCase()) || p.user.name?.toLowerCase().includes(search.toLowerCase()) || p.stateServed?.toLowerCase().includes(search.toLowerCase()))
        const matchVerified = verifiedFilter === "ALL" || (verifiedFilter === "VERIFIED" ? p.verified : !p.verified)
        return matchSearch && matchVerified
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-primary">Provider Management</h1>
                <p className="text-secondary text-sm mt-0.5">Verify and manage service providers</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search providers..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-2.5 text-primary text-sm outline-none focus:border-primary placeholder:text-muted" />
                </div>
                <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} className="bg-surface border border-border rounded-xl px-4 py-2.5 text-primary text-sm outline-none">
                    {[["ALL", "All Providers"], ["VERIFIED", "Verified"], ["PENDING", "Pending Verification"]].map(([v, l]) => (
                        <option key={v} value={v} className="bg-surface text-primary">{l}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1, 2, 3, 4].map((n) => <div key={n} className="h-36 rounded-2xl bg-white/5 animate-pulse border border-white/10" />)}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-extrabold text-primary">{p.businessName || p.user.name}</p>
                                    <p className="text-muted text-xs mt-0.5">{p.user.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${p.verified ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                                    {p.verified ? "Verified" : "Pending"}
                                </span>
                            </div>
                             <div className="flex items-center space-x-3 text-xs text-secondary mb-4">
                                <span>📍 {p.stateServed || "N/A"}</span>
                                <span>•</span>
                                <span>{p.experience}yr exp</span>
                                {p._count && <><span>•</span><span>{p._count.bookings} bookings</span></>}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => toggleVerification(p.id, p.verified)}
                                    disabled={updating === p.id}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${p.verified
                                            ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                                            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                        } disabled:opacity-50`}
                                >
                                    {p.verified ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                                    <span>{p.verified ? "Revoke" : "Approve"}</span>
                                </button>
                                <button
                                    onClick={() => deleteProvider(p.id, p.businessName || p.user.name || "this provider")}
                                    disabled={deleting === p.id}
                                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600/20 transition-all disabled:opacity-50"
                                >
                                    {deleting === p.id
                                        ? <span className="animate-spin w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full" />
                                        : <Trash2 size={14} />}
                                    <span>Remove</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-12 rounded-2xl border border-white/10 bg-white/5">
                            <Briefcase size={36} className="mx-auto text-gray-600 mb-2" />
                            <p className="text-gray-500">No providers found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
