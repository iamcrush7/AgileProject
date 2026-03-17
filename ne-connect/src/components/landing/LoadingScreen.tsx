"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate asset loading and R3F initial load time for a cinematic start
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2800)

        return () => clearTimeout(timer)
    }, [])

    // Lock body scroll while loading
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isLoading])

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // smooth cinematic ease
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#030712]"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="flex flex-col items-center gap-10"
                        >
                            {/* Logo / Brand */}
                            <div className="flex flex-col items-center">
                                <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.25em] text-black dark:text-white mb-2">
                                    NE<span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500">-</span>CONNECT
                                </h1>
                                <p className="text-sm tracking-[0.4em] text-gray-500 dark:text-gray-400 uppercase font-light">
                                    Immersive Experience
                                </p>
                            </div>

                            {/* Loading Bar */}
                            <div className="w-64 h-[1px] bg-black/10 dark:bg-white/10 relative overflow-hidden rounded-full">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 2.5, ease: [0.76, 0, 0.24, 1] }}
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                                />
                            </div>
                        </motion.div>

                        {/* Subtle background particles for the loading screen itself */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden blur-3xl opacity-30 mix-blend-screen">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/50 rounded-full"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    rotate: [0, -90, 0]
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/50 rounded-full"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {children}
        </>
    )
}
