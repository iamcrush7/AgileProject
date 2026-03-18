"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function HelpPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-center space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
                    <span>Help Center</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary">
                    How can we help?
                </h1>
                <p className="text-xl text-secondary leading-relaxed">
                    Our comprehensive Help Center is currently under construction. If you need immediate assistance, please use our Chatbot or visit the Contact Us page.
                </p>
                <div className="pt-8">
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl hover:bg-white/5 transition-colors font-semibold text-primary">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
