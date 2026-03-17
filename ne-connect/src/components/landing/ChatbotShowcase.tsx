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
        <section ref={containerRef} className="py-32 bg-[#0a0f1a] relative overflow-hidden">
            {/* Background Map Graphic or Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Typography */}
                    <div className="lg:w-1/2 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-sm mb-6 border border-indigo-500/20"
                        >
                            <Sparkles size={16} />
                            <span>AI-Powered Assistance</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
                        >
                            Speak your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">native language.</span> We'll understand.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed text-balance"
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
                            <div className="flex items-center mr-2 text-sm font-medium text-gray-500">
                                <Globe2 size={16} className="mr-2" />
                            </div>
                            {LANGUAGES.map((lang, idx) => (
                                <span key={lang} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">
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
                            className="bg-black/80 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] relative"
                        >
                            {/* Inner Bezel highlight */}
                            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none z-50"></div>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50 z-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

                            {/* Chat Header */}
                            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-md">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <MessageCircle size={20} className="text-white fill-white/20" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">NE-Connect AI</h4>
                                        <div className="flex items-center space-x-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span className="text-xs text-emerald-400 font-medium tracking-wide">Ready to help</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="p-6 h-[400px] overflow-y-auto flex flex-col space-y-6 hidden-scrollbar bg-black/40">
                                {DEMO_CHAT.slice(0, step).map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                    >
                                        <span className="text-[10px] text-gray-500 mb-1 ml-2 uppercase font-semibold tracking-wider">{msg.lang}</span>
                                        {msg.isAction ? (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 p-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Sparkles size={14} className="text-emerald-400" />
                                                    <span className="font-bold text-sm">Booking Confirmed</span>
                                                </div>
                                                <p className="text-[15px]">{msg.text}</p>
                                            </div>
                                        ) : (
                                            <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white/10 text-gray-200 rounded-tl-sm border border-white/5"}`}>
                                                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Typing Indicator (shows when waiting for bot) */}
                                {step > 0 && step % 2 !== 0 && step < DEMO_CHAT.length && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-start"
                                    >
                                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-4 w-16 h-12 flex justify-center items-center space-x-1">
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full"></motion.div>
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full"></motion.div>
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full"></motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Chat Input Mock */}
                            <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
                                <div className="bg-black/50 border border-white/10 rounded-xl flex items-center p-2">
                                    <input disabled type="text" placeholder="Type a message..." className="bg-transparent border-none outline-none text-white text-sm w-full px-2" />
                                    <button disabled className="bg-indigo-600 p-2 rounded-lg text-white opacity-50"><Send size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
