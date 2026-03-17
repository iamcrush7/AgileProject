"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Filter, Star, ChevronDown } from "lucide-react"

export function ServicesHero() {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-white dark:bg-[#030712]">
            {/* Animated Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] mix-blend-screen animate-blob"></div>
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-8 backdrop-blur-md"
                >
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span>10,000+ Services Completed this Month</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
                >
                    Discover Trusted Services <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                        Across Northeast India
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-12"
                >
                    Book highly skilled, verified professionals for your home, tech, and personal needs in seconds.
                </motion.p>

                {/* Smart Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-white dark:bg-[#0f172a]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-3 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center relative z-20">

                        <div className="flex-1 flex items-center px-4 w-full sm:w-auto mb-4 sm:mb-0 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-white/10 pb-4 sm:pb-0">
                            <Search className="text-gray-400 mr-3 shrink-0" size={24} />
                            <input
                                type="text"
                                placeholder="e.g. 'Find electrician in Shillong'"
                                className="w-full bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400 font-medium h-12"
                            />
                        </div>

                        <div className="w-full sm:w-auto px-4 flex items-center justify-between sm:justify-start space-x-4">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                            >
                                <Filter size={20} />
                                <span>Filters</span>
                                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/25 w-full sm:w-auto">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-[#0f172a]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl mt-4 p-6 shadow-xl text-left overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Category</label>
                                        <select className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                                            <option>All Categories</option>
                                            <option>Home Services</option>
                                            <option>Appliance Repair</option>
                                            <option>Tech Services</option>
                                            <option>Personal Services</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">State</label>
                                        <select className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                                            <option>All States</option>
                                            <option>Assam</option>
                                            <option>Meghalaya</option>
                                            <option>Mizoram</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Min Rating</label>
                                        <div className="flex items-center space-x-1 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                                            <Star size={16} className="text-amber-400 fill-amber-400" />
                                            <select className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-300">
                                                <option>4.5 & above</option>
                                                <option>4.0 & above</option>
                                                <option>3.0 & above</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Price Range</label>
                                        <select className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                                            <option>Any Price</option>
                                            <option>Under ₹499</option>
                                            <option>₹500 - ₹999</option>
                                            <option>₹1000+</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Popular Tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-8 flex flex-wrap justify-center gap-2 items-center"
                >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Trending:</span>
                    {["AC Repair in Guwahati", "Electrician Imphal", "House Cleaning Shillong", "Plumber Dimapur"].map((tag) => (
                        <span key={tag} className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
