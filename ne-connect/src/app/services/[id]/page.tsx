"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Star, ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, User, Loader2, Sparkles, Filter, Briefcase, Clock, Calendar } from "lucide-react"

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: serviceNameRaw } = use(params)
    const serviceName = decodeURIComponent(serviceNameRaw)
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialLocation = searchParams.get("location") || ""

    const [serviceInfo, setServiceInfo] = useState<any>(null)
    const [providers, setProviders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [location, setLocation] = useState(initialLocation)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchData()
    }, [serviceName, location])

    async function fetchData() {
        setIsLoading(true)
        setError("")
        try {
            // 1. Fetch Service Info (get from grouped api)
            const serviceRes = await fetch(`/api/services?q=${encodeURIComponent(serviceName)}`)
            const serviceData = await serviceRes.json()
            const info = serviceData.services?.find((s: any) => s.name === serviceName)
            setServiceInfo(info)

            // 2. Fetch Providers for this service
            let url = `/api/providers?service=${encodeURIComponent(serviceName)}`
            if (location) url += `&state=${encodeURIComponent(location)}`
            
            const providersRes = await fetch(url)
            const providersData = await providersRes.json()
            if (providersData.success) {
                setProviders(providersData.data)
            } else {
                throw new Error(providersData.error)
            }
        } catch (err) {
            console.error(err)
            setError("Failed to load service details and providers.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Top Bar / Breadcrumb */}
            <div className="bg-surface border-b border-border sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Services
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                        <span>Services</span>
                        <ArrowRight size={12} />
                        <span className="text-primary">{serviceName}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-surface border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="max-w-2xl">
                            {serviceInfo && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-primary mb-6">
                                    {serviceInfo.category}
                                </span>
                            )}
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight mb-6">
                                {serviceName}
                            </h1>
                            <p className="text-xl text-secondary font-medium leading-relaxed">
                                {serviceInfo?.description || `Professional ${serviceName} services across Northeast India. Find verified experts for your needs.`}
                            </p>
                        </div>
                        
                        <div className="bg-background/50 border border-border rounded-3xl p-8 backdrop-blur-xl">
                            <div className="grid grid-cols-2 gap-8 min-w-[300px]">
                                <div>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Providers</p>
                                    <p className="text-3xl font-extrabold text-primary">{serviceInfo?.providerCount || providers.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Avg Rating</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-3xl font-extrabold text-primary">{serviceInfo?.rating || "4.8"}</p>
                                        <Star size={20} fill="currentColor" className="text-yellow-400" />
                                    </div>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-border">
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Starting Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-secondary">from</span>
                                        <p className="text-4xl font-extrabold text-primary">₹{serviceInfo?.minPrice || "149"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Providers Listing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Filter Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
                                <h3 className="text-sm font-extrabold text-primary mb-6 flex items-center gap-2 uppercase tracking-tight">
                                    <Filter size={16} className="text-primary" /> Refine Providers
                                </h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-muted uppercase tracking-widest mb-3 block">Location</label>
                                        <select 
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        >
                                            <option value="">All Regions</option>
                                            <option value="Assam">Assam</option>
                                            <option value="Meghalaya">Meghalaya</option>
                                            <option value="Mizoram">Mizoram</option>
                                            <option value="Nagaland">Nagaland</option>
                                            <option value="Manipur">Manipur</option>
                                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                            <option value="Tripura">Tripura</option>
                                            <option value="Sikkim">Sikkim</option>
                                        </select>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <label className="text-xs font-bold text-muted uppercase tracking-widest mb-3 block">Availability</label>
                                        <div className="space-y-3">
                                            {['Available Today', 'Verified Only', 'Top Rated'].map(f => (
                                                <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary accent-primary w-4 h-4" />
                                                    <span className="text-sm text-secondary font-medium group-hover:text-primary transition-colors">{f}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                                <div className="flex items-center gap-2 text-primary mb-3">
                                    <ShieldCheck size={20} />
                                    <span className="text-sm font-bold uppercase tracking-tight">Safety First</span>
                                </div>
                                <p className="text-xs text-secondary font-medium leading-relaxed">
                                    All providers on NE-Connect undergo background checks and identity verification.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Providers Grid */}
                    <div className="flex-grow">
                        <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                                {providers.length} Expert {serviceName}s Available
                            </h2>
                            <span className="text-xs font-bold text-secondary bg-surface px-3 py-1 rounded-full border border-border">
                                SORT BY: POPULAR
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="animate-pulse bg-surface border border-border rounded-3xl h-[320px]" />
                                ))}
                            </div>
                        ) : providers.length === 0 ? (
                            <div className="bg-surface border border-border rounded-3xl p-20 text-center">
                                <Briefcase size={48} className="mx-auto text-muted mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-primary mb-2">No providers found</h3>
                                <p className="text-secondary max-w-sm mx-auto font-medium">
                                    We don't have any {serviceName}s in {location || 'this area'} yet. Try another location or check back soon!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {providers.map((p) => {
                                    // Find the specific service object for this provider that matches the current service name
                                    const matchingService = p.services.find((s: any) => s.name === serviceName)
                                    const serviceId = matchingService?.id || ""

                                    return (
                                        <div key={p.id} className="group relative bg-background border border-border hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
                                            
                                            {/* Verified Badge Overlay */}
                                            {p.verified && (
                                                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Verified</span>
                                                </div>
                                            )}

                                            <div className="p-8">
                                                <div className="flex items-start gap-5 mb-8">
                                                    <div className="relative flex-shrink-0">
                                                        {p.image ? (
                                                            <img src={p.image} alt={p.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-surface" />
                                                        ) : (
                                                            <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center text-primary font-bold text-2xl ring-4 ring-surface">
                                                                {p.name[0]}
                                                            </div>
                                                        )}
                                                        <div className="absolute -bottom-2 -right-2 bg-primary text-background rounded-lg px-1.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1 shadow-lg ring-2 ring-background">
                                                            <Star size={10} fill="currentColor" /> {p.rating}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow pt-1">
                                                        <h3 className="text-xl font-extrabold text-primary tracking-tight leading-tight mb-1">{p.name}</h3>
                                                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">{p.businessName}</p>
                                                        <div className="flex items-center gap-3 text-xs font-bold text-muted uppercase tracking-tight">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin size={12} className="text-primary/50" /> {p.city}
                                                            </div>
                                                            <span className="opacity-30">•</span>
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={12} className="text-primary/50" /> {p.experience}y exp
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-secondary font-medium leading-relaxed line-clamp-2 mb-8 h-10">
                                                    {p.bio}
                                                </p>

                                                <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Starting from</p>
                                                        <p className="text-2xl font-extrabold text-primary tracking-tight">₹{p.startingPrice}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                    <Link 
                                                        href={`/provider/${p.id}`}
                                                        className="p-3.5 rounded-2xl border border-border text-primary hover:bg-surface transition-all active:scale-95"
                                                    >
                                                        <User size={20} />
                                                    </Link>
                                                    <Link 
                                                        href={`/booking/new?providerId=${p.id}&serviceId=${serviceId}&serviceName=${encodeURIComponent(serviceName)}`}
                                                        className="bg-primary text-background px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                                                    >
                                                        Book Now
                                                    </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
