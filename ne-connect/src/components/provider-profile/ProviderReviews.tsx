"use client"

import { motion } from "framer-motion"
import { Star, ThumbsUp } from "lucide-react"

const REVIEWS = [
    { id: 1, name: "David K.", rating: 5, date: "2 days ago", comment: "Rohit was fantastic! He re-wired my entire living room and installed smart switches. Very professional, left the place clean.", helpful: 12 },
    { id: 2, name: "Anita S.", rating: 5, date: "1 week ago", comment: "Extremely knowledgeable. Fixed my MCB issue in under 30 minutes. Highly recommend him for any electrical work in Shillong.", helpful: 8 },
    { id: 3, name: "John N.", rating: 4, date: "3 weeks ago", comment: "Good service and punctuality. The pricing was fair and transparent.", helpful: 3 },
]

const RATING_BREAKDOWN = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
]

export function ProviderReviews({ reviews = [] }: { reviews?: any[] }) {
    if (!reviews || reviews.length === 0) return null;

    const totalReviews = reviews.length;
    const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);

    return (
        <div className="w-full mt-12 pt-12 border-t border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews ({totalReviews})</h2>

            <div className="grid md:grid-cols-12 gap-12">
                {/* Rating Breakdown */}
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="text-center md:text-left mb-6">
                        <h3 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-2">{avgRating}</h3>
                        <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={20} className={star <= Number(avgRating) ? "text-amber-500 fill-amber-500" : "text-amber-500/30 fill-amber-500/30"} />
                            ))}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Based on {totalReviews} reviews</p>
                    </div>

                    <div className="space-y-3">
                        {RATING_BREAKDOWN.map(item => (
                            <div key={item.stars} className="flex items-center space-x-3 text-sm">
                                <span className="font-bold text-gray-500 dark:text-gray-400 w-2 text-right">{item.stars}</span>
                                <Star size={12} className="text-gray-400 fill-gray-400 shrink-0" />
                                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${item.percentage}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-amber-400 rounded-full"
                                    ></motion.div>
                                </div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review Cards */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center space-x-3 mb-1">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {review.user?.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.user?.name || "User"}</h4>
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className={i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-white/20"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                "{review.comment || "Great service! Highly recommended."}"
                            </p>

                            <div className="flex items-center">
                                <button className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-500 transition-colors">
                                    <ThumbsUp size={14} />
                                    <span>Helpful</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {reviews.length > 5 && (
                        <button className="w-full py-4 mt-4 font-bold text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20">
                            View All Reviews
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
