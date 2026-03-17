"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ShieldCheck, Star, MapPin, Clock, Languages, CheckCircle2, MoreHorizontal, Share2 } from "lucide-react"

export function ProviderHero({ provider }: { provider?: any }) {
    if (!provider) return null;

    return (
        <section className="relative bg-white dark:bg-[#030712] pt-24 pb-12">
            {/* Banner Image */}
            <div className="w-full h-[240px] md:h-[320px] relative overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80"
                    alt="Provider Workspace"
                    fill
                    unoptimized
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-24 sm:-mt-32">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                    {/* Avatar Profile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-[2rem] border-4 border-white dark:border-[#030712] overflow-hidden shadow-2xl shrink-0"
                    >
                        <Image
                            src={provider.image || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&q=80"}
                            alt={provider.name}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                        {provider.verified && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-center">
                                <div className="flex items-center space-x-1">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Verified</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Header Info */}
                    <div className="flex-1 w-full pt-4 md:pt-[100px]">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                                    {provider.name}
                                </h1>
                                {provider.businessName && (
                                    <p className="text-xl text-indigo-600 dark:text-indigo-400 font-semibold mb-4">{provider.businessName}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-500/20">
                                        <Star size={16} className="text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-amber-700 dark:text-amber-500">{provider.rating}</span>
                                        <span className="text-xs text-amber-600/70 dark:text-amber-500/70 underline cursor-pointer">({provider.reviewsCount} Reviews)</span>
                                    </div>

                                    <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
                                        <MapPin size={16} className="mr-2 text-gray-400" />
                                        {provider.city}, {provider.state}
                                    </div>

                                    <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">
                                        <Clock size={16} className="mr-2 text-gray-400" />
                                        {provider.experience} Years Exp.
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex gap-3"
                            >
                                <button className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all shadow-sm">
                                    <Share2 size={20} />
                                </button>
                                <button className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all shadow-sm">
                                    <MoreHorizontal size={20} />
                                </button>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 mt-4 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About me</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {provider.bio || `Professional service provider in ${provider.city}, ${provider.state} with ${provider.experience} years of experience. Highly focused on quality and customer satisfaction.`}
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center space-x-6">
                                {provider.languages?.length > 0 && (
                                    <div className="flex items-center">
                                        <Languages size={18} className="text-gray-400 mr-2" />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {provider.languages.join(", ")}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <CheckCircle2 size={18} className="text-emerald-500 mr-2 shrink-0" />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Background Checked</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    )
}
