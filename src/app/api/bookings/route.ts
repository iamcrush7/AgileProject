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
        const { providerId, serviceId, date, time, notes, address, totalPrice } = body

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
                notes: [
                    address ? `SERVICE ADDRESS: ${address}` : null,
                    notes || null
                ].filter(Boolean).join("\n") || "",
                totalPrice: Number(totalPrice),
                status: "PENDING"
            }
        })

        // Fetch related data for automated messages
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { id: providerId }
        });
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (providerProfile && service) {
            const bookingDate = new Date(date).toLocaleDateString();
            
            // Message from User to Provider
            const userMessageContent = `Hello! I have booked your service '${service.name}' for ${bookingDate} at ${time}. ${notes ? `\nNotes: ${notes}` : ''}`;
            await prisma.message.create({
                data: {
                    senderId: session.user.id as string,
                    receiverId: providerProfile.userId,
                    content: userMessageContent
                }
            });

            // Automated Reply from Provider to User
            const providerReplyContent = `Thank you for your booking! I have received your request for '${service.name}' and will review it shortly.`;
            await prisma.message.create({
                data: {
                    senderId: providerProfile.userId,
                    receiverId: session.user.id as string,
                    content: providerReplyContent
                }
            });
        }

        return NextResponse.json({ success: true, data: booking }, { status: 201 })

    } catch (error) {
        console.error("API /bookings POST Error:", error)
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id as string
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
                    user: { select: { name: true, email: true, phone: true, city: true, state: true } },
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

    } catch (error) {
        console.error("API /bookings GET Error:", error)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
