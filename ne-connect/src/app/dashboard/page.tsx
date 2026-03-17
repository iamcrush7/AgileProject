"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react"

const MOCK_BOOKINGS = [
    { id: "B1209", provider: "Arun Das", service: "Wiring Fix", date: "Oct 24, 2026", time: "11:00 AM", status: "Upcoming", price: "₹499" },
    { id: "B1104", provider: "Rina Devi", service: "Deep Home Cleaning", date: "Sep 15, 2026", time: "09:00 AM", status: "Completed", price: "₹999" },
    { id: "B0942", provider: "Thang Lian", service: "Pipe Leakage Repair", date: "Aug 02, 2026", time: "02:00 PM", status: "Cancelled", price: "₹399" },
]

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("bookings")
    const [reviewModal, setReviewModal] = useState<string | null>(null)
    const [rating, setRating] = useState(5)

    return (
        <main className="min-h-screen pt-28 pb-24 bg-gray-50 dark:bg-black px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-white/10 gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            J
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white text-gray-900">John Doe</h1>
                            <p className="text-gray-600 dark:text-gray-400">Guwahati, Assam</p>
                        </div>
                    </div>
                    <div className="flex space-x-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                        {["bookings", "settings"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab
                                        ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === "bookings" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Your Bookings</h2>

                        {MOCK_BOOKINGS.map(booking => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                key={booking.id}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between md:justify-start md:space-x-4">
                                        <h3 className="text-lg font-bold dark:text-white text-gray-900">{booking.service}</h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === "Upcoming" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" :
                                                booking.status === "Completed" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                                                    "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center"><Calendar size={16} className="mr-1" /> {booking.date}</span>
                                        <span className="flex items-center"><Clock size={16} className="mr-1" /> {booking.time}</span>
                                        <span className="flex items-center font-medium text-gray-900 dark:text-gray-300">By {booking.provider}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10 md:border-0 md:pt-0">
                                    <p className="text-xl font-bold dark:text-white text-gray-900">{booking.price}</p>
                                    {booking.status === "Upcoming" && (
                                        <button className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                    {booking.status === "Completed" && (
                                        <button
                                            onClick={() => setReviewModal(booking.provider)}
                                            className="flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                        >
                                            <Star size={14} /> <span>Leave Review</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>

            <AnimatePresence>
                {reviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button onClick={() => setReviewModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <XCircle size={24} />
                            </button>

                            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Rate {reviewModal}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Your feedback helps others make better decisions.</p>

                            <div className="flex justify-center space-x-2 mb-8">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                                        <Star size={36} fill={star <= rating ? "#f59e0b" : "transparent"} className={star <= rating ? "text-amber-500" : "text-gray-300 dark:text-gray-600"} />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                rows={4}
                                placeholder="Share your experience..."
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 mb-6 resize-none"
                            ></textarea>

                            <button
                                onClick={() => setReviewModal(null)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-colors"
                            >
                                Submit Review
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
