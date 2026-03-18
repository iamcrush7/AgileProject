import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        // @ts-ignore
        const userId = session.user.id

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                phone: true,
                state: true,
                city: true,
                image: true
            }
        })

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: user })

    } catch (error: any) {
        console.error("API /user/profile GET Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        // @ts-ignore
        const userId = session.user.id
        
        const body = await req.json()
        const { name, phone, state, city, image } = body

        if (!name) {
             return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone: phone || null,
                state: state || null,
                city: city || null,
                image: image || null
            },
            select: {
                name: true,
                email: true,
                phone: true,
                state: true,
                city: true,
                image: true
            }
        })

        return NextResponse.json({ success: true, data: updatedUser })

    } catch (error: any) {
        console.error("API /user/profile PUT Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
