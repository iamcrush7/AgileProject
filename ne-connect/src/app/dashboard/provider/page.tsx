import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { PremiumFooter } from "@/components/landing/PremiumFooter"
import { Calendar, Package, IndianRupee, Star, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

export default async function ProviderDashboard() {
    const session = await auth()

    if (!session || !session.user) {
        redirect("/api/auth/signin?callbackUrl=/dashboard/provider")
    }

    if (session.user.role !== "PROVIDER" && session.user.role !== "ADMIN") {
        // Technically this should be blocked or redirected to user dashboard, but for demo we allow it
        // Or we can just check if they have a provider profile
    }

    const providerProfile = await prisma.providerProfile.findFirst({
        where: { userId: session.user.id },
        include: {
            services: true,
            bookings: {
                include: {
                    user: { select: { name: true, image: true, email: true } },
                    service: true
                },
                orderBy: { createdAt: 'desc' }
            },
            reviews: true
        }
    })

    if (!providerProfile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex flex-col items-center justify-center p-4">
                <Navbar />
                <div className="max-w-md w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center mt-20 shadow-2xl">
                    <Briefcase size={48} className="mx-auto text-indigo-500 mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complete Your Profile</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">You need to set up your provider profile before you can access the dashboard and start receiving bookings.</p>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                        Set Up Profile
                    </button>
                </div>
            </div>
        )
    }

    // Stats
    const totalBookings = providerProfile.bookings.length
    const pendingBookings = providerProfile.bookings.filter(b => b.status === 'PENDING').length
    const totalRevenue = providerProfile.bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + b.totalPrice, 0)

    const avgRating = providerProfile.reviews.length > 0
        ? (providerProfile.reviews.reduce((sum, r) => sum + r.rating, 0) / providerProfile.reviews.length).toFixed(1)
        : "New"

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#030712] pt-28 pb-12 selection:bg-indigo-500/30">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Welcome */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            Welcome back, {session.user.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Here's what's happening with your business today.</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href={`/provider/${providerProfile.id}`} className="px-5 py-2.5 rounded-xl font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                            View Public Profile
                        </Link>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Stat 1 */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <IndianRupee size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalRevenue}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Star size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{avgRating}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                        <div className="flex items-center space-x-4 mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-purple-600 dark:text-purple-400">Pending Actions</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pendingBookings}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Main Content: Recent Bookings */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Booking Requests</h2>
                                <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">View All</button>
                            </div>

                            {providerProfile.bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="text-gray-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No bookings yet</h3>
                                    <p className="text-gray-500">When customers book your services, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {providerProfile.bookings.slice(0, 5).map(booking => (
                                        <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 hover:dark:bg-white/[0.02] transition-colors gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                                                    {booking.user?.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{booking.user?.name || "Customer"}</h4>
                                                    <p className="text-sm text-gray-500">{booking.service?.name || "General Service"}</p>
                                                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                                                        <Calendar size={12} className="mr-1" />
                                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-white/5">
                                                <div className="text-left sm:text-right">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">₹{booking.totalPrice}</p>
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                            booking.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                                'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                {booking.status === 'PENDING' && (
                                                    <div className="flex space-x-2">
                                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
                                                            Accept
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar: Profile Overview & Services */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 lg:p-8 text-white shadow-xl shadow-indigo-500/20">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-wider mb-1">Profile Status</h3>
                                    <p className="text-2xl font-extrabold flex items-center">
                                        Active <span className="w-3 h-3 rounded-full bg-emerald-400 ml-3 animate-pulse"></span>
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-2">
                                    <span className="text-indigo-200">Listing Completeness</span>
                                    <span>{providerProfile.verified ? '100%' : '80%'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-indigo-200">Response Rate</span>
                                    <span>98%</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 font-bold py-3 rounded-xl transition-all">
                                Edit Profile
                            </button>
                        </div>

                        {/* Services Management */}
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 lg:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white">Active Services</h3>
                                <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                    +
                                </button>
                            </div>

                            <div className="space-y-4">
                                {providerProfile.services.map(service => (
                                    <div key={service.id} className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{service.name}</p>
                                            <p className="text-xs font-semibold text-gray-500">₹{service.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PremiumFooter />
        </main>
    )
}
