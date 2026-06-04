"use client"

import { useState, useEffect } from "react"
import { Loader2, MessageSquare, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface Conversation {
    user: { id: string; name: string | null; image: string | null; email: string | null }
    lastMessage: { content: string; createdAt: string; senderId: string } | null
    unreadCount: number
}

interface ConversationsListProps {
    currentUserId: string
    onSelectConversation: (user: Conversation["user"]) => void
}

export function ConversationsList({ currentUserId: _currentUserId, onSelectConversation }: ConversationsListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/messages/conversations")
                if (res.ok) {
                    const data = await res.json()
                    setConversations(data.conversations)
                } else {
                    setError("Failed to load conversations")
                }
            } catch (err) {
                console.error("Error fetching conversations:", err)
                setError("Error loading conversations")
            } finally {
                setLoading(false)
            }
        }

        fetchConversations()

        // Refresh every 3 seconds
        const interval = setInterval(fetchConversations, 3000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-indigo-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 p-4">
                <AlertCircle size={20} />
                <p className="text-sm">{error}</p>
            </div>
        )
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <MessageSquare size={40} className="mb-4 opacity-50" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Start messaging with providers or customers</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {conversations.map((conversation) => (
                <motion.button
                    key={conversation.user.id}
                    onClick={() => onSelectConversation(conversation.user)}
                    whileHover={{ scale: 1.02 }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-600"
                >
                    <div className="flex items-start gap-3">
                        {conversation.user.image && (
                            <Image
                                src={conversation.user.image}
                                alt={conversation.user.name || "User"}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                    {conversation.user.name || "Unknown"}
                                </p>
                                {conversation.unreadCount > 0 && (
                                    <span className="bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                                        {conversation.unreadCount}
                                    </span>
                                )}
                            </div>
                            {conversation.lastMessage && (
                                <p className={`text-xs mt-1 truncate ${conversation.unreadCount > 0 ? "font-semibold text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                                    {conversation.lastMessage.content}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {conversation.lastMessage && new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    )
}
