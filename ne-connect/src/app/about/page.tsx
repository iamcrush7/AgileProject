"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Target, Heart, Shield, Users, Zap, Award } from "lucide-react"
import { useRef } from "react"

const stats = [
    { label: "Verified Pros", value: "5,000+" },
    { label: "Happy Customers", value: "250k+" },
    { label: "Cities Covered", value: "100+" },
    { label: "Average Rating", value: "4.8/5" }
]

const values = [
    {
        title: "Trust First",
        description: "Every professional undergoes rigorous background checks and identity verification before joining our platform.",
        icon: Shield,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Community Driven",
        description: "We believe in empowering local businesses while providing unmatched convenience to our neighbors.",
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        title: "Uncompromising Quality",
        description: "We don't just connect you; we ensure the job is done right. Quality is our standard, not an option.",
        icon: Award,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        title: "Lightning Fast",
        description: "Time is valuable. Our platform is optimized to connect you with the right pro in minutes, not hours.",
        icon: Zap,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
]

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
    
    // Parallax values
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200])
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-indigo-500/30">
            
            {/* Top Navigation Bar */}
            <div className="fixed top-0 inset-x-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors group">
                        <div className="p-1.5 rounded-lg bg-stone-100 group-hover:bg-stone-200 transition-colors border border-border">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6">
                {/* Background Details */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            style={{ y: yHero, opacity: opacityHero }}
                            className="max-w-2xl"
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8"
                            >
                                <Heart size={14} className="text-rose-500 fill-rose-500" />
                                <span>Our Story</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-tight"
                            >
                                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-500">Northeast India</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-secondary leading-relaxed mb-10"
                            >
                                We are building the region's most reliable network of service professionals. Our mission is to make finding, booking, and managing trusted local services seamless, transparent, and completely stress-free.
                            </motion.p>

                             <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                            >
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-3xl font-black text-foreground mb-1">{stat.value}</span>
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                            className="relative"
                        >
                            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden border border-border shadow-2xl">
                                <Image 
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000"
                                    alt="Team Collaboration"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent"></div>
                                
                                {/* Floating Badge */}
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-8 left-8 bg-surface/80 backdrop-blur-xl border border-border p-5 rounded-3xl shadow-2xl flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                                        <Target className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground uppercase tracking-wider">Our Goal</p>
                                        <p className="text-xs text-secondary">1 Million Happy Homes</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-32 relative bg-stone-100/50 border-y border-border">
                 <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Our Core Values</h2>
                        <p className="text-lg text-secondary">The principles that guide everything we do, from writing code to serving our communities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {values.map((v, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-surface border border-border p-8 md:p-10 rounded-[2.5rem] hover:shadow-xl transition-all group"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${v.bg} flex items-center justify-center mb-8 border border-border group-hover:scale-110 transition-transform duration-500`}>
                                    <v.icon size={28} className={v.color} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">{v.title}</h3>
                                <p className="text-secondary leading-relaxed font-medium">{v.description}</p>
                            </motion.div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tight">Ready to experience the difference?</h2>
                    <p className="text-xl text-secondary mb-12">Join thousands of customers who have already simplified their lives with Sahyog-NE.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/services" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg shadow-lg">
                            Book a Service
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-stone-100 text-stone-700 font-bold rounded-2xl border border-border hover:bg-stone-200 active:scale-95 transition-all text-lg">
                            Become a Pro
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}
