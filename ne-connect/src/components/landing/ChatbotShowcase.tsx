"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { MessageCircle, Globe2, Sparkles, Send } from "lucide-react"

const LANGUAGES = ["English", "Hindi", "Assamese", "Mizo", "Manipuri", "Khasi", "Garo", "Nagamese", "Bengali", "Nepali"]

const DEMO_CHAT = [
    { text: "I need a plumber quickly in Guwahati.", sender: "user", lang: "English" },
    { text: "মই আপোনাক সহায় কৰিব পাৰো। মই এতিযা গুৱাহাটীত উপলব্ধ শ্ৰেষ্ঠ প্লাম্বাৰসকলক বিচাৰি আছো...", sender: "bot", lang: "Assamese" },
    { text: "Book one for tomorrow morning please.", sender: "user", lang: "English" },
    { text: "Done! I have booked Arun Das for 10:00 AM tomorrow.", sender: "bot", lang: "English", isAction: true }
]

export function ChatbotShowcase() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50])
    const rotateX = useTransform(scrollYProgress, [0, 1], [10, -5])
    const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 5])

    const [step, setStep] = useState(0)

    useEffect(() => {
        if (!isInView) return

        let i = 0
        const interval = setInterval(() => {
            if (i < DEMO_CHAT.length) {
                setStep(i + 1)
                i++
            } else {
                clearInterval(interval)
            }
        }, 2000) // Reveal new message every 2 seconds

        return () => clearInterval(interval)
    }, [isInView])

    return (
        <section ref={containerRef} className="py-32 bg-surface relative overflow-hidden hidden-scrollbar z-10 border-t border-border">
            {/* Background Gradients (Luxe Stone Theme) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-stone-200/20 rounded-full blur-[120px] pointer-events-none opacity-50 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Typography */}
                    <div className="lg:w-1/2 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-stone-100 text-stone-700 font-bold text-sm mb-6 border border-border shadow-sm"
                        >
                            <Sparkles size={16} />
                            <span>AI-Powered Assistance</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-[1.1]"
                        >
                            Speak your <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-stone-500">native language.</span> We'll understand.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-secondary mb-10 leading-relaxed text-balance font-medium"
                        >
                            Our intelligent marketplace chatbot breaks down communication barriers, supporting seamless, real-time translations across 10 northeast regional languages.
                        </motion.p>

                        {/* Language Pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="flex flex-wrap gap-2"
                        >
                            <div className="flex items-center mr-2 text-sm font-bold text-stone-500">
                                <Globe2 size={16} className="mr-2" />
                            </div>
                            {LANGUAGES.map((lang, idx) => (
                                <span key={lang} className="px-3 py-1 bg-white border border-border rounded-full text-xs font-bold text-secondary shadow-sm hover:shadow-md hover:border-stone-200 hover:text-foreground transition-all cursor-default">
                                    {lang}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Interactive Chat Mockup */}
                    <div className="lg:w-1/2 w-full perspective-[2000px]">
                        <motion.div
                            style={{
                                y: yParallax,
                                rotateX: rotateX,
                                rotateY: rotateY,
                                transformStyle: "preserve-3d"
                            }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="bg-white/80 backdrop-blur-2xl border border-border rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                        >
                            {/* Inner Bezel highlight */}
                            <div className="absolute inset-0 border border-white rounded-[2.5rem] pointer-events-none z-50"></div>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-50 z-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 via-transparent to-transparent pointer-events-none"></div>

                            {/* Chat Header */}
                            <div className="bg-white/50 border-b border-border p-4 flex items-center justify-between backdrop-blur-md">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-stone-700 to-stone-900 rounded-full flex items-center justify-center shadow-md border border-white">
                                        <MessageCircle size={20} className="text-white fill-white/20" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground text-sm">NE-Connect AI</h4>
                                        <div className="flex items-center space-x-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span className="text-xs text-emerald-600 font-bold tracking-wide">Ready to help</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="p-6 h-[400px] overflow-y-auto flex flex-col space-y-6 hidden-scrollbar bg-stone-50/30">
                                {DEMO_CHAT.slice(0, step).map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                    >
                                        <span className="text-[10px] text-stone-400 mb-1 ml-2 uppercase font-bold tracking-wider">{msg.lang}</span>
                                        {msg.isAction ? (
                                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Sparkles size={14} className="text-emerald-500" />
                                                    <span className="font-black text-sm">Booking Confirmed</span>
                                                </div>
                                                <p className="text-[15px] font-medium">{msg.text}</p>
                                            </div>
                                        ) : (
                                            <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${msg.sender === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-white text-foreground rounded-tl-sm border border-border"}`}>
                                                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Typing Indicator */}
                                {step > 0 && step % 2 !== 0 && step < DEMO_CHAT.length && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-start"
                                    >
                                        <div className="bg-white border border-border rounded-2xl rounded-tl-sm p-4 w-16 h-12 flex justify-center items-center space-x-1 shadow-sm">
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-stone-200 rounded-full"></motion.div>
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-stone-200 rounded-full"></motion.div>
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-stone-200 rounded-full"></motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Chat Input Mock */}
                            <div className="p-4 bg-white/80 border-t border-border backdrop-blur-md">
                                <div className="bg-stone-50/50 border border-border rounded-xl flex items-center p-2">
                                    <input disabled type="text" placeholder="Type a message..." className="bg-transparent border-none outline-none text-secondary text-sm font-medium w-full px-2 placeholder-stone-400" />
                                    <button disabled className="bg-primary p-2 rounded-lg text-white opacity-50"><Send size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
