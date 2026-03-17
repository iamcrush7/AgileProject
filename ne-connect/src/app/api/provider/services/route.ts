import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const profile = await prisma.providerProfile.findUnique({ where: { userId } })
    if (!profile) return NextResponse.json({ services: [] })

    const services = await prisma.service.findMany({
        where: { providerId: profile.id },
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ services })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id

    const profile = await prisma.providerProfile.findUnique({ where: { userId } })
    if (!profile) return NextResponse.json({ error: "Provider profile not found" }, { status: 404 })

    const { name, description, price, estimatedTime, categoryId } = await req.json()
    if (!name || !price || !categoryId) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

    const service = await prisma.service.create({
        data: { name, description: description || "", price: parseFloat(price), estimatedTime: parseInt(estimatedTime) || 60, categoryId, providerId: profile.id },
        include: { category: { select: { name: true } } },
    })

    return NextResponse.json({ service }, { status: 201 })
}
