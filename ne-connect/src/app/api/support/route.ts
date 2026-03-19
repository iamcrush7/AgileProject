import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { subject, description } = await req.json()

        if (!subject || !description) {
            return NextResponse.json({ error: "Subject and description are required" }, { status: 400 })
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                // @ts-ignore
                userId: session.user.id,
                subject,
                description,
                status: "OPEN"
            }
        })

        return NextResponse.json({ success: true, ticket })
    } catch (err: any) {
        console.error("Support ticket error:", err)
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }
}
