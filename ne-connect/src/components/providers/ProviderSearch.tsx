"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Filter, Star, ChevronDown, SlidersHorizontal, Award } from "lucide-react"

export function ProviderSearch({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <section className="relative pt-32 pb-16 overflow-hidden bg-white dark:bg-[#030712]">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-6 backdrop-blur-md"
                    >
                        <Award size={16} />
                        <span>Northeast's Premium Talent</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
                    >
                        Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Perfect Pro</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium text-balance"
                    >
                        Browse vetted professionals by location, expertise, and verified reviews to ensure the job gets done right.
                    </motion.p>
                </div>

                {/* Powerful Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="bg-white dark:bg-black/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-3 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center relative z-20 hover:border-indigo-500/30 transition-colors">

                        <div className="flex-1 flex items-center px-4 w-full md:w-auto mb-4 md:mb-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10 pb-4 md:pb-0">
                            <Search className="text-gray-400 mr-3 shrink-0" size={24} />
                            <input
                                type="text"
                                placeholder="E.g. 'Expert Electrician in Aizawl'"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xl text-gray-900 dark:text-white placeholder-gray-400 font-medium h-14"
                            />
                        </div>

                        <div className="w-full md:w-[40%] px-4 flex items-center justify-between sm:justify-end space-x-4">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all ${isFilterOpen ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                                <SlidersHorizontal size={20} />
                                <span>Filters</span>
                            </button>
                            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 w-full sm:w-auto">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Expandable Powerful Filters */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-black/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl mt-4 p-8 shadow-xl overflow-hidden relative z-10"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Service Type</label>
                                        <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                                            <option>All Services</option>
                                            <option>Electrician</option>
                                            <option>Plumber</option>
                                            <option>Carpenter</option>
                                            <option>Cleaning</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors appearance-none">
                                                <option>All States</option>
                                                <option>Assam</option>
                                                <option>Meghalaya</option>
                                                <option>Mizoram</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Minimum Rating</label>
                                        <div className="flex items-center space-x-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
                                            <Star size={16} className="text-amber-400 fill-amber-400 shrink-0" />
                                            <select className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-300">
                                                <option>4.5+</option>
                                                <option>4.0+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Experience</label>
                                        <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                                            <option>Any Experience</option>
                                            <option>3+ Years</option>
                                            <option>5+ Years</option>
                                            <option>10+ Years (Master)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Starting Price</label>
                                        <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 transition-colors">
                                            <option>Any Price</option>
                                            <option>Under ₹299</option>
                                            <option>Under ₹499</option>
                                            <option>₹500+</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    )
}
