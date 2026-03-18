"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, Loader2, Play, MapPin, Phone, Mail } from "lucide-react"

type Booking = {
    id: string
    status: string
    date: string
    time: string
    totalPrice: number
    notes: string | null
    user: { name: string | null; email: string; phone: string | null; city: string | null; state: string | null }
    service: { name: string }
}

const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pending", color: "bg-amber-100/50 text-amber-700 border-amber-200" },
    CONFIRMED: { label: "Confirmed", color: "bg-blue-100/50 text-blue-700 border-blue-200" },
    IN_PROGRESS: { label: "In Progress", color: "bg-purple-100/50 text-purple-700 border-purple-200" },
    COMPLETED: { label: "Completed", color: "bg-emerald-100/50 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Cancelled", color: "bg-stone-100/50 text-stone-700 border-stone-200" },
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
                <h1 className="text-2xl font-bold text-primary tracking-tight">Requests & Jobs</h1>
                <p className="text-secondary text-sm mt-0.5 font-medium">Manage incoming booking requests and active jobs</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as any)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${tab === t.key ? "bg-primary text-background shadow-md shadow-primary/20" : "bg-stone-100 border border-border text-secondary hover:text-primary hover:bg-stone-200"
                            }`}
                    >
                        <span>{t.label}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-background/20 text-background" : "bg-stone-200 text-secondary"}`}>
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
                            className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all shadow-sm group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <p className="font-bold text-primary text-lg">{b.service.name}</p>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig[b.status]?.color}`}>
                                            {statusConfig[b.status]?.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-secondary font-medium mb-3">
                                        <span className="flex items-center gap-1.5">👤 <span className="text-primary font-bold">{b.user.name}</span></span>
                                        <span className="flex items-center gap-1.5">📅 {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                        <span className="flex items-center gap-1.5">🕐 {b.time}</span>
                                        <span className="font-bold text-primary px-2 py-0.5 bg-stone-100 rounded-md">₹{b.totalPrice.toLocaleString()}</span>
                                    </div>

                                    {/* Customer Location */}
                                    {(() => {
                                        const lines = (b.notes || "").split("\n")
                                        const addrLine = lines.find((l) => l.startsWith("SERVICE ADDRESS:"))
                                        const address = addrLine ? addrLine.replace("SERVICE ADDRESS:", "").trim() : null
                                        const extraNotes = lines.filter((l) => !l.startsWith("SERVICE ADDRESS:")).join("\n").trim()
                                        const cityState = [b.user.city, b.user.state].filter(Boolean).join(", ")
                                        const hasAny = address || cityState
                                        return (
                                            <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <MapPin size={12} /> Customer Location
                                                </p>
                                                {address ? (
                                                    <div className="mb-1.5">
                                                        <p className="text-sm font-bold text-blue-900 leading-snug">📍 {address}</p>
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="inline-block mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-900 underline underline-offset-2 transition-colors"
                                                        >
                                                            Open in Google Maps →
                                                        </a>
                                                    </div>
                                                ) : null}
                                                {cityState ? (
                                                    <p className="text-xs text-blue-600 font-medium">🏙️ {cityState}</p>
                                                ) : null}
                                                {!hasAny && (
                                                    <p className="text-xs text-blue-400 italic">No address provided by customer</p>
                                                )}
                                                {extraNotes ? (
                                                    <p className="mt-2 text-xs text-secondary bg-stone-50 border border-stone-100 rounded-lg px-3 py-2 italic">"{extraNotes}"</p>
                                                ) : null}
                                                <div className="flex flex-wrap gap-3 pt-1.5 border-t border-blue-100 mt-2">
                                                    {b.user.phone && (
                                                        <a href={`tel:${b.user.phone}`} className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors">
                                                            <Phone size={11} /> {b.user.phone}
                                                        </a>
                                                    )}
                                                    {b.user.email && (
                                                        <a href={`mailto:${b.user.email}`} className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors">
                                                            <Mail size={11} /> {b.user.email}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    {b.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, "CONFIRMED")}
                                                disabled={updating === b.id}
                                                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                            >
                                                {updating === b.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                <span>Accept</span>
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, "CANCELLED")}
                                                disabled={updating === b.id}
                                                className="flex items-center space-x-1.5 px-4 py-2 bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
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
                                            className="flex items-center space-x-1.5 px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                        >
                                            <Play size={14} />
                                            <span>Start Job</span>
                                        </button>
                                    )}
                                    {b.status === "IN_PROGRESS" && (
                                        <button
                                            onClick={() => updateStatus(b.id, "COMPLETED")}
                                            disabled={updating === b.id}
                                            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
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
