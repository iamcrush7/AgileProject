"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Copy, Check } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            const result = await signIn("credentials", { email, password, redirect: false })
            if (result?.error) {
                setError("Invalid admin credentials.")
            } else {
                router.push("/admin/dashboard")
            }
        } catch {
            setError("Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    function CopyBtn({ text }: { text: string }) {
        const [copied, setCopied] = useState(false)
        return (
            <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                className="p-1 text-gray-400 hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/5 dark:from-red-900/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Mini nav */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow">NE</div>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Connect</span>
                </Link>
                <Link href="/login" className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">← Regular login</Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 w-full max-w-sm"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500/20 items-center justify-center mb-4 shadow-sm">
                            <Shield size={32} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Portal</h1>
                        <p className="text-gray-500 dark:text-gray-500 mt-1 text-sm">Authorized access only</p>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl px-4 py-3">
                                    {error}
                                </motion.div>
                            )}

                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Admin Email"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                                />
                            </div>

                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-gray-900 dark:text-white text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-600 hover:to-orange-500 text-white font-bold rounded-xl py-3.5 flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Access Platform</span><ArrowRight size={18} /></>}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10 text-center space-y-4">
                            {process.env.NODE_ENV !== "production" && (
                                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 text-left">
                                    <p className="text-xs font-extrabold text-red-600/60 dark:text-red-400/60 uppercase tracking-wider mb-2">🧪 Dev: Admin Demo</p>
                                    <div className="flex items-center space-x-2">
                                        <code className="text-xs text-gray-500 dark:text-gray-400 flex-1">admin@ne-connect.com</code>
                                        <CopyBtn text="admin@ne-connect.com" />
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <code className="text-xs text-gray-500 dark:text-gray-400 flex-1">Admin@12345</code>
                                        <CopyBtn text="Admin@12345" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setEmail("admin@ne-connect.com"); setPassword("Admin@12345") }}
                                        className="mt-2 w-full text-xs text-red-600 dark:text-red-400 font-bold hover:text-red-500 transition-colors"
                                    >
                                        Auto-fill credentials →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
