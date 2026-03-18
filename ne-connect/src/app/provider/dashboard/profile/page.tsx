"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Camera, Save, User, MapPin, Briefcase, Info, Loader2, CheckCircle2, Trash2 } from "lucide-react"

const NE_STATES = [
    "Arunachal Pradesh", "Assam", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Sikkim", "Tripura",
]

export default function ProviderProfilePage() {
    const { data: session, update } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        bio: "",
        experience: 0,
        stateServed: "",
        citiesServed: "",
        image: ""
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/provider/profile")
                const data = await res.json()
                if (data.success && data.data) {
                    const p = data.data
                    setFormData({
                        name: p.user.name || "",
                        businessName: p.businessName || "",
                        bio: p.bio || "",
                        experience: p.experience || 0,
                        stateServed: p.stateServed || "",
                        citiesServed: p.citiesServed || "",
                        image: p.user.image || ""
                    })
                }
            } catch (err) {
                console.error("Failed to load provider profile", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'experience' ? parseInt(value) || 0 : value 
        }))
        setError("")
        setSuccess("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            const res = await fetch("/api/provider/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (res.ok && data.success) {
                setSuccess("Public profile updated successfully")
                // Update session
                await update({ name: formData.name, image: formData.image })
            } else {
                setError(data.error || "Failed to update profile")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB")
            return
        }

        setIsLoading(true)
        setError("")
        try {
            const fd = new FormData()
            fd.append("file", file)

            const res = await fetch("/api/provider/profile/upload", {
                method: "POST",
                body: fd
            })

            const data = await res.json()
            if (res.ok && data.success) {
                setFormData(prev => ({ ...prev, image: data.url }))
                setSuccess("Image uploaded. Click Save Changes to confirm.")
            } else {
                setError(data.error || "Failed to upload image")
            }
        } catch (err) {
            setError("Error uploading image")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && !formData.name) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">Public Profile</h1>
                <p className="text-sm text-secondary mt-1 font-medium">This information is visible to customers on the marketplace.</p>
            </div>

            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-border">
                    
                    {/* Brand Section */}
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                        <div className="flex flex-col items-center sm:items-start gap-5 shrink-0">
                            <div className="h-32 w-32 rounded-2xl border-4 border-background bg-stone-100 flex items-center justify-center overflow-hidden shadow-md relative mx-auto">
                                {formData.image ? (
                                    <img src={formData.image} alt={formData.businessName} className="h-full w-full object-cover" />
                                ) : (
                                    <Briefcase size={48} className="text-secondary" />
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-2 w-full min-w-[140px]">
                                <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-1.5 bg-primary text-background rounded-md text-xs font-bold hover:bg-primary/90 transition-colors">
                                    <Camera size={14} /> Upload File
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload}
                                    />
                                </label>

                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, image: "" }))
                                            setSuccess("Image removed. Click Save Changes.")
                                        }}
                                        className="flex items-center justify-center gap-2 px-3 py-1.5 border border-red-200 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100 transition-colors mt-1"
                                    >
                                        <Trash2 size={14} /> Remove Photo
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-grow space-y-4 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Personal Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your Legal Name"
                                            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium text-primary focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Business / Display Name</label>
                                    <div className="relative">
                                        <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input 
                                            type="text" 
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Brand or Your Full Name"
                                            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Professional Bio</label>
                                    <div className="relative">
                                        <Info size={16} className="absolute left-3 top-3 text-muted" />
                                        <textarea 
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Describe your expertise, tools, and commitment to quality..."
                                            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="p-6 sm:p-8 bg-stone-100/30 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Years of Experience</label>
                            <input 
                                type="number" 
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Primary State Served</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <select 
                                    name="stateServed"
                                    value={formData.stateServed}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select State</option>
                                    {NE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Cities / Towns Covered</label>
                            <input 
                                type="text" 
                                name="citiesServed"
                                value={formData.citiesServed}
                                onChange={handleChange}
                                placeholder="Guwahati, Jorhat, etc. (comma separated)"
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-6 sm:p-8 bg-background flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-grow">
                            {error && (
                                <p className="text-sm text-red-700 font-bold bg-red-50 border border-red-200 px-3 py-2 rounded-lg inline-block">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p className="text-sm text-emerald-800 font-bold flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg inline-block">
                                    <CheckCircle2 size={16} /> {success}
                                </p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full sm:w-auto px-8 py-3 bg-primary text-background rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 flex-shrink-0"
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} /> Save Public Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
