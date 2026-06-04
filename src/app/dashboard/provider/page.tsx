import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import { Briefcase } from "lucide-react"
import { ProviderDashboardClient } from "./ProviderDashboardClient"

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
        <ProviderDashboardClient
            session={session}
            providerProfile={providerProfile}
            totalBookings={totalBookings}
            pendingBookings={pendingBookings}
            totalRevenue={totalRevenue}
            avgRating={avgRating}
        />
    )
}
