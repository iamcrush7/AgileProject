"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin, Star, Filter, ArrowRight, Zap, Wrench, Hammer, Sparkles, Wind, Smartphone, Loader2 } from "lucide-react"

// Map icons to service names for visual consistency
const iconMap: Record<string, any> = {
    "Electrician": Zap,
    "Plumber": Wrench,
    "Carpenter": Hammer,
    "House Cleaning": Sparkles,
    "AC Repair": Wind,
    "Mobile Repair": Smartphone,
    "Appliance Repair": Wrench, // fallback
    "Tech Services": Smartphone, // fallback
}

const colorMap: Record<string, string> = {
    "Home Services": "bg-stone-200 text-stone-800",
    "Cleaning": "bg-emerald-100 text-emerald-900 border border-emerald-200",
    "Appliance": "bg-blue-100 text-blue-900 border border-blue-200",
    "Electronics": "bg-purple-100 text-purple-900 border border-purple-200",
    "Woodwork": "bg-orange-100 text-orange-900 border border-orange-200",
    "Appliance Repair": "bg-cyan-100 text-cyan-900 border border-cyan-200",
    "Tech Services": "bg-indigo-100 text-indigo-900 border border-indigo-200",
    "Personal Services": "bg-pink-100 text-pink-900 border border-pink-200",
    "Outdoor Services": "bg-green-100 text-green-900 border border-green-200",
}

const LOCATIONS = ["All Locations", "Assam", "Meghalaya", "Mizoram", "Nagaland", "Manipur", "Arunachal Pradesh", "Tripura", "Sikkim"]

