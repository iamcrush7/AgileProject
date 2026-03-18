"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, CalendarRange, AlertCircle, X, Plus, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    PENDING: { label: "Pending", color: "text-amber-700 bg-amber-100 border-amber-200", dot: "bg-amber-600" },
    CONFIRMED: { label: "Confirmed", color: "text-blue-700 bg-blue-100 border-blue-200", dot: "bg-blue-600" },
    IN_PROGRESS: { label: "In Progress", color: "text-purple-700 bg-purple-100 border-purple-200", dot: "bg-purple-600 animate-pulse" },
    COMPLETED: { label: "Completed", color: "text-emerald-700 bg-emerald-100 border-emerald-200", dot: "bg-emerald-600" },
    CANCELLED: { label: "Cancelled", color: "text-stone-600 bg-stone-100 border-stone-200", dot: "bg-stone-500" },
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
                    <h1 className="text-[26px] font-extrabold text-primary tracking-tight">My Bookings</h1>
                    <p className="text-sm text-secondary mt-1">Track and manage all your service bookings</p>
                </div>
                <Link
                    href="/providers"
                    className="flex items-center gap-2 bg-primary hover:bg-stone-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
                >
                    <Plus size={15} /> New Booking
                </Link>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                    type="text"
                    placeholder="Search bookings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-primary text-sm outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-muted transition-all"
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
                                ? "bg-primary text-white"
                                : "text-secondary hover:text-primary hover:bg-surface border border-border"
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
                <div className="text-center py-20 rounded-2xl border border-border bg-surface">
                    <CalendarRange size={40} className="mx-auto text-muted mb-3" />
                    <p className="text-sm font-semibold text-secondary">
                        {bookings.length === 0 ? "No bookings yet" : "No bookings match your filter"}
                    </p>
                    <p className="text-xs text-muted mt-1">
                        {bookings.length === 0 ? "Book your first service today!" : "Try changing your status filter"}
                    </p>
                    {bookings.length === 0 && (
                        <Link href="/providers" className="inline-flex items-center gap-1.5 mt-4 text-accent text-sm font-bold hover:underline transition-colors">
                            Find providers <ArrowRight size={13} />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                    {/* Table header */}
                    <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 border-b border-border text-[11px] font-black uppercase tracking-widest text-secondary bg-stone-50">
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
                                        <div className="w-8 h-8 rounded-xl bg-stone-100 border border-border flex items-center justify-center shrink-0">
                                            <CalendarRange size={13} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-primary leading-none mb-0.5">{b.service.name}</p>
                                            {b.notes && <p className="text-xs text-secondary truncate max-w-[160px]">{b.notes}</p>}
                                        </div>
                                    </div>

                                    {/* Provider */}
                                    <div className="md:col-span-3">
                                        <p className="text-[13px] text-primary font-bold truncate">
                                            {b.provider.businessName || b.provider.user.name}
                                        </p>
                                        {b.provider.stateServed && (
                                            <p className="flex items-center gap-1 text-xs text-secondary mt-0.5">
                                                <MapPin size={9} />{b.provider.stateServed}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div className="md:col-span-2">
                                        <p className="text-[13px] text-primary font-bold">
                                            {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                                        </p>
                                        <p className="text-xs text-secondary mt-0.5">{b.time}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="md:col-span-1">
                                        <p className="text-[13px] font-extrabold text-primary">₹{b.totalPrice?.toLocaleString()}</p>
                                    </div>

                                    {/* Status + Cancel */}
                                    <div className="md:col-span-2 flex items-center gap-2">
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${sc.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                            {sc.label}
                                        </span>
                                        {["PENDING", "CONFIRMED"].includes(b.status) && (
                                            <button
                                                onClick={() => setCancelId(b.id)}
                                                className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
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
                            className="bg-surface border border-border rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                                <AlertCircle size={22} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-extrabold text-primary mb-2">Cancel Booking?</h3>
                            <p className="text-sm text-secondary mb-6 leading-relaxed">
                                This action cannot be undone. The booking will be permanently cancelled.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancelId(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-border text-secondary font-bold hover:bg-stone-50 transition-all text-sm"
                                >
                                    Keep
                                </button>
                                <button
                                    onClick={() => cancelBooking(cancelId)}
                                    disabled={cancelling}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all text-sm disabled:opacity-50 shadow-lg"
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
