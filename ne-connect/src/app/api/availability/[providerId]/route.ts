import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ providerId: string }> }) {
    try {
        const { providerId } = await params
        
        const availability = await prisma.availability.findMany({
            where: { providerId }
        })

        if (availability.length === 0) {
            // Return default 9-6 slots for weekdays if none set in DB
            const defaults = [1, 2, 3, 4, 5].map(day => ({
                dayOfWeek: day,
                startTime: "09:00",
                endTime: "18:00",
                isAvailable: true
            }))
            return NextResponse.json({ success: true, data: defaults })
        }

        return NextResponse.json({ success: true, data: availability })

    } catch (error: any) {
        console.error("[AVAILABILITY_GET]", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
