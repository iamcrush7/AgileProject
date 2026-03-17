"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Zap, Wrench, Hammer, Snowflake, Tv, Paintbrush, Laptop, Sparkles } from "lucide-react"

const SERVICES = [
    { id: 'electrician', name: 'Electrician', category: 'Home Repair', price: 149, rating: 4.8, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', icon: Zap, color: 'from-amber-400 to-orange-500' },
    { id: 'plumber', name: 'Plumber', category: 'Pipe Fitting', price: 149, rating: 4.6, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80', icon: Wrench, color: 'from-blue-400 to-cyan-500' },
    { id: 'carpenter', name: 'Carpenter', category: 'Woodwork', price: 199, rating: 4.7, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80', icon: Hammer, color: 'from-orange-400 to-red-500' },
    { id: 'cleaning', name: 'House Cleaning', category: 'Deep Clean', price: 299, rating: 4.9, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', icon: Sparkles, color: 'from-teal-400 to-emerald-500' },
    { id: 'ac-repair', name: 'AC Repair', category: 'Appliance', price: 399, rating: 4.7, image: 'https://images.unsplash.com/photo-1527685609591-44b0aef24db6?w=800&q=80', icon: Snowflake, color: 'from-cyan-400 to-blue-500' },
    { id: 'appliance', name: 'Appliance Repair', category: 'Maintenance', price: 199, rating: 4.5, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80', icon: Tv, color: 'from-indigo-400 to-purple-500' },
    { id: 'painting', name: 'Home Painter', category: 'Renovation', price: 299, rating: 4.8, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', icon: Paintbrush, color: 'from-rose-400 to-pink-500' },
    { id: 'laptop', name: 'Tech Repair', category: 'Electronics', price: 299, rating: 4.9, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80', icon: Laptop, color: 'from-slate-600 to-gray-800' }
]

// Tilt Card implementation
const TiltCard = ({ service, index }: { service: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false)
    const Icon = service.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.8, delay: index * 0.1, type: "spring", bounce: 0.4 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{ scale: isHovered ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative h-[420px] w-full bg-black/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden cursor-pointer shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.3)] transition-shadow duration-300"
            >
                {/* Background Image Layer */}
                <motion.div
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover opacity-[0.35] group-hover:opacity-20 transition-opacity duration-500"
                    />
                </motion.div>

                {/* Glassmorphic Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent transition-opacity duration-500`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} mix-blend-overlay opacity-0 group-hover:opacity-50 transition-opacity duration-700`}></div>

                {/* Floating Icon with 3D Pop */}
                <motion.div
                    animate={{
                        z: isHovered ? 80 : 0,
                        rotateZ: isHovered ? -10 : 0,
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute top-6 right-6"
                >
                    <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl group-hover:bg-white/20 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Icon size={26} className="text-white relative z-10" />
                    </div>
                </motion.div>

                {/* Static Glowing Highlight */}
                <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] bg-[radial-gradient(600px_circle_at_50%_50%,rgba(255,255,255,0.1),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content Layer */}
                <motion.div
                    animate={{ y: isHovered ? -15 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-8 pointer-events-none"
                >
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide uppercase border border-white/10">{service.category}</span>
                        <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-white text-xs font-bold">{service.rating}</span>
                        </div>
                    </div>

                    <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{service.name}</h3>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-emerald-400 font-medium text-lg tracking-wide group-hover:text-white transition-colors">Starts at ₹{service.price}</p>

                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 text-white transition-all duration-300">
                            <ArrowRight size={18} className="group-hover:-rotate-45 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function ServiceShowcase() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [100, -100])

    return (
        <section ref={containerRef} className="py-32 bg-transparent relative z-10 hidden-scrollbar">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                            Premium Services.<br />
                            <span className="text-gray-500">Local Experts.</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-medium text-balance">
                            Experience the highest quality home and technical services, powered by vetted professionals right in your neighborhood.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-8 md:mt-0"
                    >
                        <Link href="/services" className="inline-flex items-center space-x-2 text-white border-b-2 border-indigo-500 pb-1 text-lg font-bold hover:text-indigo-400 hover:border-indigo-400 transition-colors group">
                            <span>Explore all services</span>
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Animated Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 perspective-[2000px]">
                    {SERVICES.map((service, idx) => (
                        <TiltCard key={service.id} service={service} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    )
}
