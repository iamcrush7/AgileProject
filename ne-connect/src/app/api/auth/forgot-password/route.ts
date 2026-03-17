import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email is required." }, { status: 400 })
        }

        // Generate a secure token
        const rawToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
        const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        // Try to update — but don't reveal whether email exists (security best practice)
        const user = await prisma.user.findUnique({ where: { email } })

        if (user) {
            await prisma.user.update({
                where: { email },
                data: {
                    passwordResetToken: hashedToken,
                    passwordResetExpiry: expiry,
                },
            })

            // In production, send an email here with:
            // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`
            // For now, log to console in development
            if (process.env.NODE_ENV !== "production") {
                const resetUrl = `http://localhost:3000/reset-password?token=${rawToken}`
                console.log(`\n🔑 Password Reset Link for ${email}:\n${resetUrl}\n`)
            }
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error("Forgot password error:", err)
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}
