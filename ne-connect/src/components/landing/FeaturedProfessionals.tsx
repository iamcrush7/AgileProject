"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Star, MapPin, CheckCircle, ArrowRight } from "lucide-react"

const PROFESSIONALS = [
    {
        id: 1,
        name: "Arun Das",
        profession: "Master Electrician",
        rating: 4.9,
        reviews: 342,
        exp: "12 Yrs Exp",
        location: "Guwahati, Assam",
        image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
        color: "from-amber-400 to-orange-500"
    },
    {
        id: 2,
        name: "Rina Devi",
        profession: "Professional Cleaner",
        rating: 4.8,
        reviews: 218,
        exp: "8 Yrs Exp",
        location: "Shillong, Meghalaya",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        color: "from-teal-400 to-emerald-500"
    },
    {
        id: 3,
        name: "Thang Lian",
        profession: "Plumbing Expert",
        rating: 4.9,
        reviews: 156,
        exp: "15 Yrs Exp",
        location: "Aizawl, Mizoram",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        color: "from-blue-400 to-indigo-500"
    },
    {
        id: 4,
        name: "John Ao",
        profession: "Interior Painter",
        rating: 4.7,
        reviews: 98,
        exp: "5 Yrs Exp",
        location: "Dimapur, Nagaland",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        color: "from-rose-400 to-pink-500"
    }
]

const Provider3DCard = ({ pro, idx, yOffset }: { pro: any, idx: number, yOffset: any }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            style={{ y: yOffset }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.8, delay: idx * 0.15, type: "spring", bounce: 0.4 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative bg-white/5 dark:bg-black/40 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)] transition-shadow duration-300"
            >
                {/* Static Inner Glow */}
                <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] bg-[radial-gradient(400px_circle_at_50%_50%,rgba(255,255,255,0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                {/* Subtle Gradient Backlight */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${pro.color} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0`}></div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="relative w-28 h-28 mx-auto mb-6">
                        <Image
                            src={pro.image}
                            alt={pro.name}
                            fill
                            className="object-cover rounded-[2rem] shadow-xl group-hover:scale-105 transition-transform duration-500 border border-white/10"
                        />
                        <motion.div
                            animate={{ scale: isHovered ? 1.2 : 1, rotateZ: isHovered ? 10 : 0 }}
                            className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-1.5 shadow-lg border-2 border-black/50"
                        >
                            <CheckCircle size={18} className="text-white" />
                        </motion.div>
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{pro.name}</h3>
                        <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">{pro.profession}</p>

                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4 bg-black/20 w-max mx-auto px-3 py-1.5 rounded-full border border-white/5">
                            <MapPin size={14} className="text-emerald-500" />
                            <span>{pro.location}</span>
                        </div>

                        <div className="flex items-center justify-center space-x-3 bg-gray-50 dark:bg-black/50 backdrop-blur-md py-2.5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-inner">
                            <div className="flex items-center space-x-1 pl-2">
                                <Star size={16} className="text-amber-400 fill-amber-400 relative -top-[1px]" />
                                <span className="font-bold text-gray-900 dark:text-white text-base">{pro.rating}</span>
                                <span className="text-xs text-gray-500">({pro.reviews})</span>
                            </div>
                            <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700"></div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest pr-2">{pro.exp}</span>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white text-white hover:text-black font-bold transition-all shadow-md flex items-center justify-center space-x-2 group/btn border border-white/10 hover:border-transparent">
                        <span>View Profile</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export function FeaturedProfessionals() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const yOffsets = [
        useTransform(scrollYProgress, [0, 1], [80, -80]),
        useTransform(scrollYProgress, [0, 1], [150, -150]),
        useTransform(scrollYProgress, [0, 1], [80, -80]),
        useTransform(scrollYProgress, [0, 1], [150, -150])
    ]

    return (
        <section ref={containerRef} className="py-40 bg-transparent relative overflow-hidden hidden-scrollbar z-10">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-28 max-w-3xl mx-auto perspective-[1000px]">
                    <motion.h2
                        initial={{ opacity: 0, rotateX: 20, y: 30 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        Meet Our <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 inline-block pb-2">Top Rated Pros</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium"
                    >
                        Every professional on NE-Connect is identity-verified, background-checked, and highly rated by your community.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 perspective-[2000px]">
                    {PROFESSIONALS.map((pro, idx) => (
                        <Provider3DCard
                            key={pro.id}
                            pro={pro}
                            idx={idx}
                            yOffset={typeof window !== 'undefined' && window.innerWidth >= 1024 ? yOffsets[idx] : 0}
                        />
                    ))}
                </div>
            </div>

            {/* Soft ambient lighting for the grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        </section>
    )
}
