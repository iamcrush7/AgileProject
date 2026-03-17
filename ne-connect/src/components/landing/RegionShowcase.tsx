"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Map, Leaf, Mountain, Droplets, MoveUpRight, Star, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const STATES = [
    { id: "arunachal", name: "Arunachal Pradesh", x: 70, y: 10, color: "from-orange-400 to-red-500", icon: Mountain, providers: 124 },
    { id: "assam", name: "Assam", x: 45, y: 45, color: "from-emerald-400 to-green-600", icon: Leaf, providers: 856 },
    { id: "nagaland", name: "Nagaland", x: 80, y: 50, color: "from-rose-400 to-pink-600", icon: Map, providers: 112 },
    { id: "meghalaya", name: "Meghalaya", x: 25, y: 60, color: "from-sky-400 to-blue-600", icon: Droplets, providers: 245 },
    { id: "manipur", name: "Manipur", x: 75, y: 70, color: "from-purple-400 to-indigo-600", icon: Leaf, providers: 189 },
    { id: "tripura", name: "Tripura", x: 20, y: 85, color: "from-amber-400 to-orange-600", icon: Map, providers: 134 },
    { id: "mizoram", name: "Mizoram", x: 65, y: 90, color: "from-teal-400 to-emerald-600", icon: Mountain, providers: 98 },
    { id: "sikkim", name: "Sikkim", x: 5, y: 15, color: "from-cyan-400 to-blue-600", icon: Droplets, providers: 167 }
]

export function RegionShowcase() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
    const [activeState, setActiveState] = useState<string | null>(null)

    return (
        <section ref={sectionRef} className="py-32 bg-[#030712] relative overflow-hidden hidden-scrollbar">
            {/* Ambient Lighting mapped to pure radial gradients */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,transparent_60%)] rounded-full pointer-events-none opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_60%)] rounded-full pointer-events-none opacity-50"></div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

                    {/* Left Text Content */}
                    <div className="lg:w-[40%] text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-sm mb-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        >
                            <Map size={16} />
                            <span className="tracking-widest uppercase text-xs">Built for Northeast India</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]"
                        >
                            Empowering <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 pb-2 inline-block">Local Workers</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed text-balance"
                        >
                            Connecting skilled artisans, technicians, and everyday heroes directly with exactly the people who need them across the Seven Sisters and Sikkim.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/services" className="group inline-flex items-center space-x-3 bg-white text-black px-10 py-5 rounded-full font-bold transition-all shadow-xl hover:shadow-white/20 hover:scale-105">
                                <span className="text-lg text-black">Find Providers Nearby</span>
                                <MoveUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right 3D Isometric Map */}
                    <div className="lg:w-[60%] w-full h-[600px] md:h-[800px] relative perspective-[2000px] flex items-center justify-center -mt-20 lg:mt-0 xl:ml-10">
                        <motion.div
                            initial={{ rotateX: 65, rotateZ: -45, y: 100, opacity: 0, scale: 0.8 }}
                            animate={isInView ? { rotateX: 60, rotateZ: -35, y: 0, opacity: 1, scale: 1 } : { rotateX: 65, rotateZ: -45, y: 100, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-[600px] aspect-square"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-3xl bg-[#0f1429] shadow-[inset_0_0_100px_rgba(99,102,241,0.1)]">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] rounded-3xl [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
                            </div>

                            {/* Glowing Ring around base */}
                            <div className="absolute -inset-4 border border-emerald-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.2)]" style={{ transform: "translateZ(-10px)" }}></div>

                            {/* State Nodes */}
                            {STATES.map((state, idx) => {
                                const isActive = activeState === state.id
                                const isDimmed = activeState && !isActive

                                return (
                                    <div
                                        key={state.id}
                                        className="absolute w-12 h-12 -ml-6 -mt-6 group cursor-pointer"
                                        style={{
                                            left: `${state.x}%`,
                                            top: `${state.y}%`,
                                            transformStyle: "preserve-3d",
                                            transform: "translateZ(20px)"
                                        }}
                                        onMouseEnter={() => setActiveState(state.id)}
                                        onMouseLeave={() => setActiveState(null)}
                                    >
                                        {/* Connecting Line to ground */}
                                        <div className={`absolute top-1/2 left-1/2 w-[2px] h-[60px] origin-top bg-gradient-to-b ${state.color} opacity-40 transition-all duration-500 ${isActive ? 'h-[100px] opacity-100' : ''}`} style={{ transform: "rotateX(-90deg) rotateY(0deg) translate(-50%, 0)" }}></div>

                                        {/* Ground marker */}
                                        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0.4 }}></div>

                                        {/* 3D Floating Node */}
                                        <motion.div
                                            animate={{
                                                z: isActive ? 100 : 60,
                                                rotateX: -60, // Reverse parent rotation
                                                rotateZ: 35, // Reverse parent rotation
                                                scale: isActive ? 1.2 : 1,
                                                opacity: isDimmed ? 0.3 : 1
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={`absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 rounded-2xl bg-gradient-to-br ${state.color} border-2 border-white/20 shadow-2xl flex items-center justify-center text-white`}
                                            style={{ transformOrigin: "center center" }}
                                        >
                                            <state.icon size={20} className="shadow-black drop-shadow-md" />

                                            {/* Pulse ring for active */}
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 1 }}
                                                    animate={{ scale: 2, opacity: 0 }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                                                />
                                            )}
                                        </motion.div>

                                        {/* State Details Popup */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -20, rotateX: -60, rotateZ: 35 }}
                                                    animate={{ opacity: 1, y: -80, rotateX: -60, rotateZ: 35 }}
                                                    exit={{ opacity: 0, y: -20, rotateX: -60, rotateZ: 35 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="absolute top-1/2 left-1/2 -ml-[120px] w-[240px] bg-[#111827] border border-white/20 rounded-3xl p-5 shadow-2xl z-50 pointer-events-none"
                                                    style={{ transformOrigin: "bottom center", z: 120 }}
                                                >
                                                    <h3 className="text-xl font-bold text-white mb-1 shadow-black drop-shadow-md">{state.name}</h3>
                                                    <p className={`text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${state.color} mb-3 shadow-black drop-shadow-sm`}>Identity Verified Pro's</p>

                                                    <div className="flex items-center justify-between text-white/80 bg-black/40 rounded-xl p-3 border border-white/10 shadow-inner">
                                                        <div className="flex items-center space-x-2">
                                                            <Users size={16} />
                                                            <span className="font-semibold">{state.providers} active</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-amber-400">
                                                            <Star size={14} className="fill-amber-400" />
                                                            <span className="font-bold text-white">4.8</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
