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
        const { providerId, serviceId, rating, comment } = body

        if (!providerId || !rating) {
            return NextResponse.json({ success: false, error: "Missing required review fields" }, { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id as string,
                providerId,
                serviceId: serviceId || null,
                rating: Number(rating),
                comment: comment || "",
            }
        })

        return NextResponse.json({ success: true, data: review }, { status: 201 })

    } catch (error: any) {
        console.error("API /reviews POST Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
