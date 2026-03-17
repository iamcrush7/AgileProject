"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, ShieldCheck, Languages, CheckCircle2, ChevronRight, Zap } from "lucide-react"

export interface ProviderData {
    id: string;
    name: string;
    image: string | null;
    businessName: string | null;
    role: string;
    exp: number;
    experience: number;
    verified: boolean;
    languages: string[];
    state: string;
    city: string;
    rating: number | string;
    reviewsCount: number;
    startingPrice: number;
    services: any[];
}

export function ProviderGrid({ selectedState }: { selectedState: string | null }) {
    const [providers, setProviders] = useState<ProviderData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProviders = async () => {
            setIsLoading(true)
            try {
                const url = selectedState
                    ? `/api/providers?state=${encodeURIComponent(selectedState)}`
                    : '/api/providers'

                const res = await fetch(url)
                const json = await res.json()
                if (json.success) {
                    setProviders(json.data)
                }
            } catch (error) {
                console.error("Failed to fetch providers", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProviders()
    }, [selectedState])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[2rem]"></div>
                ))}
            </div>
        )
    }

    const filteredProviders = providers

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
                {filteredProviders.map((provider, idx) => (
                    <motion.div
                        key={provider.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="group relative bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
                    >
                        {/* Hover Gradient Lighting */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-colors duration-500"></div>

                        <div className="relative z-10">
                            {/* Header: Avatar + Info */}
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-white/10 shadow-md">
                                    <Image src={provider.image || "/placeholder-avatar.jpg"} alt={provider.name} fill unoptimized className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {provider.name}
                                        </h3>
                                        {provider.verified && (
                                            <ShieldCheck size={20} className="text-emerald-500 shrink-0 relative top-1" />
                                        )}
                                    </div>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">{provider.services?.[0]?.category || "Professional"}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-500/20">
                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-500">{provider.rating}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">({provider.reviewsCount} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Flexbox */}
                            <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-100 dark:border-white/10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Location</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                        <MapPin size={14} className="mr-1 text-gray-400" />
                                        {provider.city}, <span className="text-gray-500 ml-1">{provider.state.substring(0, 3)}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">Experience</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                        <Award size={14} className="mr-1 text-gray-400" />
                                        {provider.experience} Years
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6 flex items-center space-x-2">
                                <Languages size={14} className="text-gray-400 shrink-0" />
                                <div className="flex flex-wrap gap-1">
                                    {provider.languages.map(lang => (
                                        <span key={lang} className="text-[10px] font-medium px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-md">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer: Price & CTA */}
                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Starting at</p>
                                    <p className="text-xl font-extrabold text-gray-900 dark:text-white flex items-baseline">
                                        ₹{provider.startingPrice} <span className="text-xs text-gray-500 font-normal ml-1">/ task</span>
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={`/provider/${provider.id}`} className="px-4 py-2.5 rounded-xl font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-white/20 transition-colors text-sm">
                                        Profile
                                    </Link>
                                    <Link href={`/provider/${provider.id}?book=true`} className="px-4 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-colors text-sm flex items-center group-hover:pr-3">
                                        <span>Book</span>
                                        <ChevronRight size={16} className="ml-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {filteredProviders.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-20 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-gray-200 dark:border-white/10 border-dashed">
                    <UserX size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No providers found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try selecting a different state or adjusting your filters.</p>
                </div>
            )}
        </div>
    )
}

function Award(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
}

function UserX(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
}
