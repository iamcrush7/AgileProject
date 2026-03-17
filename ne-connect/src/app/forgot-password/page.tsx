"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus("loading")
        setErrorMsg("")
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setStatus("sent")
            } else {
                const d = await res.json()
                setErrorMsg(d.error || "Something went wrong.")
                setStatus("error")
            }
        } catch {
            setErrorMsg("Network error. Please try again.")
            setStatus("error")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex flex-col relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 dark:bg-indigo-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 dark:bg-purple-600/8 blur-[120px] pointer-events-none" />

            {/* Mini nav */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow">NE</div>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Connect</span>
                </Link>
                <Link href="/login" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">← Back to login</Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Page heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Forgot Password?</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">No worries — we'll send you a reset link.</p>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
                        <AnimatePresence mode="wait">
                            {status === "sent" ? (
                                <motion.div
                                    key="sent"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
                                        <CheckCircle size={32} className="text-emerald-500 dark:text-emerald-400" />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Check your email</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                        If <span className="text-gray-900 dark:text-white font-semibold">{email}</span> is registered, you'll receive a reset link shortly.
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-600">Didn't receive it? Check spam or try again in a few minutes.</p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <AnimatePresence>
                                        {status === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl px-4 py-3"
                                            >
                                                {errorMsg}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Email Address</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="you@example.com"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-60"
                                    >
                                        {status === "loading"
                                            ? <Loader2 size={18} className="animate-spin" />
                                            : <><span>Send Reset Link</span><ArrowRight size={18} /></>
                                        }
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10 text-center">
                            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors font-semibold">
                                <ArrowLeft size={15} /> Back to Sign In
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
