"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Zap, Wrench, Hammer, Snowflake, Tv, Leaf, Bug, Sparkles } from "lucide-react"

const SERVICES = [
    { id: 'electrician', name: 'Electrician', category: 'Home Repair', price: 149, rating: 4.8, image: '/service_electrician.png', icon: Zap, color: 'from-stone-500 to-stone-700' },
    { id: 'plumber', name: 'Plumber', category: 'Pipe Fitting', price: 149, rating: 4.6, image: '/service_plumber.png', icon: Wrench, color: 'from-slate-500 to-slate-700' },
    { id: 'carpenter', name: 'Carpenter', category: 'Woodwork', price: 199, rating: 4.7, image: '/service_carpenter.png', icon: Hammer, color: 'from-stone-600 to-stone-800' },
    { id: 'cleaning', name: 'House Cleaning', category: 'Deep Clean', price: 299, rating: 4.9, image: '/service_cleaning.png', icon: Sparkles, color: 'from-neutral-500 to-stone-700' },
    { id: 'ac-repair', name: 'AC Repair', category: 'Appliance', price: 399, rating: 4.7, image: '/service_ac_repair.png', icon: Snowflake, color: 'from-slate-400 to-slate-600' },
    { id: 'refrigerator', name: 'Refrigerator Repair', category: 'Appliance', price: 399, rating: 4.5, image: '/service_refrigerator.png', icon: Tv, color: 'from-stone-700 to-stone-900' },
    { id: 'gardening', name: 'Gardening', category: 'Outdoor', price: 349, rating: 4.8, image: '/service_gardening.png', icon: Leaf, color: 'from-stone-500 to-slate-600' },
    { id: 'pest-control', name: 'Pest Control', category: 'Maintenance', price: 799, rating: 4.9, image: '/service_pest_control.png', icon: Bug, color: 'from-slate-700 to-stone-900' }
]

// Tilt Card implementation
const TiltCard = ({ service, index }: { service: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false)
    const Icon = service.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
                    <Link href={`/services/${encodeURIComponent(service.name)}`} className="block w-full h-full">
                <motion.div
                    animate={{ scale: isHovered ? 1.02 : 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="group relative h-[420px] w-full bg-white rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border"
                >
                    {/* Background Image Layer */}
                    <motion.div
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-x-0 top-0 h-48 overflow-hidden"
                    >
                        <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </motion.div>

                    {/* Accent Gradient Overlay (Hover) */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} mix-blend-multiply opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>

                    {/* Floating Icon with 3D Pop */}
                    <motion.div
                        animate={{
                            rotateZ: isHovered ? 10 : 0,
                            scale: isHovered ? 1.1 : 1
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="absolute top-36 right-6"
                    >
                        <div className={`bg-white p-4 rounded-2xl shadow-lg border border-border group-hover:shadow-xl transition-all relative overflow-hidden`}>
                            <Icon size={26} className="text-accent relative z-10" />
                        </div>
                    </motion.div>

                    {/* Content Layer */}
                    <motion.div
                        className="absolute inset-x-0 bottom-0 top-48 flex flex-col p-8 pointer-events-none bg-background"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-700 tracking-wide uppercase">{service.category}</span>
                            <div className="flex items-center space-x-1 bg-stone-50 px-2 py-1 rounded-full border border-border">
                                <Star size={12} className="text-stone-400 fill-stone-400" />
                                <span className="text-secondary text-xs font-bold">{service.rating}</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{service.name}</h3>

                        <div className="flex items-center justify-between mt-auto">
                            <p className="text-secondary font-semibold tracking-wide">Starts at ₹{service.price}</p>

                            <div className="w-10 h-10 rounded-full bg-stone-50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-transparent text-stone-400 transition-all duration-300">
                                <ArrowRight size={18} className="group-hover:-rotate-45 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

export function ServiceShowcase() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-surface relative z-10 hidden-scrollbar border-t border-border">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight leading-[1.1]">
                            Premium Services.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-stone-600">Local Experts.</span>
                        </h2>
                        <p className="text-xl text-secondary font-medium text-balance">
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
                        <Link href="/services" className="inline-flex items-center space-x-2 text-stone-700 border-b-2 border-stone-700 pb-1 text-lg font-bold hover:text-foreground hover:border-foreground transition-colors group">
                            <span>Explore all services</span>
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Service Grid Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 perspective-[2000px]">
                    {SERVICES.map((service, index) => (
                        <TiltCard key={service.name} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
