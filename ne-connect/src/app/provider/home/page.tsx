import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import Link from "next/link"
import {
    Briefcase, Star, DollarSign, Clock, ArrowRight,
    PlusCircle, Settings, BarChart2, CheckCircle2, Zap
} from "lucide-react"

export default async function ProviderHomePage() {
    const session = await auth()
    if (!session?.user) redirect("/login")
    // @ts-ignore
    if (session.user.role !== "PROVIDER") redirect("/")

    const userId = (session.user as any).id

    // Redirect unverified providers to pending page
    const providerCheck = await prisma.providerProfile.findUnique({
        where: { userId },
        select: { verified: true }
    })
    if (!providerCheck || !providerCheck.verified) {
        redirect("/provider/pending")
    }

    // Fetch provider profile + stats
    const provider = await prisma.providerProfile.findUnique({
        where: { userId },
        include: {
            bookings: { orderBy: { createdAt: "desc" }, take: 5 },
            services: true,
            reviews: true,
        },
    })

    const totalJobs = provider?.bookings?.length ?? 0
    const pendingJobs = provider?.bookings?.filter(b => b.status === "PENDING").length ?? 0
    const completedJobs = provider?.bookings?.filter(b => b.status === "COMPLETED").length ?? 0
    const totalEarnings = provider?.bookings
        ?.filter(b => b.status === "COMPLETED")
        .reduce((sum, b) => sum + b.totalPrice, 0) ?? 0
    const avgRating = provider?.reviews?.length
        ? (provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length).toFixed(1)
        : "N/A"

    const providerName = (session.user as any).name || "Provider"
    const firstName = providerName.split(" ")[0]

    const stats = [
        { label: "Total Jobs", value: totalJobs, icon: Briefcase, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
        { label: "Pending", value: pendingJobs, icon: Clock, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
        { label: "Completed", value: completedJobs, icon: CheckCircle2, color: "bg-green-50 text-green-600", border: "border-green-100" },
        { label: "Avg Rating", value: avgRating, icon: Star, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
        { label: "Earnings", value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
        { label: "Services", value: provider?.services?.length ?? 0, icon: Zap, color: "bg-rose-50 text-rose-600", border: "border-rose-100" },
    ]

    const quickActions = [
        { label: "View All Jobs", href: "/provider/dashboard/jobs", icon: Briefcase, desc: "Manage your incoming bookings" },
        { label: "My Services", href: "/provider/dashboard/services", icon: Zap, desc: "Add or edit your service listings" },
        { label: "Reviews", href: "/provider/dashboard/reviews", icon: Star, desc: "See what clients say about you" },
        { label: "Edit Profile", href: "/provider/dashboard/profile", icon: Settings, desc: "Update your info and availability" },
    ]

    return (
        // @ts-ignore
        <DashboardLayout role="PROVIDER" user={session.user}>
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">

                {/* Welcome Banner */}
                <div className="mb-10 rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                    />
                    <p className="text-stone-300 text-sm font-semibold uppercase tracking-widest mb-2">Welcome back</p>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
                        Hey, {firstName}! 👋
                    </h1>
                    <p className="text-stone-300 text-lg max-w-lg">
                        Here's a snapshot of how your business is doing on Sahyog-NE today.
                    </p>

                    {pendingJobs > 0 && (
                        <Link
                            href="/provider/dashboard/jobs"
                            className="mt-6 inline-flex items-center gap-2 bg-white text-stone-800 font-bold px-5 py-2.5 rounded-xl hover:bg-stone-100 transition-colors text-sm shadow"
                        >
                            <Clock size={16} />
                            {pendingJobs} pending job{pendingJobs > 1 ? "s" : ""} waiting
                            <ArrowRight size={16} />
                        </Link>
                    )}
                </div>

                {/* Stats Grid */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Your Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} p-5 flex flex-col gap-3 shadow-sm`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 hover:border-stone-400 hover:shadow-md transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-stone-800 group-hover:text-white transition-colors">
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 group-hover:text-stone-900">{action.label}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{action.desc}</p>
                                </div>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-stone-700 group-hover:translate-x-1 transition-all mt-auto" />
                            </Link>
                        )
                    })}
                </div>

                {/* Recent Bookings */}
                {provider?.bookings && provider.bookings.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-700">Recent Bookings</h2>
                            <Link href="/provider/dashboard/jobs" className="text-sm text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1">
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {provider.bookings.map((booking) => {
                                        const statusColors: Record<string, string> = {
                                            PENDING: "bg-amber-100 text-amber-700",
                                            CONFIRMED: "bg-blue-100 text-blue-700",
                                            COMPLETED: "bg-green-100 text-green-700",
                                            CANCELLED: "bg-red-100 text-red-700",
                                        }
                                        return (
                                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-700">
                                                    {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800">₹{booking.totalPrice}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[booking.status] ?? "bg-gray-100 text-gray-600"}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty state if no bookings */}
                {(!provider?.bookings || provider.bookings.length === 0) && (
                    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                        <BarChart2 size={40} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No bookings yet</p>
                        <p className="text-sm text-gray-400 mt-1">Once clients book your services, they'll appear here.</p>
                        <Link href="/provider/dashboard/services" className="mt-4 inline-flex items-center gap-2 bg-stone-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors">
                            <PlusCircle size={16} />
                            Add Your First Service
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
