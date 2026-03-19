"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { PremiumFooter } from "@/components/landing/PremiumFooter"
import { MessageSquare, Send, Loader2, CheckCircle2, ChevronRight } from "lucide-react"

export default function SupportPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    if (status === "unauthenticated") {
        router.push("/login?callbackUrl=/support")
        return null
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, description }),
            })

            if (res.ok) {
                setSuccess(true)
                setSubject("")
                setDescription("")
            } else {
                const data = await res.json()
                setError(data.error || "Failed to submit ticket")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col pt-16">
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden"
                    >
                        <div className="bg-stone-900 px-8 py-10 text-white text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">Support Ticket</h1>
                            <p className="text-stone-400 mt-2 font-medium">How can we help you today?</p>
                        </div>

                        <div className="p-8 sm:p-12">
                            {success ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6 border-2 border-green-100">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-stone-800 mb-2">Ticket Submitted!</h2>
                                    <p className="text-stone-500 mb-8 max-w-sm mx-auto">
                                        Your request has been sent to our admin team. We'll get back to you at <strong>{session?.user?.email}</strong> shortly.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="inline-flex items-center gap-2 text-stone-900 font-bold hover:gap-3 transition-all underline underline-offset-4"
                                    >
                                        Submit another ticket <ChevronRight size={18} />
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-2">Subject</label>
                                        <input
                                            required
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="What's the issue?"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 text-stone-900 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900/5 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                                        <textarea
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Tell us more about your problem..."
                                            rows={6}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 text-stone-900 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900/5 transition-all shadow-inner resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Ticket</span>
                                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            <PremiumFooter />
        </div>
    )
}
