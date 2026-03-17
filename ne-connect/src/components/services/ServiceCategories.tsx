"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Star, Zap, Wrench, Hammer, Snowflake, Tv, Paintbrush, Laptop, Sparkles, Droplets, Baby, Heart, ShieldCheck, ArrowRight, Settings, Smartphone } from "lucide-react"

const CATEGORIES = ["All", "Home Services", "Appliance Repair", "Tech Services", "Personal Services", "Outdoor Services"]

const SERVICES = [
    // Home Services
    { id: 'electrician', name: 'Electrician', category: 'Home Services', price: 149, rating: 4.8, reviews: 342, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', icon: Zap, color: 'from-amber-400 to-orange-500' },
    { id: 'plumber', name: 'Plumber', category: 'Home Services', price: 149, rating: 4.6, reviews: 256, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80', icon: Wrench, color: 'from-blue-400 to-cyan-500' },
    { id: 'carpenter', name: 'Carpenter', category: 'Home Services', price: 199, rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80', icon: Hammer, color: 'from-orange-400 to-red-500' },
    { id: 'painter', name: 'Home Painter', category: 'Home Services', price: 299, rating: 4.8, reviews: 412, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', icon: Paintbrush, color: 'from-rose-400 to-pink-500' },
    { id: 'cleaning', name: 'House Cleaning', category: 'Home Services', price: 299, rating: 4.9, reviews: 521, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', icon: Sparkles, color: 'from-teal-400 to-emerald-500' },

    // Appliance Repair
    { id: 'ac-repair', name: 'AC Service', category: 'Appliance Repair', price: 399, rating: 4.7, reviews: 231, image: 'https://images.unsplash.com/photo-1527685609591-44b0aef24db6?w=800&q=80', icon: Snowflake, color: 'from-cyan-400 to-blue-500' },
    { id: 'fridge-repair', name: 'Refrigerator Repair', category: 'Appliance Repair', price: 249, rating: 4.5, reviews: 154, image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80', icon: Settings, color: 'from-indigo-400 to-purple-500' },
    { id: 'tv-repair', name: 'TV Repair', category: 'Appliance Repair', price: 199, rating: 4.6, reviews: 178, image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80', icon: Tv, color: 'from-gray-400 to-sky-500' },

    // Tech Services
    { id: 'mobile-repair', name: 'Mobile Repair', category: 'Tech Services', price: 199, rating: 4.9, reviews: 623, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80', icon: Smartphone, color: 'from-purple-400 to-fuchsia-500' },
    { id: 'laptop-repair', name: 'Laptop Repair', category: 'Tech Services', price: 299, rating: 4.8, reviews: 412, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', icon: Laptop, color: 'from-slate-600 to-gray-800' },

    // Personal Services
    { id: 'tutoring', name: 'Home Tutor', category: 'Personal Services', price: 399, rating: 4.9, reviews: 120, image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80', icon: ShieldCheck, color: 'from-yellow-400 to-orange-500' },
    { id: 'babysitter', name: 'Babysitter', category: 'Personal Services', price: 299, rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1502048590623-28affb706c9a?w=800&q=80', icon: Baby, color: 'from-pink-400 to-rose-400' },
    { id: 'eldercare', name: 'Elderly Care', category: 'Personal Services', price: 499, rating: 4.9, reviews: 234, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80', icon: Heart, color: 'from-red-400 to-rose-600' },

    // Outdoor Services
    { id: 'gardening', name: 'Gardening', category: 'Outdoor Services', price: 199, rating: 4.6, reviews: 76, image: 'https://images.unsplash.com/photo-1416879598555-585bb736aaca?w=800&q=80', icon: Droplets, color: 'from-green-400 to-emerald-600' }
]

// Advanced Tilt Card
const ServiceCard = ({ service, index }: { service: any, index: number }) => {
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

    const Icon = service.icon

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 0, y: 0 }) }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                animate={{
                    rotateY: isHovered ? mousePosition.x * 15 : 0,
                    rotateX: isHovered ? -mousePosition.y * 15 : 0,
                    scale: isHovered ? 1.02 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-[400px] w-full bg-black rounded-[2rem] overflow-hidden cursor-pointer will-change-transform shadow-lg hover:shadow-2xl"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Background Image Layer */}
                <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    unoptimized
                    className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110"
                />

                {/* Glassmorphic Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent transition-opacity duration-500`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} mix-blend-overlay opacity-0 group-hover:opacity-60 transition-opacity duration-700`}></div>

                {/* Floating Icon with 3D Pop */}
                <motion.div
                    animate={{ z: isHovered ? 40 : 0 }}
                    className="absolute top-5 right-5"
                >
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-colors">
                        <Icon size={20} className="text-white" />
                    </div>
                </motion.div>

                {/* Content Layer */}
                <motion.div
                    animate={{ z: isHovered ? 30 : 0, y: isHovered ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex flex-col justify-end p-6"
                >
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                            <Star size={12} className="text-amber-400 fill-amber-400 relative -top-[1px]" />
                            <span className="text-white text-xs font-bold">{service.rating}</span>
                            <span className="text-gray-400 text-[10px]">({service.reviews})</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">{service.name}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-1 group-hover:text-white transition-colors">Professional {service.name.toLowerCase()} for your area.</p>

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <div>
                            <p className="text-xs text-gray-400">Starting from</p>
                            <p className="text-emerald-400 font-bold text-lg">₹{service.price}</p>
                        </div>

                        <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 text-white transition-all duration-300 font-semibold text-sm">
                            <span>Book Now</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function ServiceCategories() {
    const [activeTab, setActiveTab] = useState("All")

    const filteredServices = activeTab === "All"
        ? SERVICES
        : SERVICES.filter(s => s.category === activeTab)

    return (
        <section className="py-20 bg-gray-50 dark:bg-[#0a0f1a] relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Advanced Animated Tabs */}
                <div className="flex overflow-x-auto hidden-scrollbar mb-12 py-2">
                    <div className="flex space-x-2 mx-auto bg-white/50 dark:bg-black/40 p-1.5 rounded-full backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${activeTab === cat ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            >
                                {activeTab === cat && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-gray-900 dark:bg-white rounded-full shadow-md"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className={`relative z-10 ${activeTab === cat ? 'dark:text-gray-900' : ''}`}>{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3D Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 perspective-[2000px]">
                    <AnimatePresence mode="popLayout">
                        {filteredServices.map((service, idx) => (
                            <ServiceCard key={service.id} service={service} index={idx} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No services found for this category.
                    </div>
                )}
            </div>
        </section>
    )
}
