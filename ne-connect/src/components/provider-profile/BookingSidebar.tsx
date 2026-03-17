"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Zap, ShieldCheck } from "lucide-react"

export function BookingSidebar({ provider }: { provider?: any }) {
    const [selectedDate, setSelectedDate] = useState<number>(14)
    const [selectedTime, setSelectedTime] = useState<string>("10:00 AM")
    const [isBooking, setIsBooking] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    if (!provider) return null;

    // Mock Calendar Dates
    const dates = [
        { day: 'Mon', num: 12, available: false },
        { day: 'Tue', num: 13, available: true },
        { day: 'Wed', num: 14, available: true },
        { day: 'Thu', num: 15, available: true },
        { day: 'Fri', num: 16, available: false },
        { day: 'Sat', num: 17, available: true },
        { day: 'Sun', num: 18, available: true },
    ]

    const times = ["09:00 AM", "10:00 AM", "12:30 PM", "02:00 PM", "04:30 PM"]

    const handleBook = async () => {
        setIsBooking(true)
        setErrorMsg("")
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    providerId: provider.id,
                    serviceId: provider.services?.[0]?.id || null, // default to first service
                    date: new Date().toISOString(), // use real date logic later
                    time: selectedTime,
                    totalPrice: provider.startingPrice || 0,
                    notes: "Booking requested from profile page"
                })
            })

            const json = await res.json()
            if (json.success) {
                setBookingSuccess(true)
            } else {
                if (res.status === 401) {
                    setErrorMsg("Please sign in to book a service.")
                } else {
                    setErrorMsg(json.error || "Failed to book.")
                }
            }
        } catch (error) {
            setErrorMsg("An unexpected error occurred.")
        } finally {
            setIsBooking(false)
        }
    }

    return (
        <div className="sticky top-24">
            <div className="bg-white dark:bg-[#0f172a]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 lg:p-8 shadow-2xl hover:border-indigo-500/30 transition-colors">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Starting Price</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{provider.startingPrice}<span className="text-sm font-medium text-gray-500 ml-1">/ task</span></h3>
                    </div>
                </div>

                {/* Calendar Picker */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                            <CalendarIcon size={18} className="text-indigo-500 mr-2" />
                            Select Date
                        </h4>
                        <div className="flex space-x-2">
                            <button className="w-8 h-8 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        {dates.map((d, i) => (
                            <button
                                key={i}
                                disabled={!d.available}
                                onClick={() => setSelectedDate(d.num)}
                                className={`flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-all ${!d.available ? 'opacity-30 cursor-not-allowed text-gray-400' :
                                    selectedDate === d.num
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                <span className={`text-[10px] font-bold uppercase ${selectedDate === d.num ? 'text-indigo-100' : 'text-gray-400'}`}>{d.day}</span>
                                <span className="text-lg font-bold mt-1">{d.num}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Picker */}
                <div className="mb-8">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center mb-4">
                        <Clock size={18} className="text-indigo-500 mr-2" />
                        Available Slots
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {times.map((t) => (
                            <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedTime === t
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                                    : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secure Trust Badge */}
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-6 flex items-start space-x-3">
                    <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">NE-Connect Guarantee</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-500/80 font-medium">Payment is held securely until the service is completed to your satisfaction.</p>
                    </div>
                </div>

                {/* Errors */}
                {errorMsg && (
                    <div className="mb-4 text-center text-sm font-semibold text-red-500">{errorMsg}</div>
                )}

                {bookingSuccess ? (
                    <div className="w-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 py-5 rounded-2xl font-bold text-base text-center shadow-lg">
                        ✅ Your booking request has been successfully sent!
                    </div>
                ) : (
                    /* Animated Booking Button */
                    <button
                        onClick={handleBook}
                        disabled={isBooking}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-5 rounded-2xl font-extrabold text-lg shadow-xl hover:shadow-indigo-500/25 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <AnimatePresence mode="wait">
                            {isBooking ? (
                                <motion.div
                                    key="booking"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex items-center justify-center space-x-2"
                                >
                                    <Zap size={20} className="animate-pulse" />
                                    <span>Confirming...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    Book Now
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Button Glare Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer pointer-events-none"></div>
                    </button>
                )}
            </div>
        </div>
    )
}
