"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    id: string
    content: string
    read: boolean
    createdAt: string
    sender: { id: string; name: string | null; image: string | null }
    receiver: { id: string; name: string | null; image: string | null }
}

interface MessageThreadProps {
    currentUserId: string
    conversationWith: { id: string; name: string | null; image: string | null }
    onClose?: () => void
}

export function MessageThread({ currentUserId, conversationWith, onClose }: MessageThreadProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("")
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Fetch messages on mount and set up polling
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/messages?conversationWith=${conversationWith.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setMessages(data.messages)
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchMessages()

        // Poll for new messages every 2 seconds
        const interval = setInterval(fetchMessages, 2000)
        return () => clearInterval(interval)
    }, [conversationWith.id])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || sending) return

        setSending(true)
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: conversationWith.id, content: input }),
            })

            if (res.ok) {
                const data = await res.json()
                setMessages(prev => [...prev, data.message])
                setInput("")
            }
        } catch (err) {
            console.error("Failed to send message:", err)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-screen sm:h-[600px] bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center gap-3">
                    {conversationWith.image && (
                        <Image
                            src={conversationWith.image}
                            alt={conversationWith.name || "User"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <p className="font-bold text-white text-sm">{conversationWith.name || "Unknown"}</p>
                        <p className="text-xs text-indigo-100">Active now</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-1 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-800">
                {loading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-indigo-600" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="text-sm">No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    <>
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender.id === currentUserId ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender.id === currentUserId
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600"
                                            }`}
                                    >
                                        <p className="break-words">{msg.content}</p>
                                        <p className={`text-xs mt-1 ${msg.sender.id === currentUserId ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2 disabled:opacity-60 transition"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    )
}
