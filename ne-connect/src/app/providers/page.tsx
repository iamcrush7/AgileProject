"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Filter, ShieldCheck, CheckCircle2, ChevronDown, Clock, Tag, X, ArrowUpDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const LOCATIONS = ["All States", "Assam", "Meghalaya", "Nagaland", "Manipur", "Arunachal Pradesh", "Mizoram", "Sikkim", "Tripura"]
const CATEGORIES = ["All Categories", "Home Services", "Appliance Repair", "Tech Services", "Personal Services", "Outdoor Services"]
const RATINGS = [4.5, 4.0, 3.5]

export default function ProvidersPage() {
    const [providers, setProviders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedState, setSelectedState] = useState("All States")
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const [minRating, setMinRating] = useState<number | null>(null)
    const [verifiedOnly, setVerifiedOnly] = useState(false)
    const [sortBy, setSortBy] = useState("Recommended")

    const fetchProviders = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (selectedState !== "All States") params.append("state", selectedState)
            if (selectedCategory !== "All Categories") params.append("category", selectedCategory)
            if (searchQuery) params.append("search", searchQuery)
            
            const res = await fetch(`/api/providers?${params.toString()}`)
            const json = await res.json()
            if (json.success) {
                let filtered = json.data

                if (verifiedOnly) {
                    filtered = filtered.filter((p: any) => p.verified)
                }

                if (minRating) {
                    filtered = filtered.filter((p: any) => parseFloat(p.rating === "New" ? "0" : p.rating) >= minRating)
                }

                // Sorting
                if (sortBy === "Highest Rated") {
                    filtered.sort((a: any, b: any) => {
                        const rA = a.rating === "New" ? 0 : parseFloat(a.rating)
                        const rB = b.rating === "New" ? 0 : parseFloat(b.rating)
                        return rB - rA
                    })
                } else if (sortBy === "Most Experienced") {
                    filtered.sort((a: any, b: any) => b.experience - a.experience)
                } else if (sortBy === "Lowest Price") {
                    filtered.sort((a: any, b: any) => a.startingPrice - b.startingPrice)
                }

                setProviders(filtered)
            }
        } catch (error) {
            console.error("Failed to fetch providers:", error)
        } finally {
            setLoading(false)
        }
    }, [selectedState, selectedCategory, searchQuery, verifiedOnly, minRating, sortBy])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProviders()
        }, 300)
        return () => clearTimeout(timer)
    }, [fetchProviders])

    const resetFilters = () => {
        setSelectedState("All States")
        setSelectedCategory("All Categories")
        setVerifiedOnly(false)
        setMinRating(null)
        setSearchQuery("")
        // The useEffect will catch these changes and re-fetch automatically due to dependencies
    }

    return (
        <div className="min-h-screen bg-background text-primary">
            {/* Dynamic HeaderSection */}
            <div className="relative overflow-hidden bg-surface py-20 border-b border-border">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-primary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center sm:text-left">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold tracking-tight text-primary sm:text-6xl"
                    >
                        Find Trusted <span className="text-indigo-600 dark:text-indigo-400">Pros</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 text-xl text-secondary max-w-2xl font-medium leading-relaxed"
                    >
                        Connecting you with 200+ background-checked professionals across Northeast India. From home maintenance to personal care.
                    </motion.p>
                    
                    {/* Integrated Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 flex flex-col sm:flex-row gap-3 max-w-4xl bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl border border-border"
                    >
                        <div className="relative flex-grow">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                className="w-full bg-transparent py-4 pl-12 pr-4 text-primary focus:outline-none placeholder:text-muted h-full"
                                placeholder="What service do you need?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-[1px] h-10 bg-border hidden sm:block self-center" />
                        <div className="relative w-full sm:w-56">
                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <select 
                                className="w-full bg-transparent py-4 pl-12 pr-8 appearance-none text-primary focus:outline-none cursor-pointer h-full"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                            >
                                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                        </div>
                        <button 
                            onClick={fetchProviders}
                            className="bg-primary text-background px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex-shrink-0"
                        >
                            Search
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Marketplace Layout */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Advanced Filters Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-surface border border-border rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-tight">
                                        <Filter size={16} className="text-indigo-500" /> Filters
                                    </h3>
                                    <button 
                                        onClick={resetFilters}
                                        className="text-xs font-semibold text-indigo-500 hover:text-indigo-600"
                                    >
                                        Clear all
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* Category Filter */}
                                    <div>
                                        <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Category</h4>
                                        <div className="space-y-2">
                                            {CATEGORIES.map(cat => (
                                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                                    <input 
                                                        type="radio"
                                                        name="category"
                                                        checked={selectedCategory === cat}
                                                        onChange={() => setSelectedCategory(cat)}
                                                        className="accent-primary w-4 h-4"
                                                    />
                                                    <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>
                                                        {cat}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Verification Filter */}
                                    <div className="pt-6 border-t border-border">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-sm font-semibold text-primary">Verified Professionals</span>
                                            <div 
                                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                                className={`w-10 h-6 border rounded-full relative transition-colors ${verifiedOnly ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${verifiedOnly ? 'left-5 bg-background' : 'left-1 bg-muted'}`} />
                                            </div>
                                        </label>
                                    </div>

                                    {/* Rating Rating Filter */}
                                    <div className="pt-6 border-t border-border">
                                        <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Min Rating</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {RATINGS.map(rating => (
                                                <button
                                                    key={rating}
                                                    onClick={() => setMinRating(minRating === rating ? null : rating)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${minRating === rating ? 'bg-indigo-500/10 border-indigo-500 text-primary font-bold' : 'border-border text-secondary hover:border-indigo-500/30'}`}
                                                >
                                                    <Star size={14} fill={minRating === rating ? "currentColor" : "none"} className={minRating === rating ? "text-indigo-500" : "text-muted"} />
                                                    {rating}+ stars
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center">
                                <ShieldCheck size={40} className="mx-auto mb-3 opacity-90" />
                                <h4 className="font-bold text-lg mb-1">Safe Booking</h4>
                                <p className="text-white/80 text-xs">All pros are verified through our multi-step background check.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Feed Content */}
                    <div className="flex-grow">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-lg font-bold text-primary">
                                    {loading ? 'Searching...' : `${providers.length} Verified Professionals`}
                                </p>
                                {searchQuery && (
                                    <p className="text-sm text-secondary">Results for "{searchQuery}"</p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <ArrowUpDown size={16} className="text-muted" />
                                <select 
                                    className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Recommended</option>
                                    <option>Highest Rated</option>
                                    <option>Most Experienced</option>
                                    <option>Lowest Price</option>
                                </select>
                            </div>
                        </div>
                        
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-72 rounded-2xl bg-surface animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {providers.map((provider) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            key={provider.id}
                                            className="group relative flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-5 mb-4">
                                                <Link 
                                                    href={`/provider/${provider.id}`}
                                                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-surface border border-border overflow-hidden hover:opacity-80 transition-opacity"
                                                >
                                                    {provider.image ? (
                                                        <img src={provider.image} className="w-full h-full object-cover" alt={provider.name} />
                                                    ) : (
                                                        <span className="text-xl font-bold">{provider.name.charAt(0)}</span>
                                                    )}
                                                </Link>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <Link href={`/provider/${provider.id}`}>
                                                            <h3 className="text-lg font-bold text-primary leading-tight hover:text-indigo-600 transition-colors cursor-pointer">{provider.name}</h3>
                                                        </Link>
                                                        {provider.verified && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-full uppercase">
                                                                <ShieldCheck size={10} /> Verified
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-semibold text-secondary mt-0.5">{provider.businessName}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-primary">
                                                            <Star size={12} fill="currentColor" className="text-yellow-400" />
                                                            {provider.rating} <span className="text-muted font-normal">({provider.reviewsCount})</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-muted">
                                                            <MapPin size={12} /> {provider.city}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {provider.services?.slice(0, 2).map((s: any) => (
                                                    <span key={s.id} className="text-[10px] font-bold bg-surface border border-border px-2 py-1 rounded-md text-secondary">
                                                        {s.name}
                                                    </span>
                                                ))}
                                                {provider.services?.length > 2 && (
                                                    <span className="text-[10px] font-bold text-muted px-1 self-center">+{provider.services.length - 2} more</span>
                                                )}
                                            </div>
                                            
                                            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted uppercase">Starting from</p>
                                                    <p className="text-lg font-extrabold text-primary">₹{provider.startingPrice}</p>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={`/provider/${provider.id}`}
                                                        className="w-full text-center py-2.5 rounded-xl border border-border text-sm font-bold text-primary bg-surface hover:bg-background transition-all"
                                                    >
                                                        Profile
                                                    </Link>
                                                    <Link 
                                                        href={provider.services?.[0] ? `/booking/new?providerId=${provider.id}&serviceId=${provider.services[0].id}&serviceName=${encodeURIComponent(provider.services[0].name)}` : `/provider/${provider.id}`}
                                                        className="w-full text-center py-2.5 rounded-xl bg-primary text-background text-sm font-bold shadow-md hover:scale-[1.02] transition-all"
                                                    >
                                                        Book
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {providers.length === 0 && !loading && (
                            <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-border mt-10">
                                <Search size={48} className="mx-auto text-muted mb-4" />
                                <h3 className="text-xl font-bold text-primary">No matching professionals</h3>
                                <p className="text-secondary mt-2">Try adjusting your filters or search keywords.</p>
                                <button 
                                    onClick={resetFilters}
                                    className="mt-6 text-indigo-500 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
