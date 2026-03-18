"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, CheckCircle, ArrowRight, Loader2 } from "lucide-react"

const FALLBACK_PROS = [
    {
        id: "fb-1",
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
        id: "fb-2",
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
        id: "fb-3",
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
        id: "fb-4",
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

const COLORS = [
    "from-stone-500 to-stone-700",
    "from-slate-500 to-slate-700",
    "from-stone-400 to-stone-600",
    "from-neutral-500 to-stone-700"
]

const Provider3DCard = ({ pro, idx, yOffset }: { pro: any, idx: number, yOffset: any }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            style={{ y: yOffset }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.1 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative bg-white border border-border rounded-[2.5rem] p-8 overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
            >
                {/* Static Inner Glow Layer (Luxe Stone Theme) */}
                <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] bg-[radial-gradient(400px_circle_at_50%_50%,rgba(0,0,0,0.01),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                {/* Subtle Gradient Backlight */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${pro.color} blur-[80px] opacity-10 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none z-0`}></div>

                {/* Content */}
                <div className="relative z-10 pt-4">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <h3 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors">{pro.name}</h3>
                            <CheckCircle size={20} className="text-primary shadow-sm rounded-full bg-white" />
                        </div>
                        <p className="text-sm font-semibold text-secondary mb-3">{pro.profession}</p>

                        <div className="flex items-center justify-center space-x-2 text-sm text-secondary mb-4 bg-stone-50 w-max mx-auto px-3 py-1.5 rounded-full border border-border">
                            <MapPin size={14} className="text-accent" />
                            <span className="truncate max-w-[120px]">{pro.location}</span>
                        </div>

                        <div className="flex items-center justify-center space-x-3 bg-white py-2.5 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center space-x-1 pl-2">
                                <Star size={16} className="text-accent fill-accent relative -top-[1px]" />
                                <span className="font-bold text-foreground text-base">{pro.rating}</span>
                                <span className="text-xs text-secondary">({pro.reviews})</span>
                            </div>
                            <div className="w-[1px] h-5 bg-border"></div>
                            <span className="text-xs font-bold text-secondary uppercase tracking-widest pr-2">{pro.exp}</span>
                        </div>
                    </div>

                    <Link href={`/provider/${pro.id}`} className="w-full py-4 rounded-2xl bg-stone-50 hover:bg-primary text-stone-700 hover:text-white font-bold transition-colors shadow-sm flex items-center justify-center space-x-2 group/btn border border-border hover:border-transparent">
                        <span>View Profile</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    )
}

export function FeaturedProfessionals() {
    const [professionals, setProfessionals] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
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

    useEffect(() => {
        async function fetchPros() {
            try {
                const res = await fetch("/api/providers")
                const data = await res.json()
                if (data.success && data.data && data.data.length > 0) {
                    const topPros = data.data
                        .sort((a: any, b: any) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"))
                        .slice(0, 4)
                        .map((p: any, idx: number) => ({
                            id: p.id,
                            name: p.name || p.businessName,
                            profession: p.services?.[0]?.category || "Professional",
                            rating: p.rating,
                            reviews: p.reviewsCount,
                            exp: `${p.experience} Yrs Exp`,
                            location: `${p.city ? p.city.split(',')[0] : ''}, ${p.state || 'India'}`,
                            image: p.image || FALLBACK_PROS[idx % 4].image,
                            color: COLORS[idx % 4]
                        }))
                    
                    if (topPros.length < 4) {
                        setProfessionals([...topPros, ...FALLBACK_PROS.slice(topPros.length)])
                    } else {
                        setProfessionals(topPros)
                    }
                } else {
                    setProfessionals(FALLBACK_PROS)
                }
            } catch (error) {
                console.error("Failed to load featured pros", error)
                setProfessionals(FALLBACK_PROS)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPros()
    }, [])

    return (
        <section ref={containerRef} className="py-40 bg-background relative overflow-hidden hidden-scrollbar z-10">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-28 max-w-3xl mx-auto perspective-[1000px]">
                    <motion.h2
                        initial={{ opacity: 0, rotateX: 20, y: 30 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-[1.1]"
                    >
                        Meet Our <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-500 inline-block pb-2">Top Rated Pros</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-secondary font-medium"
                    >
                        Every professional on NE-Connect is identity-verified, background-checked, and highly rated by your community.
                    </motion.p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 perspective-[2000px]">
                        {professionals.map((pro, idx) => (
                            <Provider3DCard
                                key={pro.id}
                                pro={pro}
                                idx={idx}
                                yOffset={typeof window !== 'undefined' && window.innerWidth >= 1024 ? yOffsets[idx] : 0}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Soft ambient lighting for the grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-stone-200/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        </section>
    )
}
