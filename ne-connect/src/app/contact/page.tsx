"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-center space-y-6 flex flex-col items-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
                    <span>Contact Us</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary">
                    Get in Touch
                </h1>
                <p className="text-xl text-secondary leading-relaxed mb-8">
                    We'd love to hear from you. Reach out to our team using the contact details below.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 w-full mt-4">
                    <div className="flex-1 bg-surface border border-border p-6 rounded-2xl flex flex-col items-center">
                        <div className="h-12 w-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Email</h3>
                        <p className="text-secondary text-sm">support@ne-connect.in</p>
                    </div>
                    <div className="flex-1 bg-surface border border-border p-6 rounded-2xl flex flex-col items-center">
                        <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <Phone size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Phone</h3>
                        <p className="text-secondary text-sm">+91 98765 43210</p>
                    </div>
                </div>

                <div className="pt-8 w-full">
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl hover:bg-white/5 transition-colors font-semibold text-primary">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
