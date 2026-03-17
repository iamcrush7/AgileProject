import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Briefcase, Star, CheckCircle, ArrowRight, Clock, Zap, Activity, MapPin } from "lucide-react"

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    PENDING: { label: "Pending", color: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20", dot: "bg-amber-500" },
    CONFIRMED: { label: "Confirmed", color: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20", dot: "bg-blue-500" },
    IN_PROGRESS: { label: "In Progress", color: "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20", dot: "bg-purple-500 animate-pulse" },
    COMPLETED: { label: "Completed", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20", dot: "bg-emerald-500" },
    CANCELLED: { label: "Cancelled", color: "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-400/10 dark:border-gray-400/20", dot: "bg-gray-500" },
}

export default async function ProviderDashboardHome() {
    const session = await auth()
    // @ts-ignore
    const userId = session?.user?.id!
    const firstName = session?.user?.name?.split(" ")[0] || "there"

    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
        include: {
            reviews: { orderBy: { createdAt: "desc" }, take: 3, include: { user: { select: { name: true } } } },
            bookings: {
                orderBy: { createdAt: "desc" },
                take: 5,
                include: { service: { select: { name: true } }, user: { select: { name: true, image: true } } }
            }
        }
    })

    const [totalBookings, pendingCount, completedCount] = await Promise.all([
        prisma.booking.count({ where: { providerId: profile?.id } }),
        prisma.booking.count({ where: { providerId: profile?.id, status: "PENDING" } }),
        prisma.booking.count({ where: { providerId: profile?.id, status: "COMPLETED" } }),
    ])

    const avgRating = profile?.reviews.length
        ? (profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length).toFixed(1)
        : "—"

    const stats = [
        { label: "Total Jobs", value: totalBookings, icon: Briefcase },
        { label: "Pending", value: pendingCount, icon: Clock },
        { label: "Completed", value: completedCount, icon: CheckCircle },
        { label: "Avg Rating", value: avgRating, icon: Star },
    ]

    const quickActions = [
        { label: "Manage Jobs", href: "/provider/dashboard/jobs", icon: Briefcase, color: "text-indigo-500" },
        { label: "My Services", href: "/provider/dashboard/services", icon: Zap, color: "text-emerald-500" },
        { label: "Reviews", href: "/provider/dashboard/reviews", icon: Star, color: "text-yellow-500" },
        { label: "Availability", href: "/provider/dashboard/availability", icon: Clock, color: "text-blue-500" },
    ]

    return (
        <div className="space-y-8">

            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <Activity size={14} className="text-primary" />
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Provider Dashboard</p>
                    </div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">
                        {profile?.businessName || firstName}
                    </h1>
                    {profile?.stateServed && (
                        <p className="flex items-center gap-1.5 text-sm text-secondary mt-1">
                            <MapPin size={14} />{profile.stateServed}
                            {profile.verified && (
                                <span className="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                    <CheckCircle size={10} /> Verified
                                </span>
                            )}
                        </p>
                    )}
                </div>
                <Link href="/provider/dashboard/jobs"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary/90">
                    <Briefcase size={16} /> View Jobs
                </Link>
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-surface p-5 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                            <Icon size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-secondary">{label}</p>
                            <p className="text-2xl font-bold text-primary mt-0.5">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Quick actions ── */}
                <div className="lg:col-span-1 border border-border bg-surface shadow-sm rounded-xl p-6">
                    <h2 className="text-base font-semibold text-primary mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((a) => (
                            <Link key={a.label} href={a.href}
                                className="flex flex-col items-center justify-center gap-3 py-4 px-3 rounded-lg border border-border bg-background hover:border-primary transition-all group text-center">
                                <a.icon size={20} className={`${a.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-xs font-semibold text-primary">{a.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Recent booking requests ── */}
                <div className="lg:col-span-2 border border-border bg-surface shadow-sm rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                        <h2 className="text-base font-semibold text-primary">Recent Requests</h2>
                        <Link href="/provider/dashboard/jobs" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                            View All <ArrowRight size={14} className="inline ml-1" />
                        </Link>
                    </div>
                    
                    {!profile?.bookings || profile.bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <Briefcase size={20} className="text-muted" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary">No bookings yet</h3>
                            <p className="text-sm text-secondary mt-1 max-w-sm">When customers book your services, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {profile.bookings.map((b) => {
                                const sc = statusConfig[b.status] || statusConfig.PENDING
                                const customerName = b.user?.name || "Customer"
                                const initials = customerName.charAt(0)

                                return (
                                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-4">
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-primary shrink-0 overflow-hidden">
                                                {b.user?.image ? (
                                                    <img src={b.user.image} alt={customerName} className="h-full w-full object-cover" />
                                                ) : (
                                                    initials
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary">{b.service.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                                                    <span className="font-medium text-primary">{customerName}</span>
                                                    <span>•</span>
                                                    <span>{new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${sc.color}`}>
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

            {/* ── Recent Reviews ── */}
            {profile?.reviews && profile.reviews.length > 0 && (
                <div className="border border-border bg-surface shadow-sm rounded-xl overflow-hidden mt-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                        <h2 className="text-base font-semibold text-primary">Latest Reviews</h2>
                        <Link href="/provider/dashboard/reviews" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                            All reviews <ArrowRight size={14} className="inline ml-1" />
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {profile.reviews.map((r) => (
                            <div key={r.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary font-semibold shrink-0">
                                    {r.user.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                        <p className="text-sm font-semibold text-primary">{r.user.name}</p>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={14} className={i < r.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-700"} />
                                            ))}
                                        </div>
                                    </div>
                                    {r.comment && <p className="text-sm text-secondary leading-relaxed">{r.comment}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}
