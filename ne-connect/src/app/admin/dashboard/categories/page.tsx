"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Package, X, Check } from "lucide-react"

type Category = {
    id: string
    name: string
    description: string | null
    createdAt: string
    _count: { services: number }
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newName, setNewName] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/admin/categories")
            .then((r) => r.json())
            .then((d) => setCategories(d.categories || []))
            .finally(() => setIsLoading(false))
    }, [])

    async function addCategory(e: React.FormEvent) {
        e.preventDefault()
        if (!newName.trim()) return
        setIsSaving(true)
        const res = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() || undefined }),
        })
        if (res.ok) {
            const { category } = await res.json()
            setCategories((prev) => [...prev, { ...category, _count: { services: 0 } }])
            setNewName("")
            setNewDesc("")
            setShowForm(false)
        }
        setIsSaving(false)
    }

    async function deleteCategory(id: string) {
        if (!confirm("Delete this category? This cannot be undone.")) return
        setDeleting(id)
        const res = await fetch("/api/admin/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
        if (res.ok) {
            setCategories((prev) => prev.filter((c) => c.id !== id))
        }
        setDeleting(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-primary">Categories</h1>
                    <p className="text-secondary text-sm mt-0.5">{categories.length} service categories</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 bg-primary text-background text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? "Cancel" : "Add Category"}
                </button>
            </div>

            {showForm && (
                <motion.form onSubmit={addCategory} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-semibold text-primary">New Category</h2>
                    <div>
                        <label className="text-sm font-medium text-primary block mb-1.5">Name *</label>
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} required
                            placeholder="e.g. Plumbing, Electrical..." 
                            className="w-full bg-background border border-border rounded-md px-4 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-primary block mb-1.5">Description</label>
                        <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                            placeholder="Optional short description"
                            className="w-full bg-background border border-border rounded-md px-4 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted" />
                    </div>
                    <button type="submit" disabled={isSaving}
                        className="inline-flex items-center gap-2 bg-primary text-background text-sm font-bold px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                        {isSaving ? <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <Check size={16} />}
                        Save Category
                    </button>
                </motion.form>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="h-28 rounded-xl bg-stone-100 animate-pulse border border-border" />)}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-border bg-surface">
                    <Package size={40} className="mx-auto text-muted mb-4" />
                    <p className="text-primary font-semibold">No categories yet</p>
                    <p className="text-secondary text-sm mt-1">Click "Add Category" to create the first one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((c, i) => (
                        <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all group flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div className="h-10 w-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                    <Package size={20} className="text-primary" />
                                </div>
                                <button onClick={() => deleteCategory(c.id)} disabled={deleting === c.id}
                                    className="p-1.5 rounded-md text-muted hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50">
                                    {deleting === c.id ? <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin block" /> : <Trash2 size={15} />}
                                </button>
                            </div>
                            <h3 className="font-bold text-primary text-sm mb-1">{c.name}</h3>
                            {c.description && <p className="text-xs text-secondary mb-3 flex-1">{c.description}</p>}
                            <p className="text-xs text-muted mt-auto pt-3 border-t border-border">{c._count.services} service{c._count.services !== 1 ? "s" : ""}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
