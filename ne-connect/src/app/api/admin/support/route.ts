import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
    })

    return NextResponse.json({ tickets })
}

export async function PATCH(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: "ID and status are required" }, { status: 400 })

    const ticket = await prisma.supportTicket.update({ where: { id }, data: { status } })
    return NextResponse.json({ ticket })
}
