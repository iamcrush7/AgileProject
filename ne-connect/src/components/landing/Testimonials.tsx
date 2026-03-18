"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Star } from "lucide-react"

const TESTIMONIALS = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Homeowner from Guwahati",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        quote: "Finding a reliable electrician was always a headache. NE-Connect made it possible in 2 minutes. Outstanding service!",
        rating: 5
    },
    {
        id: 2,
        name: "Lalrochhangi",
        role: "Cafe Owner in Aizawl",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        quote: "I use this platform for all my business maintenance. The local professionals are vetted, polite, and very skilled.",
        rating: 5
    },
    {
        id: 3,
        name: "David Konyak",
        role: "Resident in Dimapur",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        quote: "Booked a deep cleaning service before the holidays. They did a fantastic job at a very transparent price.",
        rating: 4.5
    },
    {
        id: 4,
        name: "Ibohal Singh",
        role: "Landlord in Imphal",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        quote: "The chatbot translating my Manipuri straight into booking instructions for the plumber blew my mind. True local tech.",
        rating: 5
    }
]

export function Testimonials() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const xLeft = useTransform(scrollYProgress, [0, 1], [0, -400])
    const xRight = useTransform(scrollYProgress, [0, 1], [0, 400])

    return (
        <section ref={containerRef} className="py-32 bg-background relative overflow-hidden hidden-scrollbar">
            {/* Ambient Background Gradient mapping */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(58,51,46,0.05)_0%,transparent_70%)] rounded-full pointer-events-none opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-foreground tracking-tight"
                >
                    Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-stone-600">thousands</span> of families.
                </motion.h2>
            </div>

            <div className="relative z-10 hidden-scrollbar overflow-visible">
                {/* Marquee Row 1 (Moves Left) */}
                <motion.div style={{ x: xLeft }} className="flex space-x-6 w-max pl-4 sm:pl-8 mb-6">
                    {TESTIMONIALS.map((testimonial) => (
                        <div key={`row1-${testimonial.id}`} className="w-[350px] md:w-[450px] bg-white border border-border rounded-3xl p-8 shadow-sm">
                            <div className="flex space-x-1 mb-6">
                                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                                ))}
                                {testimonial.rating % 1 !== 0 && (
                                    <Star size={18} className="text-amber-400 fill-amber-400/50" />
                                )}
                            </div>
                            <p className="text-lg text-gray-900 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate for infinite feel in wide screens */}
                    {TESTIMONIALS.map((testimonial) => (
                        <div key={`row1-dup-${testimonial.id}`} className="w-[350px] md:w-[450px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg">
                            <div className="flex space-x-1 mb-6">
                                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                                ))}
                                {testimonial.rating % 1 !== 0 && (
                                    <Star size={18} className="text-amber-400 fill-amber-400/50" />
                                )}
                            </div>
                            <p className="text-lg text-gray-900 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Marquee Row 2 (Moves Right) */}
                <motion.div style={{ x: xRight }} className="flex space-x-6 w-max -ml-[600px] pr-4 sm:pr-8">
                    {[...TESTIMONIALS].reverse().map((testimonial) => (
                        <div key={`row2-${testimonial.id}`} className="w-[350px] md:w-[450px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg">
                            <div className="flex space-x-1 mb-6">
                                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                                ))}
                                {testimonial.rating % 1 !== 0 && (
                                    <Star size={18} className="text-amber-400 fill-amber-400/50" />
                                )}
                            </div>
                            <p className="text-lg text-gray-900 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate for infinite feel in wide screens */}
                    {[...TESTIMONIALS].reverse().map((testimonial) => (
                        <div key={`row2-dup-${testimonial.id}`} className="w-[350px] md:w-[450px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-lg">
                            <div className="flex space-x-1 mb-6">
                                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                                ))}
                                {testimonial.rating % 1 !== 0 && (
                                    <Star size={18} className="text-amber-400 fill-amber-400/50" />
                                )}
                            </div>
                            <p className="text-lg text-gray-900 dark:text-gray-200 font-medium mb-8 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Side Fade Overlays */}
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>
            </div>
        </section>
    )
}
