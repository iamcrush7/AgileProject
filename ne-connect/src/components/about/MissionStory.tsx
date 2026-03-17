"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Shield, Target, Zap, LineChart } from "lucide-react"
import Image from "next/image"

export function MissionStory() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const yVal = useTransform(scrollYProgress, [0, 1], [150, -150])
    const opacityVal = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <section ref={containerRef} className="py-24 relative bg-white dark:bg-[#030712] overflow-hidden">

            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 dark:via-indigo-900/10 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header Sequence */}
                <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-6 border border-indigo-100 dark:border-indigo-500/20"
                    >
                        <Target size={16} />
                        <span>Our Mission</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8 text-balance"
                    >
                        Empowering Northeast India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">Local Workforce</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed text-balance"
                    >
                        We are building the digital infrastructure to connect skilled local professionals with communities across the 8 states, making services safer, faster, and more accessible.
                    </motion.p>
                </div>

                {/* Parallax Image & Core Pillars */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Side */}
                    <div className="relative h-[500px] lg:h-[700px] w-full rounded-[3rem] overflow-hidden group border border-gray-200 dark:border-white/10 shadow-2xl">
                        <motion.div style={{ y: yVal, opacity: opacityVal }} className="absolute -inset-10">
                            <Image
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80"
                                alt="Northeast India Hills"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-10">
                            <h3 className="text-3xl font-bold text-white mb-2">Rooted in Tradition.</h3>
                            <h3 className="text-3xl font-bold text-emerald-400">Powered by Tech.</h3>
                        </div>
                    </div>

                    {/* Content Logic */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-500"
                        >
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                                <LineChart size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Economic Growth</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                By providing a robust digital marketplace, we help local experts increase their daily earnings by up to 300% taking away the friction of acquiring new customers.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-500"
                        >
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Trust & Safety First</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                We meticulously vet our providers through strict background checks. Families in Northeast India can trust exactly who is entering their home.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-500"
                        >
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Frictionless Experience</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                Using localized AI tools to bridge language gaps, booking a service is as easy as sending a message. Breaking boundaries through seamless technology.
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
