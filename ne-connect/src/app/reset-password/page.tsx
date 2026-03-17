"use client"

import { useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

function ResetForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token") || ""

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")

    // Strength indicator
    const strength = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ]
    const strengthScore = strength.filter(Boolean).length
    const strengthLabel = ["Weak", "Fair", "Good", "Strong"][strengthScore - 1] || ""
    const strengthColor = ["bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strengthScore - 1] || "bg-gray-700"

    if (!token) {
        return (
            <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={28} className="text-red-500 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Invalid Link</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This password reset link is missing a token. Please request a new one.</p>
                <Link href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 transition-colors text-sm">
                    Request new link →
                </Link>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) { setErrorMsg("Passwords do not match."); setStatus("error"); return }
        if (strengthScore < 2) { setErrorMsg("Please use a stronger password (min 8 chars + uppercase + number)."); setStatus("error"); return }

        setStatus("loading")
        setErrorMsg("")
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus("success")
                setTimeout(() => router.push("/login"), 2500)
            } else {
                setErrorMsg(data.error || "Failed to reset password.")
                setStatus("error")
            }
        } catch {
            setErrorMsg("Network error. Please try again.")
            setStatus("error")
        }
    }

    if (status === "success") {
        return (
            <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Password Updated!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting you to sign in…</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">New Password</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setStatus("idle") }}
                        required
                        placeholder="Min 8 characters"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                        <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < strengthScore ? strengthColor : "bg-gray-200 dark:bg-white/10"}`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">{strengthLabel} password</p>
                    </div>
                )}
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type={showPass ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setStatus("idle") }}
                        required
                        placeholder="Re-enter password"
                        className={`w-full bg-gray-50 dark:bg-white/5 border rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white text-sm outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 ${confirm && confirm !== password ? "border-red-400 dark:border-red-500/40 focus:border-red-500" : "border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"}`}
                    />
                </div>
                {confirm && confirm !== password && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-semibold">Passwords don't match</p>
                )}
            </div>

            <button
                type="submit"
                disabled={status === "loading" || (!!confirm && password !== confirm)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-60 mt-2"
            >
                {status === "loading"
                    ? <Loader2 size={18} className="animate-spin" />
                    : <><span>Reset Password</span><ArrowRight size={18} /></>
                }
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex flex-col relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 dark:bg-purple-600/8 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/5 dark:bg-indigo-600/8 blur-[120px] pointer-events-none" />

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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Reset Password</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Enter your new password below.</p>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
                        <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-indigo-400" /></div>}>
                            <ResetForm />
                        </Suspense>

                        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10 text-center">
                            <Link href="/login" className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors font-semibold">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
