import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function ProviderReviewsPage() {
    const session = await auth()
    // @ts-ignore
    const userId = session?.user?.id!

    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
        include: {
            reviews: {
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true, image: true } } },
            },
        },
    })

    const reviews = profile?.reviews || []
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0
    const dist = [5, 4, 3, 2, 1].map((n) => ({ star: n, count: reviews.filter((r) => r.rating === n).length }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-extrabold text-white">Reviews</h1>
                <p className="text-gray-400 text-sm mt-0.5">Customer feedback and ratings for your services</p>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/5">
                    <p className="text-5xl mb-3">⭐</p>
                    <p className="text-gray-400 font-semibold">No reviews yet</p>
                    <p className="text-gray-600 text-sm mt-1">Complete bookings to start receiving reviews</p>
                </div>
            ) : (
                <>
                    {/* Rating Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 rounded-3xl bg-white/5 border border-white/10">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-7xl font-extrabold text-white">{avgRating.toFixed(1)}</p>
                            <div className="flex items-center space-x-1 my-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <span key={s} className={`text-2xl ${s <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-600"}`}>★</span>
                                ))}
                            </div>
                            <p className="text-gray-400 text-sm">{reviews.length} total reviews</p>
                        </div>
                        <div className="space-y-2 my-auto">
                            {dist.map(({ star, count }) => (
                                <div key={star} className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-400 w-8 text-right">{star}★</span>
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full transition-all"
                                            style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%" }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600 w-6">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {rev.user.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{rev.user.name || "Anonymous"}</p>
                                            <p className="text-gray-600 text-xs">{new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span key={s} className={`text-base ${s <= rev.rating ? "text-yellow-400" : "text-gray-700"}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                {rev.comment && <p className="text-gray-300 text-sm leading-relaxed">{rev.comment}</p>}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
