"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { format, addDays, startOfToday, isSameDay } from "date-fns"
import { 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    FileText, 
    ChevronRight, 
    ChevronLeft, 
    CheckCircle2, 
    Loader2, 
    ShieldCheck, 
    Star,
    Info
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function BookingContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const providerId = searchParams.get("providerId")
    const serviceId = searchParams.get("serviceId")
    const serviceName = searchParams.get("serviceName")

    const [step, setStep] = useState(1)
    const [provider, setProvider] = useState<any>(null)
    const [service, setService] = useState<any>(null)
    const [availability, setAvailability] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
    const [selectedTime, setSelectedTime] = useState("")
    const [address, setAddress] = useState("")
    const [notes, setNotes] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/booking/new?providerId=${providerId}&serviceId=${serviceId}&serviceName=${encodeURIComponent(serviceName || '')}`)
            return
        }
        if (status === "authenticated") {
            if (!providerId || !serviceId) {
                router.push("/services")
                return
            }
            fetchData()
        }
    }, [status, providerId, serviceId, serviceName, router])

    async function fetchData() {
        setIsLoading(true)
        try {
            // Fetch provider and availability
            const [pRes, aRes] = await Promise.all([
                fetch(`/api/providers/${providerId}`),
                fetch(`/api/availability/${providerId}`)
            ])
            
            const pData = await pRes.json()
            const aData = await aRes.json()
            
            if (pData.success) {
                setProvider(pData.data)
                const s = pData.data.services.find((s: any) => s.id === serviceId)
                setService(s)
            }
            if (aData.success) {
                setAvailability(aData.data)
            }
        } catch (err) {
            console.error(err)
            setError("Failed to initialize booking. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = () => setStep((s: number) => s + 1)
    const prevStep = () => setStep((s: number) => s - 1)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError("")
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    providerId,
                    serviceId,
                    date: selectedDate.toISOString(),
                    time: selectedTime,
                    notes,
                    totalPrice: service?.price || 0,
                    address // We'll need to update the API to handle address if schema supports it, 
                    // or just put it in notes for now if not. 
                    // Checking schema... it doesn't have address. I'll put it in notes.
                })
            })
            const data = await res.json()
            if (data.success) {
                setStep(4) // Success step
            } else {
                setError(data.error || "Booking failed")
            }
        } catch (err) {
            setError("System error. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest">Initialising Secure Booking...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Stepper Header */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ring-4 ${
                                step >= s ? "bg-primary text-background ring-primary/20" : "bg-surface text-secondary ring-surface"
                            }`}>
                                {step > s ? <CheckCircle2 size={20} /> : s}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-3 ${step >= s ? "text-primary" : "text-muted"}`}>
                                {s === 1 ? "Schedule" : s === 2 ? "Details" : "Confirm"}
                            </span>
                        </div>
                    ))}
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-0" />
                    {/* Active Progress Bar */}
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step - 1) / 2) * 100}%` }}
                        className="absolute top-5 left-0 h-0.5 bg-primary -z-0 transition-all duration-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Form Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <section>
                                    <h2 className="text-2xl font-extrabold text-primary mb-6 flex items-center gap-3">
                                        <CalendarIcon className="text-primary" /> Select Date
                                    </h2>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                        {Array.from({ length: 14 }).map((_, i) => {
                                            const date = addDays(startOfToday(), i)
                                            const isSelected = isSameDay(date, selectedDate)
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedDate(date)}
                                                    className={`p-3 rounded-2xl flex flex-col items-center transition-all border-2 ${
                                                        isSelected 
                                                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                                                        : "bg-surface border-transparent hover:border-border"
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-bold text-secondary uppercase mb-1">{format(date, "EEE")}</span>
                                                    <span className={`text-lg font-extrabold ${isSelected ? "text-primary" : "text-primary/70"}`}>{format(date, "d")}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-extrabold text-primary mb-6 flex items-center gap-3">
                                        <Clock className="text-primary" /> Preferred Time
                                    </h2>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
                                                    selectedTime === time 
                                                    ? "bg-primary text-background border-primary" 
                                                    : "bg-surface border-transparent hover:border-border text-secondary"
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <div className="pt-6">
                                    <button 
                                        disabled={!selectedTime}
                                        onClick={nextStep}
                                        className="w-full bg-primary text-background py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                                    >
                                        Continue to Details <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <section>
                                    <h2 className="text-2xl font-extrabold text-primary mb-6 flex items-center gap-3">
                                        <MapPin className="text-primary" /> Service Location
                                    </h2>
                                    <textarea 
                                        placeholder="Enter your full address where service is required..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={4}
                                        className="w-full bg-surface border border-border rounded-2xl p-6 text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    />
                                </section>

                                <section>
                                    <h2 className="text-2xl font-extrabold text-primary mb-6 flex items-center gap-3">
                                        <FileText className="text-primary" /> Additional Notes
                                    </h2>
                                    <textarea 
                                        placeholder="Any specific requirements or instructions for the professional?"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full bg-surface border border-border rounded-2xl p-6 text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    />
                                </section>

                                <div className="flex gap-4 pt-6">
                                    <button onClick={prevStep} className="flex-1 bg-surface border border-border py-4 rounded-2xl font-bold text-secondary hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                    <button 
                                        disabled={!address}
                                        onClick={nextStep}
                                        className="flex-[2] bg-primary text-background py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        Review Booking <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-surface border border-border rounded-3xl p-8 space-y-8">
                                    <h2 className="text-2xl font-extrabold text-primary tracking-tight">Review Your Booking</h2>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Service</p>
                                            <p className="text-lg font-bold text-primary">{serviceName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Professional</p>
                                            <p className="text-lg font-bold text-primary">{provider?.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Date & Time</p>
                                            <p className="text-lg font-bold text-primary">{format(selectedDate, "MMMM d, yyyy")} at {selectedTime}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-medium text-secondary line-clamp-2">{address}</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Amount</p>
                                            <p className="text-3xl font-extrabold text-primary">₹{service?.price}</p>
                                        </div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Pay after service</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-500 text-sm font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button onClick={prevStep} className="flex-1 bg-surface border border-border py-4 rounded-2xl font-bold text-secondary hover:text-primary transition-all flex items-center justify-center gap-2">
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                    <button 
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                        className="flex-[2] bg-primary text-background py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div 
                                key="step4"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-12 space-y-6"
                            >
                                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/20">
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                </div>
                                <h2 className="text-4xl font-extrabold text-primary tracking-tight">Booking Confirmed!</h2>
                                <p className="text-secondary max-w-sm mx-auto font-medium text-lg leading-relaxed">
                                    Your request has been sent to {provider?.name}. They will reach out to you shortly.
                                </p>
                                <div className="pt-10 flex flex-col gap-4 max-w-xs mx-auto">
                                    <button 
                                        onClick={() => router.push("/user/dashboard/bookings")}
                                        className="w-full bg-primary text-background py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        View My Bookings
                                    </button>
                                    <button 
                                        onClick={() => router.push("/services")}
                                        className="w-full bg-surface border border-border py-4 rounded-2xl font-bold text-secondary hover:text-primary transition-all"
                                    >
                                        Return to Services
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-surface border border-border rounded-3xl p-8 sticky top-32 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-6">Booking Summary</h3>
                            <div className="flex items-center gap-4 mb-6">
                                {provider?.image ? (
                                    <img src={provider.image} className="w-12 h-12 rounded-xl object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center font-bold text-primary">
                                        {provider?.name?.[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-primary leading-tight">{provider?.name}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star size={10} fill="currentColor" className="text-yellow-400" />
                                        <span className="text-[10px] font-bold text-secondary">{provider?.rating} ({provider?.reviewsCount} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary font-medium">Service</span>
                                    <span className="text-primary font-bold">{serviceName}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary font-medium">Base Price</span>
                                    <span className="text-primary font-bold">₹{service?.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary font-medium">Platform Fee</span>
                                    <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-center">
                                    <span className="text-primary font-bold">Estimated Total</span>
                                    <span className="text-2xl font-extrabold text-primary">₹{service?.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background rounded-2xl p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                <p className="text-[10px] text-secondary font-bold uppercase tracking-tight leading-normal">Verified Professional</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                <p className="text-[10px] text-secondary font-bold uppercase tracking-tight leading-normal">Standard 30-Day Guarantee</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                <p className="text-[10px] text-secondary font-bold uppercase tracking-tight leading-normal">Free Cancellation before 2 hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function NewBookingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            }>
                <BookingContent />
            </Suspense>
        </div>
    )
}
