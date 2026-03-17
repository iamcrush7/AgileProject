"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ShieldCheck, Banknote, Zap, MapPin, Languages } from "lucide-react"

const TRUST_FEATURES = [
    {
        id: "verified",
        title: "Verified Professionals",
        description: "100% identity and background checked experts.",
        icon: ShieldCheck,
        color: "text-indigo-400",
        bg: "from-indigo-500/20 to-indigo-500/0",
        glow: "shadow-[0_0_30px_rgba(99,102,241,0.2)]"
    },
    {
        id: "affordable",
        title: "Affordable Pricing",
        description: "Transparent, upfront costs with no hidden fees.",
        icon: Banknote,
        color: "text-emerald-400",
        bg: "from-emerald-500/20 to-emerald-500/0",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]"
    },
    {
        id: "fast",
        title: "Fast Booking",
        description: "Confirm your appointment in less than 60 seconds.",
        icon: Zap,
        color: "text-amber-400",
        bg: "from-amber-500/20 to-amber-500/0",
        glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]"
    },
    {
        id: "local",
        title: "Local Workers",
        description: "Empowering the Northeast Indian workforce directly.",
        icon: MapPin,
        color: "text-rose-400",
        bg: "from-rose-500/20 to-rose-500/0",
        glow: "shadow-[0_0_30px_rgba(244,63,94,0.2)]"
    },
    {
        id: "multilingual",
        title: "Multilingual Support",
        description: "Chat in Assamese, Hindi, Mizo, and 5+ more languages.",
        icon: Languages,
        color: "text-cyan-400",
        bg: "from-cyan-500/20 to-cyan-500/0",
        glow: "shadow-[0_0_30px_rgba(6,182,212,0.2)]"
    }
]

const TrustCard = ({ feature, idx, isInView }: { feature: any, idx: number, isInView: boolean }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMousePosition({ x, y })
    }

    const Icon = feature.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: 15 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : { opacity: 0, y: 30, scale: 0.9, rotateX: 15 }}
            transition={{ duration: 0.6, delay: 0.1 * idx, type: "spring", bounce: 0.4 }}
            className="perspective-[1500px] w-full max-w-[280px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 0, y: 0 }) }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                animate={{
                    rotateY: isHovered ? mousePosition.x * 20 : 0,
                    rotateX: isHovered ? -mousePosition.y * 20 : 0,
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative h-full bg-white/5 dark:bg-black/30 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center cursor-default transition-all duration-300 ${isHovered ? feature.glow : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Glow Background */}
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.bg} opacity-0 transition-opacity duration-300 rounded-[2rem] ${isHovered ? 'opacity-100' : ''}`} />

                {/* 3D Icon Container */}
                <motion.div
                    animate={{ z: isHovered ? 40 : 10 }}
                    className="relative w-16 h-16 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <Icon size={32} className={`${feature.color}`} strokeWidth={1.5} />

                    {/* Ring glow on hover */}
                    {isHovered && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 1 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1 }}
                            className={`absolute inset-0 rounded-2xl border ${feature.color.replace('text', 'border')} mix-blend-screen pointer-events-none`}
                        />
                    )}
                </motion.div>

                {/* Text Content */}
                <motion.div animate={{ z: isHovered ? 20 : 0 }} className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function TrustSection() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <section ref={containerRef} className="py-24 bg-transparent relative z-10 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 pb-2 inline-block"
                    >
                        Why NE-Connect?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium text-balance"
                    >
                        We're building the most reliable digital infrastructure for real-world services in the Northeast.
                    </motion.p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 lg:gap-8 perspective-[2000px]">
                    {TRUST_FEATURES.map((feature, idx) => (
                        <TrustCard key={feature.id} feature={feature} idx={idx} isInView={isInView} />
                    ))}
                </div>

            </div>
        </section>
    )
}
