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
                <h1 className="text-2xl font-bold text-primary tracking-tight">Reviews</h1>
                <p className="text-secondary text-sm mt-0.5 font-medium">Customer feedback and ratings for your services</p>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-dashed border-border bg-stone-50/50">
                    <p className="text-6xl mb-4">⭐</p>
                    <p className="text-secondary font-bold text-lg">No reviews yet</p>
                    <p className="text-muted text-sm mt-1">Complete bookings to start receiving reviews</p>
                </div>
            ) : (
                <>
                    {/* Rating Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-10 rounded-3xl bg-surface border border-border shadow-sm">
                        <div className="flex flex-col items-center justify-center text-center">
                            <p className="text-8xl font-bold text-primary tracking-tighter">{avgRating.toFixed(1)}</p>
                            <div className="flex items-center space-x-1 my-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <span key={s} className={`text-3xl ${s <= Math.round(avgRating) ? "text-amber-500" : "text-stone-300"}`}>★</span>
                                ))}
                            </div>
                            <p className="text-secondary font-medium">{reviews.length} total reviews</p>
                        </div>
                        <div className="space-y-3 my-auto">
                            {dist.map(({ star, count }) => (
                                <div key={star} className="flex items-center space-x-4">
                                    <span className="text-sm font-bold text-secondary w-8 text-right">{star}★</span>
                                    <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                            style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%" }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-stone-400 w-6">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-5">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all shadow-sm group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-stone-100 border border-border flex items-center justify-center text-primary font-bold text-base shrink-0">
                                            {rev.user.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary text-base">{rev.user.name || "Anonymous"}</p>
                                            <p className="text-stone-400 text-xs font-medium uppercase tracking-wider">{new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                                        </div>
                                    </div>
                                    <div className="flex bg-stone-50 px-2 py-1 rounded-lg border border-stone-100 shadow-sm">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span key={s} className={`text-base ${s <= rev.rating ? "text-amber-500" : "text-stone-200"}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                {rev.comment && <p className="text-secondary text-sm leading-relaxed font-medium pl-1">{rev.comment}</p>}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
