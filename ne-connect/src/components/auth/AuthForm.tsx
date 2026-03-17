"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Phone, User, Briefcase, Chrome } from "lucide-react"

type AuthMode = "login" | "signup" | "phone"
type UserType = "user" | "provider"

export function AuthForm({ defaultMode = "login", isAdmin = false }: { defaultMode?: AuthMode, isAdmin?: boolean }) {
    const [mode, setMode] = useState<AuthMode>(defaultMode)
    const [userType, setUserType] = useState<UserType>(isAdmin ? "admin" as any : "user")

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
        >
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <motion.h2
                        key={mode}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500 dark:from-indigo-400 dark:to-emerald-300"
                    >
                        {isAdmin ? "Admin Portal" : (mode === "login" ? "Welcome Back" : mode === "signup" ? "Join NE-Connect" : "Phone Login")}
                    </motion.h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isAdmin ? "Secure platform management access" : (userType === "user" ? "Find the best local professionals" : "Grow your service business today")}
                    </p>
                </div>

                {/* User Type Toggle */}
                {!isAdmin && (
                    <div className="flex bg-gray-100 dark:bg-white/5 rounded-full p-1 mb-6">
                        {(["user", "provider"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setUserType(type)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full text-sm font-medium transition-all ${userType === type
                                    ? "bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                {type === "user" ? <User size={16} /> : <Briefcase size={16} />}
                                <span className="capitalize">{type}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Auth Body */}
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {mode === "phone" ? (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (+91)"
                                        className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                                    />
                                </div>
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 transition-colors shadow-lg shadow-indigo-500/30">
                                    Send OTP
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                                    />
                                </div>

                                <button className="w-full bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold rounded-xl py-3 transition-all shadow-lg shadow-indigo-500/30">
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
                    <span className="px-4 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">or continue with</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
                </div>

                {/* Social / Alternatives */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center space-x-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl py-2.5 transition-colors dark:text-white text-sm font-medium">
                        <Chrome size={18} className="text-red-500" />
                        <span>Google</span>
                    </button>

                    <button
                        onClick={() => setMode(mode === "phone" ? "login" : "phone")}
                        className="flex items-center justify-center space-x-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl py-2.5 transition-colors dark:text-white text-sm font-medium"
                    >
                        {mode === "phone" ? <Mail size={18} /> : <Phone size={18} />}
                        <span>{mode === "phone" ? "Email" : "Phone OTP"}</span>
                    </button>
                </div>

                {/* Toggle Mode Footer */}
                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    {mode === "login" || mode === "phone" ? (
                        <p>
                            Don't have an account?{" "}
                            <button onClick={() => setMode("signup")} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                Sign up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button onClick={() => setMode("login")} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                Sign in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
