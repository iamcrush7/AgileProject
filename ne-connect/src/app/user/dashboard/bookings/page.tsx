"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, CalendarRange, AlertCircle, X, Plus, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    PENDING: { label: "Pending", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
    CONFIRMED: { label: "Confirmed", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", dot: "bg-blue-400" },
    IN_PROGRESS: { label: "In Progress", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", dot: "bg-purple-400 animate-pulse" },
    COMPLETED: { label: "Completed", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
    CANCELLED: { label: "Cancelled", color: "text-gray-500 bg-gray-500/10 border-gray-500/20", dot: "bg-gray-500" },
}

type Booking = {
    id: string
    service: { name: string; price: number }
    provider: { businessName: string | null; user: { name: string | null }; stateServed: string | null }
    date: string
    time: string
    status: string
    totalPrice: number
    notes: string | null
}

const STATUS_TABS = ["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

export default function UserBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [filtered, setFiltered] = useState<Booking[]>([])
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState("ALL")
    const [isLoading, setIsLoading] = useState(true)
    const [cancelId, setCancelId] = useState<string | null>(null)
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        fetch("/api/bookings")
            .then((r) => r.json())
            .then((d) => {
                const list = d.bookings || []
                setBookings(list)
                setFiltered(list)
            })
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        let result = bookings
        if (search) result = result.filter((b) =>
            b.service.name.toLowerCase().includes(search.toLowerCase()) ||
            (b.provider.businessName || b.provider.user.name || "").toLowerCase().includes(search.toLowerCase())
        )
        if (activeTab !== "ALL") result = result.filter((b) => b.status === activeTab)
        setFiltered(result)
    }, [search, activeTab, bookings])

    async function cancelBooking(id: string) {
        setCancelling(true)
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "CANCELLED" })
        })
        if (res.ok) {
            setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "CANCELLED" } : b))
        }
        setCancelling(false)
        setCancelId(null)
    }

    const tabCounts = STATUS_TABS.reduce((acc, s) => {
        acc[s] = s === "ALL" ? bookings.length : bookings.filter(b => b.status === s).length
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="space-y-6">

            {/* ── Page header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[26px] font-extrabold text-white tracking-tight">My Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and manage all your service bookings</p>
                </div>
                <Link
                    href="/providers"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                >
                    <Plus size={15} /> New Booking
                </Link>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/40 placeholder-gray-600 transition-all"
                    />
                </div>
            </div>

            {/* ── Status tabs ── */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {STATUS_TABS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setActiveTab(s)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === s
                                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                            }`}
                    >
                        {s === "ALL" ? "All" : s.replace("_", " ")}
                        {tabCounts[s] > 0 && (
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeTab === s ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-gray-600"}`}>
                                {tabCounts[s]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Booking list ── */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-[76px] rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                    <CalendarRange size={40} className="mx-auto text-gray-700 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">
                        {bookings.length === 0 ? "No bookings yet" : "No bookings match your filter"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        {bookings.length === 0 ? "Book your first service today!" : "Try changing your status filter"}
                    </p>
                    {bookings.length === 0 && (
                        <Link href="/providers" className="inline-flex items-center gap-1.5 mt-4 text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors">
                            Find providers <ArrowRight size={13} />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-[#111114] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {/* Table header */}
                    <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 border-b border-white/[0.06] text-[11px] font-black uppercase tracking-widest text-gray-600">
                        <div className="col-span-4">Service</div>
                        <div className="col-span-3">Provider</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1">Price</div>
                        <div className="col-span-2">Status</div>
                    </div>

                    <AnimatePresence>
                        {filtered.map((b, i) => {
                            const sc = statusConfig[b.status] || statusConfig.PENDING
                            return (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-3 px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors items-center"
                                >
                                    {/* Service */}
                                    <div className="md:col-span-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shrink-0">
                                            <CalendarRange size={13} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold text-white leading-none mb-0.5">{b.service.name}</p>
                                            {b.notes && <p className="text-xs text-gray-600 truncate max-w-[160px]">{b.notes}</p>}
                                        </div>
                                    </div>

                                    {/* Provider */}
                                    <div className="md:col-span-3">
                                        <p className="text-[13px] text-gray-300 font-medium truncate">
                                            {b.provider.businessName || b.provider.user.name}
                                        </p>
                                        {b.provider.stateServed && (
                                            <p className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                                                <MapPin size={9} />{b.provider.stateServed}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div className="md:col-span-2">
                                        <p className="text-[13px] text-gray-300 font-medium">
                                            {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">{b.time}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="md:col-span-1">
                                        <p className="text-[13px] font-bold text-white">₹{b.totalPrice?.toLocaleString()}</p>
                                    </div>

                                    {/* Status + Cancel */}
                                    <div className="md:col-span-2 flex items-center gap-2">
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                            {sc.label}
                                        </span>
                                        {["PENDING", "CONFIRMED"].includes(b.status) && (
                                            <button
                                                onClick={() => setCancelId(b.id)}
                                                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                title="Cancel booking"
                                            >
                                                <X size={13} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ── Cancel confirm modal ── */}
            <AnimatePresence>
                {cancelId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setCancelId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#141418] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                                <AlertCircle size={22} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-extrabold text-white mb-2">Cancel Booking?</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                This action cannot be undone. The booking will be permanently cancelled.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancelId(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
                                >
                                    Keep
                                </button>
                                <button
                                    onClick={() => cancelBooking(cancelId)}
                                    disabled={cancelling}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all text-sm disabled:opacity-50 shadow-lg shadow-red-500/20"
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Booking"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
