import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const {
            name, email, password, role = "USER",
            phone, state, city,
            // Provider-only
            profession, experience, languages, bio,
        } = await req.json()

        // ── Validation ──────────────────────────────────────────────────
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 })
        }
        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
        }
        const validRoles = ["USER", "PROVIDER"]
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role." }, { status: 400 })
        }

        // ── Uniqueness check ─────────────────────────────────────────────
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
        }
        if (phone) {
            const existingPhone = await prisma.user.findUnique({ where: { phone } })
            if (existingPhone) {
                return NextResponse.json({ error: "This phone number is already registered." }, { status: 409 })
            }
        }

        // ── Hash password ────────────────────────────────────────────────
        const passwordHash = await bcrypt.hash(password, 12)

        // ── Create user ──────────────────────────────────────────────────
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                role: role === "PROVIDER" ? "PROVIDER" : "USER",
                phone: phone || null,
                state: state || null,
                city: city || null,
            },
        })

        // ── Create ProviderProfile if PROVIDER ───────────────────────────
        if (role === "PROVIDER") {
            await prisma.providerProfile.create({
                data: {
                    userId: user.id,
                    businessName: name,
                    bio: bio || "",
                    experience: typeof experience === "number" ? experience : parseInt(experience) || 0,
                    languages: languages || "English",
                    stateServed: state || null,
                },
            })
        }

        return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err)
        return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 })
    }
}
