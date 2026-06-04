import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// For Phone OTP mock
function MockPhoneOTP(_options: Record<string, unknown>) {
    return {
        id: "phone",
        name: "Phone OTP",
        type: "credentials" as const,
        credentials: {
            phone: { label: "Phone Number", type: "text" },
            otp: { label: "OTP", type: "text" }
        },
        async authorize(credentials: Partial<Record<string, unknown>>) {
            if (!credentials) return null;
            const phone = credentials.phone as string;
            const otp = credentials.otp as string;
            
            if (otp === "123456") {
                const user = await prisma.user.findUnique({ where: { phone } })
                if (user) return user;

                return await prisma.user.create({
                    data: { phone, role: "USER" }
                })
            }
            return null
        }
    }
}

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET || "dev-secret",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret"
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !user.password) return null

                // Compare against bcrypt hash
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )
                if (!isValid) return null

                return user
            }
        }),
        MockPhoneOTP({})
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.picture = user.image
            }
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name
                if (session.image) token.picture = session.image
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.image = token.picture as string | undefined | null
            }
            return session
        }
    }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
