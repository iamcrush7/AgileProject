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

        const profile = await prisma.providerProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                        phone: true
                    }
                }
            }
        })

        if (!profile) {
            return NextResponse.json({ success: false, error: "Provider profile not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: profile })

    } catch (error: any) {
        console.error("API /provider/profile GET Error:", error)
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
        const { businessName, bio, experience, stateServed, citiesServed, name, image } = body

        // Start a transaction to update both User and ProviderProfile
        const result = await prisma.$transaction(async (tx) => {
            // Update User details
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    name: name || undefined,
                    image: image || undefined
                }
            })

            // Update ProviderProfile
            const updatedProfile = await tx.providerProfile.update({
                where: { userId },
                data: {
                    businessName: businessName || null,
                    bio: bio || null,
                    experience: experience ? parseInt(experience) : 0,
                    stateServed: stateServed || null,
                    citiesServed: citiesServed || ""
                }
            })

            return { ...updatedProfile, user: updatedUser }
        })

        return NextResponse.json({ success: true, data: result })

    } catch (error: any) {
        console.error("API /provider/profile PUT Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
