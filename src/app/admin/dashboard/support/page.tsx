"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Trash2, CheckCircle, Clock, XCircle, Search, Mail, User } from "lucide-react"

type Ticket = {
    id: string
    subject: string
    description: string
    status: string
    createdAt: string
    user: { name: string; email: string; role: string }
}

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("ALL")

    useEffect(() => {
        fetch("/api/admin/support")
            .then(r => r.json())
            .then(d => setTickets(d.tickets || []))
            .finally(() => setIsLoading(false))
    }, [])

    async function updateStatus(id: string, newStatus: string) {
        const res = await fetch("/api/admin/support", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: newStatus }),
        })
        if (res.ok) {
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
        }
    }

    async function deleteTicket(id: string) {
        if (!confirm("Delete this ticket permanently?")) return
        const res = await fetch(`/api/admin/support?id=${id}`, { method: "DELETE" })
        if (res.ok) {
            setTickets(prev => prev.filter(t => t.id !== id))
        }
    }

    const filtered = tickets.filter(t => {
        const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || 
                          t.user.name?.toLowerCase().includes(search.toLowerCase()) ||
                          t.user.email?.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === "ALL" || t.status === filter
        return matchSearch && matchFilter
    })

    const statusColors: Record<string, string> = {
        OPEN: "bg-blue-100 text-blue-700 border-blue-200",
        RESOLVED: "bg-green-100 text-green-700 border-green-200",
        CLOSED: "bg-stone-100 text-stone-700 border-stone-200"
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">Support Tickets</h1>
                    <p className="text-stone-500 font-medium mt-1">Manage and resolve user issues</p>
                </div>
                
                <div className="flex bg-stone-100 p-1 rounded-xl">
                    {["ALL", "OPEN", "RESOLVED", "CLOSED"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                filter === f ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    placeholder="Search by subject, user or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-6 py-4 text-stone-900 text-sm outline-none focus:border-stone-400 shadow-sm transition-all"
                />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-48 rounded-3xl bg-white border border-stone-100 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                    <MessageSquare size={48} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-stone-500 font-bold text-lg">No tickets found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filtered.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[t.status]}`}>
                                                {t.status}
                                            </span>
                                            <span className="text-stone-400 text-xs font-medium italic">
                                                {new Date(t.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        <h2 className="text-xl font-black text-stone-900">{t.subject}</h2>
                                        <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{t.description}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-stone-50">
                                            <div className="flex items-center gap-2 text-xs">
                                                <User size={14} className="text-stone-400" />
                                                <span className="font-bold text-stone-700">{t.user.name}</span>
                                                <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 font-black text-[9px] uppercase">{t.user.role}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Mail size={14} className="text-stone-400" />
                                                <span className="font-medium text-stone-500">{t.user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                        {t.status !== "RESOLVED" && (
                                            <button
                                                onClick={() => updateStatus(t.id, "RESOLVED")}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                                            >
                                                <CheckCircle size={14} />
                                                Resolve
                                            </button>
                                        )}
                                        {t.status === "OPEN" && (
                                            <button
                                                onClick={() => updateStatus(t.id, "CLOSED")}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition-colors"
                                            >
                                                <XCircle size={14} />
                                                Close
                                            </button>
                                        )}
                                        {t.status !== "OPEN" && (
                                            <button
                                                onClick={() => updateStatus(t.id, "OPEN")}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                <Clock size={14} />
                                                Re-open
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTicket(t.id)}
                                            className="p-2.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors md:mt-auto self-center md:self-end"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
