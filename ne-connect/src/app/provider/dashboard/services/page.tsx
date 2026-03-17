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
                    <h1 className="text-2xl font-extrabold text-white">My Services</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Manage your offered services and pricing</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 text-sm"
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
                    className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5"
                >
                    <h3 className="font-extrabold text-white mb-5">{editingId ? "Edit Service" : "Add New Service"}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Service Name (e.g. Fan Installation)"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 placeholder-gray-600 col-span-full"
                        />
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Brief description..."
                            rows={2}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 placeholder-gray-600 col-span-full resize-none"
                        />
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="Price (₹)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 placeholder-gray-600"
                            />
                        </div>
                        <input
                            required
                            type="number"
                            min="1"
                            value={form.estimatedTime}
                            onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                            placeholder="Est. time (minutes)"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 placeholder-gray-600"
                        />
                        <select
                            required
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 col-span-full"
                        >
                            <option value="" className="bg-gray-900">Select category...</option>
                            {categories.map((c) => <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
                        </select>

                        <div className="col-span-full flex space-x-3 pt-2">
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 text-sm">Cancel</button>
                            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center space-x-2 disabled:opacity-50">
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
                <div className="text-center py-20 rounded-3xl border border-dashed border-white/10">
                    <Package size={48} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 font-semibold">No services yet</p>
                    <p className="text-gray-600 text-sm mt-1">Add your first service to start getting bookings</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{s.category?.name}</span>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => deleteService(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-extrabold text-white mb-1">{s.name}</h3>
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2">{s.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-extrabold text-indigo-400">₹{s.price.toLocaleString()}</span>
                                <span className="text-xs text-gray-600">~{s.estimatedTime} min</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
