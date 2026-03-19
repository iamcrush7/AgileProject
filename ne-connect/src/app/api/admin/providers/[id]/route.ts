import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await context.params
    const { verified } = await req.json()

    const provider = await prisma.providerProfile.update({
        where: { id },
        data: { verified },
    })

    return NextResponse.json({ success: true, provider })
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await context.params

    const profile = await prisma.providerProfile.findUnique({
        where: { id },
        select: { userId: true }
    })

    if (!profile) return NextResponse.json({ error: "Provider not found" }, { status: 404 })

    const userId = profile.userId

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Get all booking IDs for this provider
            const bookings = await tx.booking.findMany({
                where: { providerId: id },
                select: { id: true }
            })
            const bookingIds = bookings.map(b => b.id)

            // 2. Delete payments linked to those bookings
            if (bookingIds.length > 0) {
                await tx.payment.deleteMany({ where: { bookingId: { in: bookingIds } } })
            }

            // 3. Delete all bookings for this provider
            await tx.booking.deleteMany({ where: { providerId: id } })

            // 4. Also delete bookings where this user is the customer
            const userBookings = await tx.booking.findMany({
                where: { userId },
                select: { id: true }
            })
            const userBookingIds = userBookings.map(b => b.id)
            if (userBookingIds.length > 0) {
                await tx.payment.deleteMany({ where: { bookingId: { in: userBookingIds } } })
                await tx.booking.deleteMany({ where: { userId } })
            }

            // 5. Delete reviews (by or about this provider)
            await tx.review.deleteMany({ where: { providerId: id } })
            await tx.review.deleteMany({ where: { userId } })

            // 6. Delete provider documents, availability
            await tx.providerDocument.deleteMany({ where: { providerId: id } })
            await tx.availability.deleteMany({ where: { providerId: id } })

            // 7. Delete services
            await tx.service.deleteMany({ where: { providerId: id } })

            // 8. Delete messages sent/received by this user
            await tx.message.deleteMany({ where: { senderId: userId } })
            await tx.message.deleteMany({ where: { receiverId: userId } })

            // 9. Delete support tickets
            await tx.supportTicket.deleteMany({ where: { userId } })

            // 10. Delete sessions & accounts (NextAuth)
            await tx.session.deleteMany({ where: { userId } })
            await tx.account.deleteMany({ where: { userId } })

            // 11. Delete provider profile
            await tx.providerProfile.delete({ where: { id } })

            // 12. Finally delete the user
            await tx.user.delete({ where: { id: userId } })
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Provider delete error:", error)
        return NextResponse.json({ error: "Failed to delete provider", detail: error.message }, { status: 500 })
    }
}
