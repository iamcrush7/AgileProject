"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Shield, Sparkles, Check, ChevronDown, Wrench } from "lucide-react"

const SERVICES = [
    { id: 1, name: "Basic Electrical Visit & Inspection", desc: "Diagnostic visit to identify faults.", price: 149, time: "30 mins", icon: Zap },
    { id: 2, name: "Ceiling Fan Installation / Re-wiring", desc: "Complete installation including balancing.", price: 299, time: "1 hour", icon: Wrench },
    { id: 3, name: "Smart Switch Installation", desc: "Upgrade your standard switches to smart Wi-Fi enabled switches.", price: 499, time: "2 hours", icon: Sparkles },
    { id: 4, name: "Circuit Breaker / MCB Replacement", desc: "Replace faulty circuits ensuring complete safety.", price: 699, time: "1.5 hours", icon: Shield },
]

export function ProviderServices({ services = [] }: { services?: any[] }) {
    const [selectedService, setSelectedService] = useState<string | null>(null)

    if (!services || services.length === 0) return null;

    return (
        <div className="w-full">
            <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services & Pricing</h2>
            </div>

            <div className="space-y-4">
                {services.map((service, idx) => {
                    const isSelected = selectedService === service.id

                    // Fallback to Zap icon if category doesn't have a specific mapping yet
                    const Icon = Zap

                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedService(isSelected ? null : service.id)}
                            className={`group cursor-pointer relative bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border rounded-[1.5rem] p-5 lg:p-6 transition-all duration-300 ${isSelected
                                ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 dark:bg-indigo-500/5'
                                : 'border-gray-200 dark:border-white/10 hover:border-indigo-500/30 hover:shadow-lg'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-500'}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{service.name}</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
                                    <div className="flex items-center mt-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                        <span>Est. Time: {service.estimatedTime} mins</span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col justify-between items-end shrink-0">
                                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">₹{service.price}</span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-white/20 text-transparent'}`}>
                                        <Check size={14} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
