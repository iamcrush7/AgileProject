import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Route groups protected by role
const PROTECTED: { prefix: string; role: string; redirect: string }[] = [
    { prefix: "/user/dashboard", role: "USER", redirect: "/login" },
    { prefix: "/provider/dashboard", role: "PROVIDER", redirect: "/login" },
    { prefix: "/provider/home", role: "PROVIDER", redirect: "/login" },
    { prefix: "/provider/pending", role: "PROVIDER", redirect: "/login" },
    { prefix: "/admin/dashboard", role: "ADMIN", redirect: "/login" },
    // Provider API
    { prefix: "/api/provider", role: "PROVIDER", redirect: "/login" },
    { prefix: "/api/admin", role: "ADMIN", redirect: "/login" },
]

// Role → correct dashboard (for wrong-role redirects)
const ROLE_HOME: Record<string, string> = {
    USER: "/user/dashboard",
    PROVIDER: "/provider/dashboard",
    ADMIN: "/admin/dashboard",
}

export default auth(function middleware(req) {
    const { nextUrl, auth: session } = req as any
    const pathname = nextUrl.pathname

    // Skip auth pages, public assets, and API auth routes
    const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password",
        "/admin/login", "/api/auth", "/api/bookings", "/api/providers",
        "/api/categories", "/api/reviews", "/api/chat"]
    if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next()

    const role: string | undefined = session?.user?.role

    // Redirect providers away from the public home page
    if (pathname === "/" && role === "PROVIDER") {
        return NextResponse.redirect(new URL("/provider/home", nextUrl.origin))
    }

    // Redirect admins away from the public home page
    if (pathname === "/" && role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl.origin))
    }

    for (const rule of PROTECTED) {
        if (!pathname.startsWith(rule.prefix)) continue

        // Not logged in → redirect to login
        if (!session?.user) {
            const loginUrl = new URL(rule.redirect, nextUrl.origin)
            loginUrl.searchParams.set("callbackUrl", pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Wrong role → bounce to their correct dashboard
        if (role !== rule.role) {
            const correctHome = role ? ROLE_HOME[role] ?? "/" : rule.redirect
            return NextResponse.redirect(new URL(correctHome, nextUrl.origin))
        }

        break // matched and authorised
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/",
        "/user/dashboard/:path*",
        "/provider/dashboard/:path*",
        "/provider/home",
        "/provider/pending",
        "/admin/dashboard/:path*",
        "/api/provider/:path*",
        "/api/admin/:path*",
    ],
}
