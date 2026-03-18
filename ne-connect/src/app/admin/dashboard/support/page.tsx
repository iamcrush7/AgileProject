"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"

type Ticket = {
    id: string
    subject: string
    description: string
    status: string
    createdAt: string
    user: { name: string | null; email: string | null }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    OPEN: { label: "Open", color: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
    IN_PROGRESS: { label: "In Progress", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
    RESOLVED: { label: "Resolved", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle },
}

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [isLoading, setIsLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/admin/support")
            .then((r) => r.json())
            .then((d) => setTickets(d.tickets || []))
            .finally(() => setIsLoading(false))
    }, [])

    async function updateStatus(id: string, status: string) {
        setUpdating(id)
        const res = await fetch("/api/admin/support", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        })
        if (res.ok) {
            setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
        }
        setUpdating(null)
    }

    const filtered = tickets.filter((t) => {
        const matchSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.name?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "ALL" || t.status === statusFilter
        return matchSearch && matchStatus
    })

    const openCount = tickets.filter((t) => t.status === "OPEN").length

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-primary">Support Tickets</h1>
                    <p className="text-secondary text-sm mt-0.5">{tickets.length} total tickets</p>
                </div>
                {openCount > 0 && (
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-2.5 rounded-xl">
                        <AlertCircle size={16} />
                        {openCount} Open
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search by subject or user..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-2.5 text-primary text-sm outline-none focus:border-primary placeholder:text-muted" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-surface border border-border rounded-xl px-4 py-2.5 text-primary text-sm outline-none">
                    {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
                        <option key={s} value={s} className="bg-surface text-primary">{s === "ALL" ? "All Tickets" : s.replace("_", " ")}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-24 rounded-xl bg-stone-100 animate-pulse border border-border" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-border bg-surface">
                    <MessageSquare size={40} className="mx-auto text-muted mb-4" />
                    <p className="text-primary font-semibold">No tickets found</p>
                    <p className="text-secondary text-sm mt-1">All support tickets will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((t, i) => {
                        const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.OPEN
                        const StatusIcon = sc.icon
                        return (
                            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-bold text-primary truncate">{t.subject}</p>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold shrink-0 ${sc.color}`}>
                                                <StatusIcon size={11} />
                                                {sc.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2 line-clamp-2">{t.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted">
                                            <span>👤 {t.user.name || "Unknown"}</span>
                                            <span>•</span>
                                            <span>{new Date(t.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {t.status !== "RESOLVED" && (
                                            <>
                                                {t.status === "OPEN" && (
                                                    <button onClick={() => updateStatus(t.id, "IN_PROGRESS")} disabled={updating === t.id}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50">
                                                        Start Review
                                                    </button>
                                                )}
                                                <button onClick={() => updateStatus(t.id, "RESOLVED")} disabled={updating === t.id}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50">
                                                    {updating === t.id ? "..." : "Mark Resolved"}
                                                </button>
                                            </>
                                        )}
                                        {t.status === "RESOLVED" && (
                                            <CheckCircle size={18} className="text-emerald-500" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
