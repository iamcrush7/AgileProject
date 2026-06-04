"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Globe, ChevronDown, Loader2 } from "lucide-react"

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "as", name: "Assamese" },
    { code: "lus", name: "Mizo" },
    { code: "mni-Mtei", name: "Manipuri" },
    { code: "bn", name: "Bengali" },
    { code: "ne", name: "Nepali" }
]

const QUICK_ACTIONS = [
    "Find electrician",
    "Book plumber",
    "Become a provider",
    "Help"
]

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [lang, setLang] = useState(LANGUAGES[0])
    const [messages, setMessages] = useState<{ role: "bot" | "user", text: string }[]>([
        { role: "bot", text: "Hello! I am Sahyog-NE AI. How can I assist you today?" }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [showLangMenu, setShowLangMenu] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Session-based language memory
    useEffect(() => {
        const savedLangCode = sessionStorage.getItem("neConnectChatLang")
        if (savedLangCode) {
            const found = LANGUAGES.find(l => l.code === savedLangCode)
            if (found) setLang(found)
        }
    }, [])

    const handleLangChange = (selectedLang: typeof LANGUAGES[0]) => {
        setLang(selectedLang)
        sessionStorage.setItem("neConnectChatLang", selectedLang.code)
        setShowLangMenu(false)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const sendMessage = async (text: string) => {
        if (!text.trim()) return

        // 1. Add user message
        setMessages(prev => [...prev, { role: "user", text }])
        setInput("")
        setIsTyping(true)

        try {
            // 2. Call our Next.js API route that handles Google Cloud Translation
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, langCode: lang.code })
            })

            const data = await res.json()

            // 3. Add bot message
            setMessages(prev => [...prev, { role: "bot", text: data.reply || "Sorry, I am offline." }])

        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, { role: "bot", text: "Sorry, I couldn't process that request right now." }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all z-50 group hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white/20"
            >
                <MessageSquare size={28} className="group-hover:animate-bounce" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[580px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 p-4 flex items-center justify-between text-white relative z-20">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">Sahyog-NE AI</h3>
                                    <div className="flex items-center text-xs text-emerald-100 font-medium mt-0.5">
                                        <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse mr-1.5"></span>
                                        Online (Fast Translate)
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Language Selector Dropdown */}
                        <div className="bg-gray-50 dark:bg-black/40 border-b border-gray-200 dark:border-white/10 px-4 py-2 relative z-10 flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Chat Language:</span>
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangMenu(!showLangMenu)}
                                    className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                                >
                                    <Globe size={14} className="text-indigo-500" />
                                    <span>{lang.name}</span>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showLangMenu ? "rotatae-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {showLangMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-2 z-50 max-h-48 overflow-y-auto custom-scrollbar"
                                        >
                                            {LANGUAGES.map(l => (
                                                <button
                                                    key={l.code}
                                                    onClick={() => handleLangChange(l)}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang.code === l.code ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                                                >
                                                    {l.name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-slate-50 dark:bg-[#0a0f1a] custom-scrollbar relative z-0">
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={i}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${m.role === "user"
                                        ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm shadow-lg shadow-indigo-600/20"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-bl-sm shadow-md"
                                        }`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm shadow-md flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions (only show if no messages or just 1 welcome message and not typing) */}
                        {!isTyping && messages.length <= 2 && (
                            <div className="px-4 pb-2 bg-slate-50 dark:bg-[#0a0f1a]">
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_ACTIONS.map(action => (
                                        <button
                                            key={action}
                                            onClick={() => sendMessage(action)}
                                            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors shadow-sm"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 relative z-20">
                            <div className="flex items-center bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-full px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-inner">
                                <input
                                    type="text"
                                    placeholder={`Type in ${lang.name}...`}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && !isTyping && sendMessage(input)}
                                    disabled={isTyping}
                                    className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white px-3 py-2 disabled:opacity-50"
                                />
                                <button
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || isTyping}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md"
                                >
                                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
