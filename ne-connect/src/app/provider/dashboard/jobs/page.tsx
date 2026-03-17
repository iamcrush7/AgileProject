"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle, Play } from "lucide-react"

type Booking = {
    id: string
    status: string
    date: string
    time: string
    totalPrice: number
    notes: string | null
    user: { name: string | null; email: string; phone: string | null }
    service: { name: string }
}

const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    IN_PROGRESS: { label: "In Progress", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-400 border-red-500/20" },
}

export default function ProviderJobsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [tab, setTab] = useState<"PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "ALL">("PENDING")
    const [isLoading, setIsLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/bookings?role=provider")
            .then((r) => r.json())
            .then((d) => setBookings(d.bookings || []))
            .finally(() => setIsLoading(false))
    }, [])

    async function updateStatus(id: string, status: string) {
        setUpdating(id)
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        if (res.ok) {
            setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
        }
        setUpdating(null)
    }

    const filtered = tab === "ALL" ? bookings : bookings.filter((b) => b.status === tab)
    const tabs = [
        { key: "PENDING", label: "Pending", count: bookings.filter((b) => b.status === "PENDING").length },
        { key: "CONFIRMED", label: "Confirmed", count: bookings.filter((b) => b.status === "CONFIRMED").length },
        { key: "IN_PROGRESS", label: "Active", count: bookings.filter((b) => b.status === "IN_PROGRESS").length },
        { key: "COMPLETED", label: "Completed", count: bookings.filter((b) => b.status === "COMPLETED").length },
        { key: "ALL", label: "All", count: bookings.length },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-white">Requests & Jobs</h1>
                <p className="text-gray-400 text-sm mt-0.5">Manage incoming booking requests and active jobs</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as any)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${tab === t.key ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                            }`}
                    >
                        <span>{t.label}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"}`}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((n) => <div key={n} className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/10" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/5">
                    <Clock size={48} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 font-semibold">No {tab === "ALL" ? "" : tab.toLowerCase()} bookings</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((b, i) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <p className="font-extrabold text-white">{b.service.name}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${statusConfig[b.status]?.color}`}>
                                            {statusConfig[b.status]?.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>👤 {b.user.name}</span>
                                        <span>📅 {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                        <span>🕐 {b.time}</span>
                                        <span className="font-bold text-white">₹{b.totalPrice.toLocaleString()}</span>
                                    </div>
                                    {b.notes && <p className="mt-2 text-xs text-gray-600 bg-white/5 rounded-lg px-3 py-1.5">📝 {b.notes}</p>}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    {b.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, "CONFIRMED")}
                                                disabled={updating === b.id}
                                                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                            >
                                                {updating === b.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                <span>Accept</span>
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, "CANCELLED")}
                                                disabled={updating === b.id}
                                                className="flex items-center space-x-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                            >
                                                <XCircle size={14} />
                                                <span>Decline</span>
                                            </button>
                                        </>
                                    )}
                                    {b.status === "CONFIRMED" && (
                                        <button
                                            onClick={() => updateStatus(b.id, "IN_PROGRESS")}
                                            disabled={updating === b.id}
                                            className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                        >
                                            <Play size={14} />
                                            <span>Start Job</span>
                                        </button>
                                    )}
                                    {b.status === "IN_PROGRESS" && (
                                        <button
                                            onClick={() => updateStatus(b.id, "COMPLETED")}
                                            disabled={updating === b.id}
                                            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                        >
                                            <CheckCircle size={14} />
                                            <span>Mark Complete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
