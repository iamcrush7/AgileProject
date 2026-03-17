"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Star, Zap } from "lucide-react"

const RECOMMENDED = [
    { id: '1', name: "Electrician", location: "Popular in Shillong", price: 149, rating: 4.8, reviews: 120, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80" },
    { id: '2', name: "House Cleaning", location: "Trending near you", price: 299, rating: 4.9, reviews: 340, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80" },
    { id: '3', name: "AC Service", location: "High demand today", price: 399, rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1527685609591-44b0aef24db6?w=600&q=80" },
    { id: '4', name: "Plumber", location: "Popular in Shillong", price: 149, rating: 4.6, reviews: 211, image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80" },
    { id: '5', name: "Home Painter", location: "Seasonal favorite", price: 299, rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80" },
]

export function RecommendedCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            setTimeout(checkScroll, 400) // Recheck after scroll animation
        }
    }

    return (
        <section ref={sectionRef} className="py-24 bg-white dark:bg-[#030712] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-emerald-500/5 via-indigo-500/5 to-purple-500/5 -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-4 border border-emerald-100 dark:border-emerald-500/20">
                            <Sparkles size={14} />
                            <span>AI Curated</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Recommended for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">You</span>
                        </h2>
                        <div className="flex items-center space-x-2 mt-3 text-gray-500 dark:text-gray-400 font-medium">
                            <MapPin size={16} />
                            <span>Based on your location: <strong className="text-gray-900 dark:text-gray-200">Shillong, Meghalaya</strong></span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex space-x-3 mt-6 md:mt-0"
                    >
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-105 active:scale-95 bg-white dark:bg-[#0f172a] shadow-sm text-gray-900 dark:text-white'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={`w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-105 active:scale-95 bg-white dark:bg-[#0f172a] shadow-sm text-gray-900 dark:text-white'}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </motion.div>
                </div>

                {/* Carousel */}
                <div className="relative -mx-4 sm:mx-0">
                    <div
                        ref={carouselRef}
                        onScroll={checkScroll}
                        className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 sm:px-0 snap-x snap-mandatory hidden-scrollbar"
                    >
                        {RECOMMENDED.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: 0.1 * idx }}
                                className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[380px] group cursor-pointer"
                            >
                                <div className="relative h-[240px] md:h-[280px] w-full rounded-[2rem] overflow-hidden mb-5 box-shadow-xl border border-gray-100 dark:border-white/10 bg-gray-100 dark:bg-gray-800">
                                    <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm border border-black/5 dark:border-white/10">
                                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{service.location}</span>
                                    </div>

                                    <div className="absolute bottom-4 right-4 bg-white dark:bg-white text-gray-900 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <ChevronRight size={20} className="font-bold group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{service.name}</h3>
                                        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/5">
                                            <Star size={14} className="text-amber-400 fill-amber-400 -mt-[1px]" />
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{service.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">₹{service.price} onwards • {service.reviews} jobs completed</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Gradient Fades for Carousel Edges */}
                    <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-[#030712] to-transparent pointer-events-none opacity-0 md:opacity-100"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-[#030712] to-transparent pointer-events-none opacity-0 md:opacity-100"></div>
                </div>
            </div>
        </section>
    )
}
