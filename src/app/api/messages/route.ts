import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const conversationWith = searchParams.get("conversationWith")

        if (!conversationWith) {
            return NextResponse.json({ error: "conversationWith is required" }, { status: 400 })
        }

        // Fetch messages between current user and another user
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: conversationWith },
                    { senderId: conversationWith, receiverId: session.user.id },
                ],
            },
            select: {
                id: true,
                content: true,
                read: true,
                createdAt: true,
                sender: { select: { id: true, name: true, image: true } },
                receiver: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
        })

        // Mark messages as read
        await prisma.message.updateMany({
            where: {
                senderId: conversationWith,
                receiverId: session.user.id,
                read: false,
            },
            data: { read: true },
        })

        return NextResponse.json({ messages })
    } catch (err) {
        console.error("Messages GET error:", err)
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { receiverId, content } = await req.json()

        if (!receiverId || !content || typeof content !== "string") {
            return NextResponse.json({ error: "receiverId and content are required" }, { status: 400 })
        }

        if (content.trim().length === 0) {
            return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
        }

        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content: content.trim(),
            },
            select: {
                id: true,
                content: true,
                read: true,
                createdAt: true,
                sender: { select: { id: true, name: true, image: true } },
                receiver: { select: { id: true, name: true, image: true } },
            },
        })

        return NextResponse.json({ message }, { status: 201 })
    } catch (err) {
        console.error("Messages POST error:", err)
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
}
