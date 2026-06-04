import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json()

        if (!token || !password || typeof token !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "Token and new password are required." }, { status: 400 })
        }
        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
        }

        // Hash the incoming token to compare with stored hash
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpiry: { gt: new Date() }, // not expired
            },
        })

        if (!user) {
            return NextResponse.json({ error: "This reset link is invalid or has expired. Please request a new one." }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: passwordHash,
                passwordResetToken: null,
                passwordResetExpiry: null,
            },
        })

        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error("Reset password error:", err)
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }
}
