import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await context.params
    const { status } = await req.json()

    const validStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

    // @ts-ignore
    const userId = session.user.id
    // @ts-ignore
    const role = session.user.role

    // Only the booking owner or a provider/admin can update
    if (role === "USER" && booking.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.booking.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true, booking: updated })
}
