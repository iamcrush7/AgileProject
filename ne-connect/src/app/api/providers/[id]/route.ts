import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params
        const providerId = resolvedParams.id

        const provider = await prisma.providerProfile.findUnique({
            where: { id: providerId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                services: true,
                reviews: {
                    include: {
                        user: { select: { name: true, image: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!provider) {
            return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 })
        }

        const totalReviews = provider.reviews.length
        const avgRating = totalReviews > 0
            ? (provider.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
            : "New"

        const startingPrice = provider.services.length > 0
            ? Math.min(...provider.services.map(s => s.price))
            : 0

        const data = {
            id: provider.id,
            name: provider.user.name,
            image: provider.user.image,
            businessName: provider.businessName,
            bio: provider.bio,
            experience: provider.experience,
            verified: provider.verified,
            languages: provider.languages.split(',').map(l => l.trim()),
            state: provider.stateServed,
            city: provider.citiesServed,
            rating: avgRating,
            reviewsCount: totalReviews,
            startingPrice,
            services: provider.services,
            reviews: provider.reviews
        }

        return NextResponse.json({ success: true, data })

    } catch (error: any) {
        console.error("API /providers/[id] Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
