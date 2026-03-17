"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Zap, Wrench, Hammer, Snowflake, Tv, Sparkles, Bug, LayoutGrid, BookOpen, Car, Laptop, Camera } from "lucide-react"

const TABS = ["All Services", "Home Services", "Appliance Repair", "Cleaning", "Construction", "Personal Services", "Tech Services"]

const SERVICES = [
    { id: 'electrician', name: 'Electrician', description: 'Fix wiring, switches, lights and electrical issues', price: 149, rating: 4.7, reviews: 312, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', category: 'Home Services', icon: Zap },
    { id: 'plumber', name: 'Plumber', description: 'Leak repairs, pipe fitting and bathroom fixtures', price: 149, rating: 4.6, reviews: 250, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80', category: 'Home Services', icon: Wrench },
    { id: 'carpenter', name: 'Carpenter', description: 'Woodwork, furniture repair and custom building', price: 199, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80', category: 'Home Services', icon: Hammer },
    { id: 'house-cleaning', name: 'House Cleaning', description: 'Deep cleaning for small to large homes', price: 299, rating: 4.9, reviews: 350, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', category: 'Cleaning', icon: Sparkles },
    { id: 'ac-repair', name: 'AC Service & Repair', description: 'Service, repair and installation for all AC brands', price: 399, rating: 4.7, reviews: 410, image: 'https://images.unsplash.com/photo-1527685609591-44b0aef24db6?w=800&q=80', category: 'Appliance Repair', icon: Snowflake },
    { id: 'appliance-repair', name: 'Appliance Repair', description: 'Washing machine, Refrigerator, and Microwave repair', price: 199, rating: 4.6, reviews: 201, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80', category: 'Appliance Repair', icon: Tv },
    { id: 'pest-control', name: 'Pest Control', description: 'Termite, cockroach and general pest treatments', price: 499, rating: 4.6, reviews: 112, image: 'https://images.unsplash.com/photo-1622322634354-bc710c0e81b6?w=800&q=80', category: 'Cleaning', icon: Bug },
    { id: 'tile-installation', name: 'Tile Installation', description: 'Floor and wall tile design & fitting', price: 499, rating: 4.7, reviews: 90, image: 'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=800&q=80', category: 'Construction', icon: LayoutGrid },
    { id: 'home-tutor', name: 'Home Tutor', description: 'Math, Science and Language tutors for kids', price: 300, rating: 4.8, reviews: 120, image: 'https://images.unsplash.com/photo-1427504494785-319ce8372ac0?w=800&q=80', category: 'Personal Services', icon: BookOpen },
    { id: 'driver', name: 'Driver on Demand', description: 'Reliable drivers for city and outstation trips', price: 499, rating: 4.9, reviews: 322, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', category: 'Personal Services', icon: Car },
    { id: 'laptop-repair', name: 'Laptop Repair', description: 'Screen, battery and motherboard fixes', price: 299, rating: 4.7, reviews: 215, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80', category: 'Tech Services', icon: Laptop },
    { id: 'cctv', name: 'CCTV Install', description: 'Home and office security camera setup', price: 399, rating: 4.8, reviews: 105, image: 'https://images.unsplash.com/photo-1557597774-9d273e387084?w=800&q=80', category: 'Tech Services', icon: Camera }
]

export function PopularServices() {
    const [activeTab, setActiveTab] = useState("All Services")

    const filteredServices = activeTab === "All Services"
        ? SERVICES
        : SERVICES.filter(s => s.category === activeTab)

    return (
        <section className="py-24 bg-gray-50 dark:bg-[#0a0f1a] relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4 px-5 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-bold tracking-wide shadow-sm border border-emerald-200 dark:border-emerald-500/20"
                    >
                        Affordable local pricing for Northeast India
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
                    >
                        Popular Services in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Northeast India</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Affordable and trusted professionals near you
                    </motion.p>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-6 mb-8 custom-scrollbar space-x-3 justify-start lg:justify-center relative z-10 scroll-smooth">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === tab
                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 scale-105"
                                    : "bg-white dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-105"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {filteredServices.map((service) => {
                            const Icon = service.icon
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                                    key={service.id}
                                    className="group"
                                >
                                    <Link href={`/services?category=${service.id}`} className="flex flex-col h-full bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30">
                                        <div className="relative h-56 w-full overflow-hidden">
                                            <Image
                                                src={service.image}
                                                alt={service.name}
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

                                            {/* Icon Badge */}
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-white/20 z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                                                <Icon size={20} className="text-indigo-600 dark:text-emerald-400" />
                                            </div>

                                            {/* Price Badge overlay */}
                                            <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 flex items-center shadow-emerald-500/30">
                                                Starting from ₹{service.price}
                                            </div>

                                            <div className="absolute bottom-4 right-4 flex items-center bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                                                <Star size={12} className="text-amber-400 fill-amber-400 text-xs" />
                                                <span className="text-white text-xs font-bold ml-1">{service.rating}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                                                {service.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 text-balance">
                                                {service.description}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-5 mt-auto">
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    Based on {service.reviews} reviews
                                                </div>
                                                <div className="text-sm font-semibold text-indigo-600 dark:text-emerald-400 flex items-center group-hover:translate-x-1 transition-transform bg-indigo-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                                    Book Now <ArrowRight size={14} className="ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-12 text-center">
                    <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-gray-900 dark:text-white font-semibold shadow-sm transition-all hover:shadow-md group">
                        Explore All Services
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform text-indigo-500" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
