"use client"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Briefcase, Map, Star } from "lucide-react"

const AnimatedCounter = ({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    useEffect(() => {
        if (!isInView) return

        let startTime: number | null = null
        let animationFrame: number

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = (timestamp - startTime) / (duration * 1000)

            if (progress < 1) {
                setCount(Math.min(Math.floor(end * progress), end))
                animationFrame = requestAnimationFrame(updateCount)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(updateCount)
        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration, isInView])

    return (
        <span ref={ref} className="font-tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export function ImpactCounters() {
    return (
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
            {/* Dark Mode Specific Backgrounds */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Our Impact in Numbers</h2>
                    <p className="text-gray-400 text-lg">We are rapidly growing to serve the beautiful communities of the Northeast region.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center group"
                    >
                        <div className="w-16 h-16 mx-auto bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                            <Users size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                            <AnimatedCounter end={1200} suffix="+" />
                        </h3>
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Active Providers</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center group"
                    >
                        <div className="w-16 h-16 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                            <Briefcase size={32} className="text-emerald-400" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                            <AnimatedCounter end={15000} suffix="+" />
                        </h3>
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Services Booked</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-center group"
                    >
                        <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                            <Map size={32} className="text-amber-400" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                            <AnimatedCounter end={8} />
                        </h3>
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">States Covered</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-center group"
                    >
                        <div className="w-16 h-16 mx-auto bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-300">
                            <Star size={32} className="text-pink-400" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                            <AnimatedCounter end={4} suffix=".8" />
                        </h3>
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Average Rating</p>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
