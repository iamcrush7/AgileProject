"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ConversationsList } from "@/components/ConversationsList"
import { MessageThread } from "@/components/MessageThread"
import { motion, AnimatePresence } from "framer-motion"

interface InboxProps {
    hideHeader?: boolean;
}

export function Inbox({ hideHeader = false }: InboxProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string | null; image: string | null } | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [loadingPreselect, setLoadingPreselect] = useState(() => !!searchParams.get("with"))

    // Handle pre-selected conversation from query param
    useEffect(() => {
        const withUserId = searchParams.get("with")
        if (withUserId && !selectedUser) {

            fetch(`/api/providers/${withUserId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        setSelectedUser({
                            id: data.data.id,
                            name: data.data.name,
                            image: data.data.image,
                        })
                    }
                })
                .finally(() => setLoadingPreselect(false))
        }
    }, [searchParams, selectedUser])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading" || loadingPreselect) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin text-indigo-600 dark:text-indigo-400">Loading...</div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return null
    }

    return (
        <div className={`w-full ${!hideHeader ? "py-8 px-4 min-h-screen bg-gray-50 dark:bg-[#030712]" : ""}`}>
            <div className={`${!hideHeader ? "max-w-6xl mx-auto" : "w-full"}`}>
                {/* Header */}
                {!hideHeader && (
                    <div className="mb-8">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mb-4 font-semibold">
                            <ArrowLeft size={18} />
                            Back
                        </Link>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Messages</h1>
                        <p className="text-gray-600 dark:text-gray-400">Connect with customers or service providers</p>
                    </div>
                )}

                {/* Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${!isMobile && selectedUser ? "md:col-span-1" : "col-span-1"} bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 h-[600px] overflow-y-auto`}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conversations</h2>
                        {session?.user?.id && (
                            <ConversationsList
                                currentUserId={session.user.id}
                                onSelectConversation={(user) => {
                                    setSelectedUser(user)
                                }}
                            />
                        )}
                    </motion.div>

                    {/* Message Thread */}
                    <AnimatePresence>
                        {selectedUser && (
                            <motion.div
                                key="message-thread"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="col-span-1 md:col-span-2"
                            >
                                {session?.user?.id && (
                                    <MessageThread
                                        currentUserId={session.user.id}
                                        conversationWith={selectedUser}
                                        onClose={() => setSelectedUser(null)}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State */}
                    {!selectedUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-12 flex items-center justify-center text-center h-[600px]"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                                <p className="text-gray-600 dark:text-gray-400">Choose someone from the list to start messaging</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
