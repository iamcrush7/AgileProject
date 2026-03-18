import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { services: true } } },
    })

    return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { name, description } = await req.json()
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const category = await prisma.category.create({ data: { name, description } })
    return NextResponse.json({ category }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // @ts-ignore
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
