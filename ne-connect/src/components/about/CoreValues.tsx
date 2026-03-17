"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Users, Zap, Heart } from "lucide-react"

const VALUES = [
    {
        title: "Trust & Safety",
        description: "Every service provider is verified through a rigorous background check and community rating system.",
        icon: ShieldCheck,
        color: "indigo"
    },
    {
        title: "Community First",
        description: "We bridge the gap between local talent and neighbors, empowering the regional economy of Northeast India.",
        icon: Users,
        color: "emerald"
    },
    {
        title: "Innovation",
        description: "Applying cutting-edge technology like 3D visualization and AI to modernize traditional service discovery.",
        icon: Zap,
        color: "amber"
    },
    {
        title: "Inclusivity",
        description: "Built with love for all 8 states, ensuring every tribe and community feels represented and served.",
        icon: Heart,
        color: "rose"
    }
]

export function CoreValues() {
    return (
        <section className="py-24 bg-white dark:bg-[#030712] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wider uppercase mb-4"
                    >
                        Our Foundation
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white"
                    >
                        The Values That Drive Us
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                        At NE-Connect, we aren't just building a marketplace; we're building a digital bridge for the Northeast.
                        Our core values are the heartbeat of everything we create.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((value, idx) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-sm overflow-hidden"
                        >
                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-${value.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className={`w-14 h-14 rounded-2xl bg-${value.color}-50 dark:bg-${value.color}-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out`}>
                                <value.icon className={`w-7 h-7 text-${value.color}-600 dark:text-${value.color}-400`} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {value.description}
                            </p>

                            {/* Corner Decorative Element */}
                            <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-${value.color}-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
