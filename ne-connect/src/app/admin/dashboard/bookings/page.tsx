"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, CalendarRange, ChevronDown } from "lucide-react"

type Booking = {
    id: string
    status: string
    totalPrice: number
    date: string
    time: string
    notes?: string | null
    createdAt: string
    user: { name: string | null; email: string | null }
    provider: { businessName: string | null; user: { name: string | null } }
    service: { name: string; price: number }
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: "text-amber-600 bg-amber-50 border-amber-200",
    CONFIRMED: "text-blue-600 bg-blue-50 border-blue-200",
    IN_PROGRESS: "text-purple-600 bg-purple-50 border-purple-200",
    COMPLETED: "text-emerald-600 bg-emerald-50 border-emerald-200",
    CANCELLED: "text-gray-600 bg-gray-50 border-gray-200",
}

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/admin/bookings")
            .then((r) => r.json())
            .then((d) => setBookings(d.bookings || []))
            .finally(() => setIsLoading(false))
    }, [])

    const filtered = bookings.filter((b) => {
        const matchSearch = !search || (
            b.user.name?.toLowerCase().includes(search.toLowerCase()) ||
            b.service.name.toLowerCase().includes(search.toLowerCase()) ||
            b.provider.businessName?.toLowerCase().includes(search.toLowerCase())
        )
        const matchStatus = statusFilter === "ALL" || b.status === statusFilter
        return matchSearch && matchStatus
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-primary">All Bookings</h1>
                <p className="text-secondary text-sm mt-0.5">{bookings.length} total bookings on the platform</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search by user, service or provider..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-2.5 text-primary text-sm outline-none focus:border-primary placeholder:text-muted" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-surface border border-border rounded-xl px-4 py-2.5 text-primary text-sm outline-none">
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-surface text-primary">{s === "ALL" ? "All Statuses" : s.replace("_", " ")}</option>)}
                </select>
            </div>

            {isLoading ? (
                <div className="space-y-3">{[1, 2, 3, 4, 5].map((n) => <div key={n} className="h-20 rounded-2xl bg-stone-100 animate-pulse border border-border" />)}</div>
            ) : (
                <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-bold text-muted uppercase tracking-wider bg-background/50">
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-3">Service</div>
                        <div className="col-span-3">Provider</div>
                        <div className="col-span-1">Price</div>
                        <div className="col-span-2">Status</div>
                    </div>
                    {filtered.map((b, i) => (
                        <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-6 py-4 border-b border-border last:border-0 hover:bg-stone-50 items-center transition-colors">
                            <div className="lg:col-span-3">
                                <p className="text-sm font-semibold text-primary">{b.user.name || "—"}</p>
                                <p className="text-xs text-muted truncate">{b.user.email}</p>
                            </div>
                            <div className="lg:col-span-3">
                                <p className="text-sm font-semibold text-primary">{b.service.name}</p>
                                <p className="text-xs text-muted">{new Date(b.date).toLocaleDateString("en-IN")} • {b.time}</p>
                            </div>
                            <div className="lg:col-span-3">
                                <p className="text-sm font-medium text-secondary">{b.provider.businessName || b.provider.user.name || "—"}</p>
                            </div>
                            <div className="lg:col-span-1">
                                <p className="text-sm font-bold text-primary">₹{b.totalPrice}</p>
                            </div>
                            <div className="lg:col-span-2 flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${STATUS_COLORS[b.status] || STATUS_COLORS.PENDING}`}>
                                    {b.status.replace("_", " ")}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <CalendarRange size={36} className="mx-auto text-muted mb-3" />
                            <p className="text-secondary font-medium">No bookings found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
