import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { providerId, serviceId, date, time, notes, totalPrice } = body

        if (!providerId || !serviceId || !date || !time) {
            return NextResponse.json({ success: false, error: "Missing required booking fields" }, { status: 400 })
        }

        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id as string,
                providerId,
                serviceId,
                date: new Date(date),
                time,
                notes: notes || "",
                totalPrice: Number(totalPrice),
                status: "PENDING"
            }
        })

        return NextResponse.json({ success: true, data: booking }, { status: 201 })

    } catch (error: any) {
        console.error("API /bookings POST Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // @ts-ignore
        const userId = session.user.id as string
        // @ts-ignore
        const role = session.user.role as string
        const roleParam = req.nextUrl.searchParams.get("role")

        let bookings

        if (roleParam === "provider" || role === "PROVIDER") {
            // Provider sees bookings assigned to their profile
            const profile = await prisma.providerProfile.findUnique({ where: { userId } })
            if (!profile) return NextResponse.json({ bookings: [] })

            bookings = await prisma.booking.findMany({
                where: { providerId: profile.id },
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                    service: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
            })
        } else if (role === "ADMIN") {
            bookings = await prisma.booking.findMany({
                include: {
                    user: { select: { name: true } },
                    provider: { select: { businessName: true, user: { select: { name: true } } } },
                    service: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
            })
        } else {
            // Regular user sees their own bookings
            bookings = await prisma.booking.findMany({
                where: { userId },
                include: {
                    provider: {
                        select: {
                            businessName: true,
                            user: { select: { name: true } },
                        },
                    },
                    service: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
            })
        }

        return NextResponse.json({ bookings })

    } catch (error: any) {
        console.error("API /bookings GET Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
