import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const state = searchParams.get('state')
        const city = searchParams.get('city')
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const serviceName = searchParams.get('service')

        let whereClause: any = {}

        if (state) whereClause.stateServed = state
        if (city) whereClause.citiesServed = { contains: city }

        if (category) {
            whereClause.services = {
                some: {
                    category: {
                        name: category
                    }
                }
            }
        }

        if (serviceName) {
            whereClause.services = {
                some: {
                    name: serviceName
                }
            }
        }

        if (search) {
            whereClause.OR = [
                { user: { name: { contains: search } } },
                { businessName: { contains: search } },
                { services: { some: { name: { contains: search } } } }
            ]
        }

        const providers = await prisma.providerProfile.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                services: {
                    include: {
                        category: true
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
            take: 50, // limit to 50 for performance
        })

        // Transform results to calculate average ratings
        const transformedProviders = providers.map(p => {
            const totalReviews = p.reviews.length
            const avgRating = totalReviews > 0
                ? (p.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
                : "New"

            const startingPrice = p.services.length > 0
                ? Math.min(...p.services.map(s => s.price))
                : 0

            return {
                id: p.id,
                name: p.user.name,
                image: p.user.image,
                businessName: p.businessName,
                bio: p.bio,
                experience: p.experience,
                verified: p.verified,
                languages: p.languages.split(',').map(l => l.trim()),
                state: p.stateServed,
                city: p.citiesServed,
                rating: avgRating,
                reviewsCount: totalReviews,
                startingPrice,
                services: p.services.map(s => ({
                    id: s.id,
                    name: s.name,
                    price: s.price,
                    category: s.category.name
                }))
            }
        })

        return NextResponse.json({ success: true, count: transformedProviders.length, data: transformedProviders })
    } catch (error: any) {
        console.error("API /providers Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
