"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BadgeIndianRupee, TrendingUp, CalendarCheck } from "lucide-react"

export function ProviderCTA() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })

    return (
        <section ref={containerRef} className="py-24 bg-white dark:bg-[#030712] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                    className="relative rounded-[3rem] overflow-hidden bg-indigo-600 dark:bg-indigo-900 shadow-2xl shadow-indigo-500/20"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-12">

                        <div className="md:w-3/5 text-center md:text-left">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1]"
                            >
                                Earn More by Joining <br /> Sahyog-NE
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-xl text-indigo-100 mb-10 max-w-xl text-balance"
                            >
                                Grow your independent business, manage your calendar, and find clients effortlessly across the Northeast. Be your own boss.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-col sm:flex-row items-center gap-4"
                            >
                                <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold flex items-center justify-center space-x-2 group hover:scale-105 transition-transform shadow-lg">
                                    <span>Register as a Provider</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <span className="text-indigo-200 text-sm font-medium">Free to join. 0% upfront fees.</span>
                            </motion.div>
                        </div>

                        <div className="md:w-2/5 w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                                animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.9, rotateX: 20 }}
                                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className="grid grid-cols-1 gap-4 perspective-1000"
                            >
                                <div className="bg-white/10 border border-white/20 p-6 rounded-[2rem] flex items-center shadow-2xl group hover:-translate-y-1 transition-transform cursor-default">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-400 group-hover:text-emerald-900 transition-colors">
                                        <BadgeIndianRupee size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Predictable Income</h4>
                                        <p className="text-indigo-200 pl-0 mt-1">Get paid straight to your bank account securely.</p>
                                    </div>
                                </div>

                                <div className="bg-white/10 border border-white/20 p-6 rounded-[2rem] flex items-center shadow-2xl group hover:-translate-y-1 transition-transform cursor-default ml-8">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-400 group-hover:text-amber-900 transition-colors">
                                        <TrendingUp size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Consistent Growth</h4>
                                        <p className="text-indigo-200 mt-1">Access to 10k+ local families searching daily.</p>
                                    </div>
                                </div>

                                <div className="bg-white/10 border border-white/20 p-6 rounded-[2rem] flex items-center shadow-2xl group hover:-translate-y-1 transition-transform cursor-default">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-rose-400 group-hover:text-rose-900 transition-colors">
                                        <CalendarCheck size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Flexible Schedule</h4>
                                        <p className="text-indigo-200 mt-1">Work only when you want. Set your own hours.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    )
}
