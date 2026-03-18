"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Loader2, Package, DollarSign } from "lucide-react"

type Service = {
    id: string
    name: string
    description: string
    price: number
    estimatedTime: number
    category: { name: string }
}

type Category = { id: string; name: string }

export default function ProviderServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ name: "", description: "", price: "", estimatedTime: "", categoryId: "" })

    useEffect(() => {
        Promise.all([
            fetch("/api/provider/services").then((r) => r.json()),
            fetch("/api/categories").then((r) => r.json()),
        ]).then(([sData, cData]) => {
            setServices(sData.services || [])
            setCategories(cData.categories || [])
        }).finally(() => setIsLoading(false))
    }, [])

    function resetForm() {
        setForm({ name: "", description: "", price: "", estimatedTime: "", categoryId: "" })
        setEditingId(null)
        setShowForm(false)
    }

    function openEdit(s: Service) {
        setForm({ name: s.name, description: s.description, price: String(s.price), estimatedTime: String(s.estimatedTime), categoryId: "" })
        setEditingId(s.id)
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        const body = { name: form.name, description: form.description, price: parseFloat(form.price), estimatedTime: parseInt(form.estimatedTime), categoryId: form.categoryId }
        const res = editingId
            ? await fetch(`/api/provider/services/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            : await fetch("/api/provider/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })

        const d = await res.json()
        if (res.ok) {
            if (editingId) {
                setServices((prev) => prev.map((s) => (s.id === editingId ? d.service : s)))
            } else {
                setServices((prev) => [d.service, ...prev])
            }
            resetForm()
        }
        setSaving(false)
    }

    async function deleteService(id: string) {
        if (!confirm("Remove this service?")) return
        await fetch(`/api/provider/services/${id}`, { method: "DELETE" })
        setServices((prev) => prev.filter((s) => s.id !== id))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">My Services</h1>
                    <p className="text-secondary text-sm mt-0.5 font-medium">Manage your offered services and pricing</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-background font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 text-sm"
                >
                    <Plus size={18} />
                    <span>Add Service</span>
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl border border-primary/20 bg-stone-50 shadow-inner"
                >
                    <h3 className="font-bold text-xl text-primary mb-6 tracking-tight">{editingId ? "Edit Service" : "Add New Service"}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Service Name (e.g. Fan Installation)"
                            className="bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm outline-none focus:border-primary/50 placeholder-stone-400 col-span-full shadow-sm"
                        />
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Brief description..."
                            rows={2}
                            className="bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm outline-none focus:border-primary/50 placeholder-stone-400 col-span-full resize-none shadow-sm"
                        />
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="Price (₹)"
                                className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-primary text-sm outline-none focus:border-primary/50 placeholder-stone-400 shadow-sm"
                            />
                        </div>
                        <input
                            required
                            type="number"
                            min="1"
                            value={form.estimatedTime}
                            onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                            placeholder="Est. time (minutes)"
                            className="bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm outline-none focus:border-primary/50 placeholder-stone-400 shadow-sm"
                        />
                        <select
                            required
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm outline-none focus:border-primary/50 col-span-full shadow-sm"
                        >
                            <option value="">Select category...</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        <div className="col-span-full flex space-x-3 pt-4 border-t border-border mt-2">
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl border border-border text-secondary font-bold hover:bg-stone-100 hover:text-primary transition-colors text-sm">Cancel</button>
                            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-sm flex items-center space-x-2 disabled:opacity-50 shadow-md shadow-primary/10">
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                <span>{editingId ? "Save Changes" : "Add Service"}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((n) => <div key={n} className="h-40 rounded-2xl bg-white/5 animate-pulse border border-white/10" />)}
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border bg-stone-50/50">
                    <Package size={56} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-secondary font-bold text-lg">No services yet</p>
                    <p className="text-muted text-sm mt-1">Add your first service to start getting bookings</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-xs font-bold bg-stone-100 text-primary border border-border px-2.5 py-1 rounded-full">{s.category?.name}</span>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-stone-100 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteService(s.id)} className="p-2 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-1.5 tracking-tight">{s.name}</h3>
                            <p className="text-secondary text-sm mb-5 line-clamp-2 leading-relaxed">{s.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                <span className="text-2xl font-bold text-primary">₹{s.price.toLocaleString()}</span>
                                <span className="text-xs font-bold text-secondary uppercase tracking-wider">~{s.estimatedTime} min</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
