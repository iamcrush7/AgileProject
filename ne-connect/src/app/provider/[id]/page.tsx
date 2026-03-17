"use client"

import { useEffect, useState, use } from "react"
import { useParams, useRouter } from "next/navigation"
import { MapPin, Star, ShieldCheck, CheckCircle2, Clock, Globe, Award, Sparkles, AlertCircle, ChevronRight, Calendar, MessageSquare, BadgeCheck, Share2, Heart, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ProviderProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [provider, setProvider] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("services")
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        const fetchProvider = async () => {
            if (!params?.id) return
            try {
                const res = await fetch(`/api/providers/${params.id}`)
                const json = await res.json()
                if (json.success) {
                    setProvider(json.data)
                }
            } catch (error) {
                console.error("Failed to fetch provider", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProvider()
    }, [params?.id])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-10 w-10 rounded-full border-4 border-muted border-t-primary"
                />
            </div>
        )
    }

    if (!provider) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
                <AlertCircle size={64} className="text-secondary mb-6" />
                <h2 className="text-3xl font-bold text-primary">Professional not found</h2>
                <p className="mt-2 text-secondary text-lg">The profile you are looking for might have moved or been unverified.</p>
                <button 
                    onClick={() => router.push('/providers')}
                    className="mt-8 px-6 py-3 bg-primary text-background rounded-xl font-bold"
                >
                    Back to marketplace
                </button>
            </div>
        )
    }

    const tabs = [
        { id: "services", label: "Services", count: provider.services?.length },
        { id: "reviews", label: "Reviews", count: provider.reviewsCount },
        { id: "about", label: "About" },
    ]

    return (
        <div className="min-h-screen bg-background text-primary pb-24">
            {/* Top Navigation / Breadcrumb */}
            <div className="border-b border-border bg-surface sticky top-0 z-30">
                <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="text-sm font-bold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
                    >
                        <ChevronRight className="rotate-180" size={16} /> Back to Search
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-background rounded-full transition-colors"><Share2 size={18} /></button>
                        <button 
                            onClick={() => setIsSaved(!isSaved)}
                            className={`p-2 hover:bg-background rounded-full transition-colors ${isSaved ? 'text-rose-500' : ''}`}
                        >
                            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Main Profile */}
                    <div className="lg:col-span-2">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-40 w-40 flex-shrink-0 rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative"
                            >
                                {provider.image ? (
                                    <img src={provider.image} className="w-full h-full object-cover" alt={provider.name} />
                                ) : (
                                    <div className="w-full h-full bg-surface flex items-center justify-center text-4xl font-black">{provider.name.charAt(0)}</div>
                                )}
                            </motion.div>

                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{provider.name}</h1>
                                    {provider.verified && (
                                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-full uppercase">
                                            <BadgeCheck size={14} /> Verified Member
                                        </div>
                                    )}
                                </div>
                                <p className="text-xl font-bold text-secondary">{provider.businessName}</p>
                                
                                <div className="mt-5 flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <Star fill="currentColor" size={18} className="text-yellow-400" />
                                        {provider.rating} <span className="text-muted font-normal">({provider.reviewsCount} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-secondary font-medium">
                                        <MapPin size={18} className="text-muted" /> {provider.city}, {provider.state}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-secondary font-medium">
                                        <Clock size={18} className="text-muted" /> {provider.experience} years exp.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-b border-border flex gap-8 mb-10">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-bold uppercase tracking-widest relative transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-primary'}`}
                                >
                                    {tab.label} {tab.count !== undefined && <span className="ml-1 opacity-50">({tab.count})</span>}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "services" && (
                                    <div className="space-y-4">
                                        {provider.services?.map((service: any) => (
                                            <div key={service.id} className="group p-6 rounded-2xl border border-border bg-surface hover:bg-background hover:scale-[1.01] hover:shadow-lg transition-all cursor-pointer">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-primary group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                                                    <div className="text-right">
                                                        <span className="text-2xl font-black text-primary">₹{service.price}</span>
                                                    </div>
                                                </div>
                                                <p className="text-secondary leading-relaxed max-w-xl">{service.description}</p>
                                                <div className="mt-4 flex items-center gap-4 text-xs font-bold text-muted uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1.5"><Clock size={14} /> ~{service.estimatedTime} mins</span>
                                                    <span className="flex items-center gap-1.5"><Tag size={14} /> Professional Rate</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="space-y-8">
                                        {provider.reviews?.map((review: any) => (
                                            <div key={review.id} className="pb-8 border-b border-border last:border-0">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold">
                                                            {review.user?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{review.user?.name}</div>
                                                            <div className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-muted"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-secondary leading-relaxed italic">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "about" && (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <h3 className="text-xl font-bold mb-4">Professional Bio</h3>
                                        <p className="text-secondary leading-relaxed text-lg mb-8 shadow-sm p-6 bg-surface rounded-2xl border border-border border-l-4 border-l-primary uppercase tracking-tight font-serif italic">
                                            {provider.bio}
                                        </p>
                                        
                                        <h3 className="text-xl font-bold mb-4">Verification & Credentials</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-border bg-emerald-500/5 flex items-center gap-4">
                                                <div className="p-2 bg-emerald-500 rounded-lg text-white"><ShieldCheck size={20} /></div>
                                                <div>
                                                    <div className="font-bold text-sm">Identity Verified</div>
                                                    <div className="text-xs text-secondary italic">Government ID manually checked</div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl border border-border bg-indigo-500/5 flex items-center gap-4">
                                                <div className="p-2 bg-indigo-500 rounded-lg text-white"><Award size={20} /></div>
                                                <div>
                                                    <div className="font-bold text-sm">Northeast Certified</div>
                                                    <div className="text-xs text-secondary italic">Local market expert</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <div className="bg-background border-2 border-primary rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">
                                <div className="mb-8 overflow-hidden rounded-2xl bg-surface border border-border">
                                    <div className="p-4 bg-primary text-background font-bold flex items-center justify-between">
                                        <span>Quick Booking</span>
                                        <Calendar size={18} />
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-secondary mb-2">Service starting from</p>
                                        <div className="text-4xl font-black mb-6">₹{provider.startingPrice}</div>
                                        
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer group">
                                                <div className="text-[10px] font-bold text-muted uppercase mb-1">Select Service</div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-sm">{provider.services?.[0]?.name || "Consultation"}</span>
                                                    <ChevronRight size={16} className="text-muted group-hover:text-primary" />
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm font-bold opacity-50">
                                                    <MessageSquare size={16} /> Instant Chat
                                                </div>
                                                <div className="text-[10px] bg-indigo-500/20 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Enabled</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-primary text-background py-5 rounded-2xl font-black text-lg shadow-[0_10px_40px_-10px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center gap-2 group"
                                >
                                    Book Now
                                    <Sparkles size={20} className="group-hover:animate-pulse" />
                                </motion.button>
                                <p className="mt-4 text-center text-xs text-muted font-medium">100% Secure Payment & Satisfaction Guaranteed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
