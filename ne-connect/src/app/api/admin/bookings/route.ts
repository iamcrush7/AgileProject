import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            provider: { select: { businessName: true, user: { select: { name: true } } } },
            service: { select: { name: true, price: true } },
        },
    })

    return NextResponse.json({ bookings })
}
