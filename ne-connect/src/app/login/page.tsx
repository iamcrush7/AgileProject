"use client"

import { Suspense, useState } from "react"
import { Mail, Lock, User, Briefcase, Shield, Eye, EyeOff, ArrowRight, Check, Copy } from "lucide-react"
import { signIn, getSession } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

type UserRole = "user" | "provider"

// Demo credentials removed

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [role, setRole] = useState<UserRole>("user")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // fillDemo removed

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            const result = await signIn("credentials", { email, password, redirect: false })
            if (result?.error) {
                setError("Invalid email or password. Please try again.")
            } else {
                const callbackUrl = searchParams.get("callbackUrl")
                if (callbackUrl) {
                    router.push(callbackUrl)
                } else {
                    const session = await getSession()
                    const userRole = (session?.user as any)?.role
                    if (userRole === "ADMIN") {
                        router.push("/admin/dashboard")
                    } else if (userRole === "PROVIDER") {
                        router.push("/provider/dashboard")
                    } else {
                        router.push("/user/dashboard")
                    }
                }
            }
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 mb-8 mt-8 sm:mt-0">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-background font-bold text-sm">NE</div>
                <span className="text-xl font-bold text-primary tracking-tight">Connect</span>
            </Link>

            <div className="w-full max-w-md">
                {/* Page heading */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Welcome back</h1>
                    <p className="text-secondary mt-1 text-sm">Sign in to your account</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-surface border border-border rounded-lg p-1 mb-6">
                    {(["user", "provider"] as const).map((r) => (
                        <button key={r} onClick={() => setRole(r)} className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-medium transition-all ${role === r ? "bg-background text-primary shadow-sm border border-border" : "text-secondary hover:text-primary"}`}>
                            {r === "user" ? <User size={16} /> : <Briefcase size={16} />}
                            <span className="capitalize">{r === "user" ? "Customer" : "Provider"}</span>
                        </button>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-md px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-primary mb-1.5 block">Email address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                                    className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium text-primary">Password</label>
                                <Link href="/forgot-password" className="text-xs text-secondary hover:text-primary transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                                <input id="login-password" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                                    className="w-full bg-background border border-border rounded-md pl-10 pr-10 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" id="login-submit" disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-background font-medium rounded-md py-2.5 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                            {isLoading ? <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
                        <p className="text-secondary text-sm">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-primary font-medium hover:underline transition-colors">Create one free</Link>
                        </p>
                        {/* Admin Link Removed */}
                    </div>
                </div>

                {/* Demo Credentials Panel Removed */}
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
