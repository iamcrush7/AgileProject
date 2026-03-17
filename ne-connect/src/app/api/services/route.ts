import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const q = searchParams.get("q") || ""
        const categoryId = searchParams.get("category")
        const state = searchParams.get("state")
        const city = searchParams.get("city")

        // We want to fetch unique service types (grouped by name/categoryId)
        // and aggregate data from the individual service offerings.
        
        // Construct the where clause for individual services
        const where: any = {}
        if (q) {
            where.OR = [
                { name: { contains: q } },
                { description: { contains: q } }
            ]
        }
        if (categoryId && categoryId !== "all") where.categoryId = categoryId
        if (state && state !== "All Locations") where.state = state
        if (city) where.city = city

        // Fetch all matching services to aggregate in memory (since SQLite grouping by name is easier this way for complex aggregations)
        const services = await prisma.service.findMany({
            where,
            include: {
                category: true,
                reviews: {
                    select: { rating: true }
                }
            }
        })

        // Aggregate by service name
        const aggregated = services.reduce((acc: any, s) => {
            if (!acc[s.name]) {
                acc[s.name] = {
                    name: s.name,
                    category: s.category.name,
                    categoryId: s.categoryId,
                    description: s.description,
                    minPrice: s.price,
                    providerCount: 0,
                    totalRating: 0,
                    reviewCount: 0,
                    image: s.category.image || "default-service",
                }
            }
            
            acc[s.name].providerCount += 1
            if (s.price < acc[s.name].minPrice) acc[s.name].minPrice = s.price
            
            s.reviews.forEach(r => {
                acc[s.name].totalRating += r.rating
                acc[s.name].reviewCount += 1
            })

            return acc
        }, {})

        const results = Object.values(aggregated).map((s: any) => ({
            ...s,
            rating: s.reviewCount > 0 ? Number((s.totalRating / s.reviewCount).toFixed(1)) : 0
        }))

        // Sort by provider count descending by default
        results.sort((a, b) => b.providerCount - a.providerCount)

        return NextResponse.json({ services: results })
    } catch (error) {
        console.error("[SERVICES_GET]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
