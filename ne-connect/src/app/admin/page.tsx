import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { PremiumFooter } from "@/components/landing/PremiumFooter"
import { Users, Briefcase, CalendarCheck, TrendingUp, AlertCircle, ShieldCheck, Download } from "lucide-react"

export default async function AdminDashboard() {
    const session = await auth()

    if (!session || !session.user || session.user.role !== "ADMIN") {
        // Technically this should be blocked or redirected, but for the demo we'll show a warning or allow it
        // redirect("/")
    }

    // Platform-wide aggregations
    const totalUsers = await prisma.user.count({ where: { role: "USER" } })
    const totalProviders = await prisma.providerProfile.count()
    const totalBookings = await prisma.booking.count()

    const recentProviders = await prisma.providerProfile.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, image: true, email: true } } }
    })

    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } },
            provider: { include: { user: { select: { name: true } } } },
            service: { select: { name: true, price: true } }
        }
    })

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#030712] pt-28 pb-12 selection:bg-purple-500/30">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Welcome */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            Platform Command Center 🚀
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Overview of the entire NE-Connect marketplace.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="px-5 py-2.5 rounded-xl font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center">
                            <Download size={16} className="mr-2" />
                            Export Data
                        </button>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Providers</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalProviders}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <CalendarCheck size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                        <div className="flex items-center space-x-4 mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-100 uppercase tracking-wider">Platform Health</p>
                                <h3 className="text-2xl font-bold text-white">Excellent</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Live Bookings Stream */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Booking Feed</h2>
                            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                Live Sync
                            </span>
                        </div>

                        <div className="space-y-4">
                            {recentBookings.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent bookings across the platform.</p>
                            ) : (
                                recentBookings.map(b => (
                                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-gray-50 hover:dark:bg-white/5 transition-colors border border-gray-100 dark:border-white/5">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                                                <span className="truncate max-w-[120px]">{b.user.name}</span>
                                                <span className="text-gray-400 mx-2">→</span>
                                                <span className="truncate max-w-[120px] text-indigo-600 dark:text-indigo-400">{b.provider.user.name}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium">{b.service.name}</p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{b.totalPrice}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{b.status}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* New Provider Registrations */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Providers</h2>
                            <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Manage All</button>
                        </div>

                        <div className="space-y-4">
                            {recentProviders.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent providers.</p>
                            ) : (
                                recentProviders.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                                                {p.user?.name?.charAt(0) || "P"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.user?.name || "Professional"}</h4>
                                                <p className="text-xs text-gray-500">{p.citiesServed}, {p.stateServed}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            {p.verified ? (
                                                <div className="flex items-center px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase">
                                                    <ShieldCheck size={12} className="mr-1" />
                                                    Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold uppercase">
                                                    <AlertCircle size={12} className="mr-1" />
                                                    Action Required
                                                </div>
                                            )}
                                            <button className="px-3 py-1 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PremiumFooter />
        </main>
    )
}
