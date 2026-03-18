import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Users, Briefcase, CalendarRange, TrendingUp, ArrowRight, Shield, AlertCircle, CheckCircle, Zap } from "lucide-react"

const statusConfig: Record<string, { label: string, color: string, dot: string }> = {
    PENDING: { label: "Pending", color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
    CONFIRMED: { label: "Confirmed", color: "text-blue-600 bg-blue-50 border-blue-200", dot: "bg-blue-500" },
    IN_PROGRESS: { label: "In Progress", color: "text-purple-600 bg-purple-50 border-purple-200", dot: "bg-purple-500" },
    COMPLETED: { label: "Completed", color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
    CANCELLED: { label: "Cancelled", color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-500" },
}

export default async function AdminDashboardHome() {
    const session = await auth()

    const [totalUsers, totalProviders, totalBookings, completedBookings, unverifiedProviders, recentBookings, recentUsers] = await Promise.all([
        prisma.user.count({ where: { role: "USER" } }),
        prisma.user.count({ where: { role: "PROVIDER" } }),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "COMPLETED" } }),
        prisma.providerProfile.count({ where: { verified: false } }),
        prisma.booking.findMany({
            orderBy: { createdAt: "desc" }, take: 6,
            include: {
                service: { select: { name: true } },
                user: { select: { name: true } },
                provider: { select: { businessName: true, user: { select: { name: true } } } }
            }
        }),
        prisma.user.findMany({
            where: { role: "USER" },
            orderBy: { createdAt: "desc" }, take: 5,
            select: { id: true, name: true, email: true, createdAt: true }
        })
    ])

    const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0

    const stats = [
        { label: "Total Users", value: totalUsers, icon: Users, delta: "+12% this month" },
        { label: "Providers", value: totalProviders, icon: Briefcase, delta: `${unverifiedProviders} need review` },
        { label: "Total Bookings", value: totalBookings, icon: CalendarRange, delta: "All time" },
        { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, delta: "of all bookings" },
    ]

    const adminActions = [
        { label: "Manage Users", href: "/admin/dashboard/users", icon: Users, color: "text-blue-500" },
        { label: "Verify Providers", href: "/admin/dashboard/providers", icon: CheckCircle, color: "text-emerald-500" },
        { label: "All Bookings", href: "/admin/dashboard/bookings", icon: CalendarRange, color: "text-indigo-500" },
        { label: "Platform Health", href: "/admin/dashboard", icon: Zap, color: "text-yellow-500" },
    ]

    return (
        <div className="space-y-8">

            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <Shield size={14} className="text-red-500" />
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Admin Command Center</p>
                    </div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight">Platform Overview</h1>
                    <p className="text-sm text-secondary mt-1">Monitor and manage the full NE-Connect marketplace.</p>
                </div>

                {unverifiedProviders > 0 && (
                    <Link href="/admin/dashboard/providers"
                        className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-600 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-amber-100 transition-all">
                        <AlertCircle size={16} />
                        {unverifiedProviders} Unverified
                    </Link>
                )}
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map(({ label, value, icon: Icon, delta }) => (
                    <div key={label} className="rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Icon size={18} className="text-primary" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary mb-0.5">{label}</p>
                        <div className="flex items-end gap-2">
                            <p className="text-2xl font-bold text-primary tracking-tight">{value}</p>
                            <span className="text-[11px] font-medium text-muted mb-1">{delta}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Quick admin actions ── */}
                <div className="lg:col-span-1 rounded-xl border border-border bg-surface shadow-sm p-6 flex flex-col">
                    <h2 className="text-base font-semibold text-primary mb-4">Admin Actions</h2>
                    <div className="grid grid-cols-2 gap-3 flex-grow">
                        {adminActions.map((a) => (
                            <Link key={a.label} href={a.href}
                                className="flex flex-col items-center justify-center gap-3 py-4 px-3 rounded-lg border border-border bg-background hover:border-primary transition-all group text-center">
                                <a.icon size={20} className={`${a.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-xs font-semibold text-primary">{a.label}</span>
                            </Link>
                        ))}
                    </div>

                    {unverifiedProviders > 0 && (
                        <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-700">{unverifiedProviders} providers awaiting review</p>
                                    <Link href="/admin/dashboard/providers" className="inline-block mt-1 text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors">Review now &rarr;</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Recent Bookings ── */}
                <div className="lg:col-span-2 rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                        <h2 className="text-base font-semibold text-primary">Recent Bookings</h2>
                        <Link href="/admin/dashboard/bookings" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                            View all <ArrowRight size={14} className="inline ml-1" />
                        </Link>
                    </div>
                    
                    {recentBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <CalendarRange size={20} className="text-muted" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary">No bookings yet</h3>
                            <p className="text-sm text-secondary mt-1">The marketplace has no active bookings.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentBookings.map((b) => {
                                const sc = statusConfig[b.status] || statusConfig.PENDING
                                return (
                                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <CalendarRange size={16} className="text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-primary truncate leading-none mb-1.5">{b.service.name}</p>
                                                <p className="text-xs font-medium text-secondary truncate">
                                                    <span className="text-primary">{b.user.name}</span> &rarr; {b.provider.businessName || b.provider.user.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
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

            {/* ── Recent Sign-ups ── */}
            <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                    <h2 className="text-base font-semibold text-primary">New Users</h2>
                    <Link href="/admin/dashboard/users" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                        All users <ArrowRight size={14} className="inline ml-1" />
                    </Link>
                </div>
                
                {recentUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <Users size={24} className="text-muted mb-3" />
                        <h3 className="text-sm font-semibold text-primary">No users yet</h3>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {recentUsers.map((u) => (
                            <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors gap-2">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                                        {u.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-primary leading-none mb-1.5">{u.name}</p>
                                        <p className="text-xs text-secondary">{u.email}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-secondary">
                                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