export default function ServicesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("All Locations")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [services, setServices] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchServices()
        }, 300) // Debounce search
        return () => clearTimeout(timer)
    }, [searchQuery, selectedLocation, selectedCategories])

    async function fetchCategories() {
        try {
            const res = await fetch("/api/categories")
            const data = await res.json()
            setCategories(data.categories || [])
        } catch (err) {
            console.error("Failed to fetch categories", err)
        }
    }

    async function fetchServices() {
        setIsLoading(true)
        setError("")
        try {
            let url = `/api/services?q=${encodeURIComponent(searchQuery)}`
            if (selectedLocation && selectedLocation !== "All Locations") {
                url += `&state=${encodeURIComponent(selectedLocation)}`
            }
            if (selectedCategories.length > 0) {
                // Pass category ID
                url += `&category=${encodeURIComponent(selectedCategories[0])}`
            }
            const res = await fetch(url)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setServices(data.services || [])
        } catch (err) {
            setError("Failed to load services. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleCategory = (catId: string) => {
        setSelectedCategories(prev => 
            prev.includes(catId) ? prev.filter(c => c !== catId) : [catId] // Single select for now
        )
    }

    return (
        <div className="min-h-screen bg-background text-primary">
            {/* Header Area */}
            <div className="bg-surface border-b border-border relative">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                        Browse Services
                    </h1>
                    <p className="mt-4 text-xl text-secondary max-w-2xl font-medium">
                        Find verified professionals for all your local service needs.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-3xl">
                        <div className="relative flex-grow">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search size={20} className="text-secondary" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-xl border border-border bg-background py-4 pl-12 pr-4 text-base placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 h-14 shadow-sm transition-all"
                                placeholder="What service do you need?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full sm:w-64">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <MapPin size={20} className="text-secondary" />
                            </div>
                            <select 
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="block w-full appearance-none rounded-xl border border-border bg-background py-4 pl-12 pr-8 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 h-14 text-primary cursor-pointer shadow-sm transition-all"
                            >
                                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                        <button onClick={() => fetchServices()} className="h-14 rounded-xl bg-primary px-8 text-base font-bold text-background shadow-lg transition-all hover:scale-105 active:scale-95 flex-shrink-0">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-primary mb-6 flex items-center gap-2 uppercase tracking-wider">
                                    <Filter size={16} className="text-primary" /> Filters
                                </h3>
                                <div className="space-y-6">
                                    {/* Category Filter */}
                                    <div>
                                        <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Category</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedCategories.length === 0}
                                                    onChange={() => setSelectedCategories([])}
                                                    className="rounded-md border-border text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer transition-colors" 
                                                />
                                                <span className="text-sm text-secondary group-hover:text-primary transition-colors">All Categories</span>
                                            </label>
                                            {categories.map(cat => (
                                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedCategories.includes(cat.id)}
                                                        onChange={() => toggleCategory(cat.id)}
                                                        className="rounded-md border-border text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer transition-colors" 
                                                    />
                                                    <span className="text-sm text-secondary group-hover:text-primary transition-colors">{cat.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Reset Filters */}
                                    <button 
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedLocation("All Locations");
                                            setSelectedCategories([]);
                                            // fetchServices() is not needed here as useEffect tracks these states
                                        }}
                                        className="w-full text-xs font-bold text-accent hover:text-primary transition-colors uppercase tracking-widest pt-6 border-t border-border active:scale-95"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Service Grid */}
                    <div className="flex-grow">
                        <div className="mb-8 flex items-center justify-between">
                            <p className="text-sm text-secondary font-medium">
                                {isLoading ? "Searching..." : (
                                    <>Showing <span className="font-bold text-primary">{services.length}</span> services</>
                                )}
                            </p>
                            <select className="rounded-lg border border-border bg-surface py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium cursor-pointer transition-all">
                                <option>Sort by: Recommended</option>
                                <option>Sort by: Price (Low to High)</option>
                                <option>Sort by: Rating</option>
                            </select>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center">
                                <p className="text-red-700 font-bold">{error}</p>
                            </div>
                        )}

                        {!isLoading && services.length === 0 && !error && (
                            <div className="bg-surface border border-border p-16 rounded-2xl text-center">
                                <Search size={48} className="mx-auto text-muted mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-primary mb-2">No services found</h3>
                                <p className="text-secondary max-w-sm mx-auto">We couldn't find any services matching your current filters. Try adjusting your search or location.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isLoading ? (
                                // Skeleton Loaders
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="animate-pulse flex flex-col p-6 rounded-2xl bg-surface border border-border h-[220px]">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="h-12 w-12 bg-background rounded-xl" />
                                            <div className="h-6 w-24 bg-background rounded-full" />
                                        </div>
                                        <div className="h-6 w-3/4 bg-background rounded mb-4" />
                                        <div className="mt-auto pt-4 border-t border-border flex justify-between">
                                            <div className="h-8 w-20 bg-background rounded" />
                                            <div className="h-8 w-16 bg-background rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                services.map((service) => {
                                    const Icon = iconMap[service.name] || iconMap[service.category] || Sparkles
                                    const colorClass = colorMap[service.category] || "bg-indigo-500/10 text-indigo-500"
                                    
                                    return (
                                        <Link 
                                            key={service.name} 
                                            href={`/services/${encodeURIComponent(service.name)}?location=${selectedLocation === 'All Locations' ? '' : selectedLocation}`} 
                                            className="group flex flex-col p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 duration-300 ${colorClass}`}>
                                                    <Icon size={22} />
                                                </div>
                                                <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-primary border border-border">
                                                    {service.category}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-sm text-secondary line-clamp-2 mb-6 font-medium leading-relaxed">
                                                {service.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between text-secondary text-xs font-medium border-t border-border pt-4 mt-auto">
                                                <div className="flex flex-col gap-1">
                                                    <span className="uppercase tracking-wider opacity-70">Starting from</span>
                                                    <span className="text-base font-bold text-primary">₹{service.minPrice}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="font-bold text-primary">{service.providerCount} {service.providerCount === 1 ? 'Provider' : 'Providers'}</span>
                                                    <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-full border border-border">
                                                        <Star size={12} fill="currentColor" className="text-yellow-400" />
                                                        <span className="font-bold text-primary">{service.rating > 0 ? service.rating : "New"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="mt-24 border-t border-border bg-surface py-12 text-center">
                <p className="text-sm font-medium text-secondary">© 2026 Sahyog-NE. All rights reserved.</p>
            </footer>
        </div>
    )
}
