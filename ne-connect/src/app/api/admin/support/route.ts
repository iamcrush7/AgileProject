import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    try {
        const tickets = await prisma.supportTicket.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true, role: true } }
            }
        })
        return NextResponse.json({ tickets })
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return NextResponse.json({ error: "Ticket ID required" }, { status: 400 })

        await prisma.supportTicket.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    try {
        const { id, status } = await req.json()
        if (!id || !status) return NextResponse.json({ error: "ID and status required" }, { status: 400 })

        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: { status }
        })
        return NextResponse.json({ success: true, ticket })
    } catch (err) {
        return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
    }
}
