import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id
    const { id } = await context.params
    const { name, description, price, estimatedTime } = await req.json()

    const profile = await prisma.providerProfile.findUnique({ where: { userId } })
    const service = await prisma.service.findFirst({ where: { id, providerId: profile?.id } })
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 })

    const updated = await prisma.service.update({
        where: { id },
        data: { name, description, price: parseFloat(price), estimatedTime: parseInt(estimatedTime) },
        include: { category: { select: { name: true } } },
    })

    return NextResponse.json({ service: updated })
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    const userId = session.user.id
    const { id } = await context.params

    const profile = await prisma.providerProfile.findUnique({ where: { userId } })
    const service = await prisma.service.findFirst({ where: { id, providerId: profile?.id } })
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 })

    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
