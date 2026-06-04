"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Users } from "lucide-react"

const STATES = [
    { name: "Assam", count: 450, color: "from-emerald-400 to-green-600" },
    { name: "Meghalaya", count: 120, color: "from-blue-400 to-indigo-600" },
    { name: "Mizoram", count: 85, color: "from-purple-400 to-fuchsia-600" },
    { name: "Nagaland", count: 90, color: "from-amber-400 to-orange-600" },
    { name: "Manipur", count: 110, color: "from-rose-400 to-red-600" },
    { name: "Arunachal Pradesh", count: 60, color: "from-cyan-400 to-blue-600" },
    { name: "Tripura", count: 75, color: "from-teal-400 to-emerald-600" },
    { name: "Sikkim", count: 40, color: "from-sky-400 to-blue-600" },
]

export function ProviderMap({ onStateSelect }: { onStateSelect: (state: string) => void }) {
    const [activeState, setActiveState] = useState<string | null>(null)

    const handleSelect = (state: string) => {
        setActiveState(state === activeState ? null : state)
        onStateSelect(state === activeState ? "" : state)
    }

    return (
        <div className="bg-white dark:bg-[#0f172a]/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <MapPin className="text-indigo-500 mr-2" />
                        Interactive Map
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select a state to filter providers</p>
                </div>
                <div className="hidden sm:flex items-center space-x-2 bg-gray-50 dark:bg-black/30 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">1,030+ Pros</span>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                {STATES.map((state, idx) => {
                    const isActive = activeState === state.name
                    return (
                        <motion.button
                            key={state.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelect(state.name)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative overflow-hidden text-left p-4 rounded-2xl transition-all duration-300 border ${isActive
                                    ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                                    : 'border-gray-100 dark:border-white/5 hover:border-indigo-500/30 bg-gray-50 dark:bg-black/20'
                                }`}
                        >
                            {/* Active Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${state.color} opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-10' : 'group-hover:opacity-5'}`}></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <span className={`font-bold text-sm sm:text-base transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-200'}`}>
                                    {state.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                                    {state.count} Providers
                                </span>
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
