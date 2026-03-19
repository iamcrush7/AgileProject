"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Search, CalendarCheck, Wrench, Star } from "lucide-react"
import { useRef } from "react"

const steps = [
    {
        id: "01",
        title: "Find Your Service",
        description: "Browse our comprehensive list of services or use the search bar to find exactly what you need. From plumbers and electricians to cleaners and carpenters, we have verified experts for every job.",
        icon: Search,
        color: "from-blue-400 to-indigo-500",
        shadow: "shadow-indigo-500/20",
        direction: -50
    },
    {
        id: "02",
        title: "Book an Appointment",
        description: "Select a professional based on their verified reviews, pricing, and availability. Choose a time slot that works best for your schedule and instantly book your appointment secure in the knowledge your job is confirmed.",
        icon: CalendarCheck,
        color: "from-emerald-400 to-teal-500",
        shadow: "shadow-emerald-500/20",
        direction: 50
    },
    {
        id: "03",
        title: "Get it Done",
        description: "The professional arrives at the scheduled time equipped to handle your request. Sit back and relax while your task is completed with the highest standards of quality.",
        icon: Wrench,
        color: "from-amber-400 to-orange-500",
        shadow: "shadow-orange-500/20",
        direction: -50
    },
    {
        id: "04",
        title: "Rate & Pay",
        description: "Once the job is done to your satisfaction, transparently pay for the service and leave a rating. Your feedback helps maintain the highest quality standards across the Sahyog-NE community.",
        icon: Star,
        color: "from-rose-400 to-pink-500",
        shadow: "shadow-rose-500/20",
        direction: 50
    }
]

export default function HowItWorksPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
    
    // Parallax values
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 150])

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
            <section className="relative pt-40 pb-20 px-6">
                {/* Background Details */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div 
                        style={{ y: yHero }}
                    >
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-tight"
                        >
                            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-500">Sahyog-NE</span> Works
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl md:text-2xl text-secondary leading-relaxed font-medium"
                        >
                            We've eliminated the friction of finding reliable help. <br className="hidden md:block"/>
                            From leaking pipes to full house wiring — it takes just four simple steps.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Steps Timeline */}
            <section className="py-20 px-6 relative">
                 <div className="max-w-5xl mx-auto relative z-10">
                    
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                    <div className="space-y-24">
                        {steps.map((step, i) => {
                            const isEven = i % 2 !== 0

                            return (
                                <div key={step.id} className="relative">
                                    <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}>
                                        
                                        {/* Timeline Marker (Desktop) */}
                                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-surface border border-border shadow-md items-center justify-center z-20">
                                            <span className="text-xl font-black text-foreground">{step.id}</span>
                                        </div>

                                        {/* Content Side */}
                                        <motion.div 
                                            initial={{ opacity: 0, x: step.direction }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                                            className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'}`}
                                        >
                                            <div className="bg-surface backdrop-blur-xl border border-border p-8 md:p-12 rounded-[2.5rem] hover:shadow-xl transition-all relative overflow-hidden group">
                                                {/* Mobile step number indicator */}
                                                <div className="md:hidden inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-bold text-sm mb-6 border border-border">
                                                    Step {step.id}
                                                </div>

                                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full`}></div>
                                                
                                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 shadow-lg ${step.shadow} group-hover:scale-110 transition-transform duration-500`}>
                                                    <step.icon size={28} className="text-white" />
                                                </div>
                                                
                                                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 relative z-10">{step.title}</h3>
                                                <p className="text-secondary leading-relaxed font-medium relative z-10 text-lg">{step.description}</p>
                                            </div>
                                        </motion.div>

                                        {/* Image/Visual Side */}
                                        <motion.div 
                                            initial={{ opacity: 0, x: -step.direction }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.1 }}
                                            className={`w-full md:w-1/2 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}
                                        >
                                             <div className="aspect-[4/3] rounded-[2.5rem] bg-stone-50 border border-border overflow-hidden relative group">
                                                 <div className={`absolute inset-0 bg-gradient-to-br ${step.color} mix-blend-overlay opacity-10 transition-opacity duration-500 group-hover:opacity-0 z-10`}></div>
                                                 {/* We use an abstract gradient/placeholder pattern for layout visuals */}
                                                 <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                                     <step.icon size={120} />
                                                 </div>
                                                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                                             </div>
                                        </motion.div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>

                 </div>
            </section>

            {/* CTA */}
            <section className="pt-20 pb-40 px-6">
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8">Ready to get started?</h2>
                    <Link href="/services" className="inline-flex px-10 py-5 bg-primary text-white font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all text-xl shadow-lg">
                        Browse Services
                    </Link>
                 </motion.div>
            </section>
        </div>
    )
}
