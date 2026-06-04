import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get list of unique conversations (distinct users the current user has messaged with)
        const sentTo = await prisma.message.findMany({
            where: { senderId: session.user.id },
            select: { receiverId: true },
            distinct: ["receiverId"],
        })

        const receivedFrom = await prisma.message.findMany({
            where: { receiverId: session.user.id },
            select: { senderId: true },
            distinct: ["senderId"],
        })

        const conversationIds = Array.from(
            new Set([...sentTo.map(m => m.receiverId), ...receivedFrom.map(m => m.senderId)])
        )

        // Fetch users and their latest message
        const conversations = await Promise.all(
            conversationIds.map(async (userId) => {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { id: true, name: true, image: true, email: true },
                })

                const lastMessage = await prisma.message.findFirst({
                    where: {
                        OR: [
                            { senderId: session.user.id, receiverId: userId },
                            { senderId: userId, receiverId: session.user.id },
                        ],
                    },
                    orderBy: { createdAt: "desc" },
                    select: { content: true, createdAt: true, senderId: true },
                })

                const unreadCount = await prisma.message.count({
                    where: {
                        senderId: userId,
                        receiverId: session.user.id,
                        read: false,
                    },
                })

                return {
                    user,
                    lastMessage,
                    unreadCount,
                }
            })
        )

        // Sort by latest message
        conversations.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt?.getTime() || 0
            const bTime = b.lastMessage?.createdAt?.getTime() || 0
            return bTime - aTime
        })

        return NextResponse.json({ conversations })
    } catch (err) {
        console.error("Conversations GET error:", err)
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }
}
