import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CalendarRange, Zap, ArrowRight, Clock, CheckCircle, Star, MapPin, Sparkles, Plus, Search } from "lucide-react"

const quickServices = [
    { name: "Electrician", icon: Zap, slug: "electrician", color: "text-amber-800", bg: "bg-amber-100 border border-amber-200" },
    { name: "Plumber", icon: Zap, slug: "plumber", color: "text-blue-800", bg: "bg-blue-100 border border-blue-200" },
    { name: "Cleaning", icon: Sparkles, slug: "cleaning", color: "text-emerald-800", bg: "bg-emerald-100 border border-emerald-200" },
    { name: "AC Repair", icon: Zap, slug: "ac-repair", color: "text-cyan-800", bg: "bg-cyan-100 border border-cyan-200" },
]

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    PENDING: { label: "Pending", color: "text-amber-700 bg-amber-100 border-amber-200", dot: "bg-amber-600" },
    CONFIRMED: { label: "Confirmed", color: "text-blue-700 bg-blue-100 border-blue-200", dot: "bg-blue-600" },
    IN_PROGRESS: { label: "In Progress", color: "text-purple-700 bg-purple-100 border-purple-200", dot: "bg-purple-600 animate-pulse" },
    COMPLETED: { label: "Completed", color: "text-emerald-700 bg-emerald-100 border-emerald-200", dot: "bg-emerald-600" },
    CANCELLED: { label: "Cancelled", color: "text-stone-600 bg-stone-100 border-stone-200", dot: "bg-stone-500" },
}

export default async function UserDashboardHome() {
    const session = await auth()
    // @ts-ignore
    const userId = session?.user?.id!
    const firstName = session?.user?.name?.split(" ")[0] || "there"

    const [bookings, totalBookings, completedCount, pendingCount] = await Promise.all([
        prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                service: { select: { name: true, price: true } },
                provider: { select: { user: { select: { name: true, image: true } }, businessName: true, stateServed: true } },
            },
        }),
        prisma.booking.count({ where: { userId } }),
        prisma.booking.count({ where: { userId, status: "COMPLETED" } }),
        prisma.booking.count({ where: { userId, status: "PENDING" } }),
    ])

    const stats = [
        { label: "Total Bookings", value: totalBookings, icon: CalendarRange },
        { label: "Completed Jobs", value: completedCount, icon: CheckCircle },
        { label: "Pending Requests", value: pendingCount, icon: Clock },
    ]

    return (
        <div className="space-y-8">
            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-sm text-secondary mt-1">Here's what's happening with your account today.</p>
                </div>
                <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary/90"
                >
                    <Plus size={16} /> New Booking
                </Link>
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-surface p-5 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                            <Icon size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-secondary">{label}</p>
                            <p className="text-2xl font-bold text-primary mt-0.5">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Content Area ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Recent Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                            <h2 className="text-base font-semibold text-primary">Recent Bookings</h2>
                            <Link href="/user/dashboard/bookings" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                                View All
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                                    <CalendarRange size={20} className="text-secondary" />
                                </div>
                                <h3 className="text-sm font-semibold text-primary">No bookings yet</h3>
                                <p className="text-sm text-secondary mt-1 max-w-sm">When you book a service, it will appear here so you can track its status.</p>
                                <Link
                                    href="/services"
                                    className="mt-6 inline-flex items-center justify-center rounded-md bg-transparent border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-stone-50 transition-colors"
                                >
                                    Browse Services
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {bookings.map((b) => {
                                    const sc = statusConfig[b.status] || statusConfig.PENDING
                                    const providerName = b.provider.businessName || b.provider.user.name || "Provider"
                                    const initials = providerName.charAt(0)

                                    return (
                                        <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-colors gap-4">
                                            <div className="flex items-start sm:items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-stone-100 border border-border flex items-center justify-center font-semibold text-primary shrink-0 overflow-hidden">
                                                    {b.provider.user.image ? (
                                                        <img src={b.provider.user.image} alt={providerName} className="h-full w-full object-cover" />
                                                    ) : (
                                                        initials
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-primary">{b.service.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                                                        <span className="font-medium text-primary">{providerName}</span>
                                                        <span>•</span>
                                                        <span>{new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t border-border sm:border-0 pt-3 sm:pt-0">
                                                <div className="text-sm font-extrabold text-primary">₹{b.totalPrice?.toLocaleString()}</div>
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${sc.color}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                    {sc.label}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Recommendations */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-primary" />
                            <h2 className="text-base font-semibold text-primary">Recommended Services</h2>
                        </div>
                        <p className="text-sm text-secondary mb-6">Popular services booked by people in your area.</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {quickServices.map((s) => (
                                <Link
                                    key={s.slug}
                                    href={`/providers?category=${s.slug}`}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-background hover:border-primary hover:shadow-sm transition-all text-center gap-3 group"
                                >
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>
                                        <s.icon size={18} />
                                    </div>
                                    <span className="text-xs font-semibold text-primary">{s.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-background shadow-sm p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-base font-semibold text-primary mb-2">Need Help?</h3>
                            <p className="text-sm text-secondary mb-4 max-w-[200px]">Have a question or need assistance with a booking?</p>
                            <Link href="/support" className="text-sm font-semibold text-primary underline hover:text-secondary transition-colors">
                                Contact Support
                            </Link>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-stone-100 blur-2xl z-0" />
                    </div>
                </div>

            </div>
        </div>
    )
}
