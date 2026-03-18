import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles")
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`
        const filepath = path.join(uploadDir, filename)

        // Save file locally
        await writeFile(filepath, buffer)

        // Return the public URL
        const fileUrl = `/uploads/profiles/${filename}`

        return NextResponse.json({ success: true, url: fileUrl })
    } catch (error: any) {
        console.error("Image Upload Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
