"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"


export function HeroSection() {
    return (
        <section className="relative min-h-[100svh] flex flex-col justify-center pt-20 overflow-hidden bg-transparent">
            {/* Professional Ambient Background Glows (Luxe Stone Theme) */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-stone-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob"></div>
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-stone-500/10 rounded-full blur-[150px] mix-blend-multiply opacity-40 animate-blob animation-delay-4000"></div>

            {/* Video Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/hero-video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-black/25" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center xl:items-start text-center xl:text-left mt-[-5%]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="inline-flex items-center space-x-2 bg-white border border-stone-200/50 backdrop-blur-xl px-5 py-2.5 rounded-full mb-8 shadow-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-stone-600 animate-pulse ring-4 ring-stone-600/20"></span>
                    <span className="text-sm font-bold text-stone-700 tracking-widest uppercase">
                        Northeast India&apos;s Premium Network
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05] max-w-5xl"
                >
                    Find Trusted Local <br className="hidden md:block" />
                    <span className="text-white pb-2 inline-block">
                        Services Near You
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                    className="max-w-2xl xl:mx-0 text-xl md:text-2xl text-white mb-12 font-medium text-balance leading-relaxed"
                >
                    Book carpenters, electricians, plumbers, cleaners and more — fast, affordable, and extremely reliable across the Northeast.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full xl:w-auto"
                >
                    <Link href="/services" className="w-full sm:w-auto px-8 py-5 bg-primary text-white hover:opacity-95 rounded-full font-bold transition-all shadow-lg hover:shadow-stone-900/20 hover:scale-105 flex items-center justify-center space-x-3 group relative overflow-hidden">
                        <span className="relative z-10 text-lg">Book a Service</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link href="/signup" className="w-full sm:w-auto px-8 py-5 bg-white hover:bg-stone-50 border border-border text-foreground rounded-full font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2 group">
                        <span className="text-lg">Become a Provider</span>
                    </Link>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-gray-400 z-10"
            >
                <span className="text-xs font-semibold tracking-widest uppercase">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
            </motion.div>
        </section>
    )
}
