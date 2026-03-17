"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, X, User, LayoutDashboard, CalendarRange, Settings, LogOut, Briefcase, PackageSearch, Shield, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { RegionSelector } from "@/components/RegionSelector"
import { useSession, signOut } from "next-auth/react"

const NAV_LINKS = [
    { name: "Services", path: "/services" },
    { name: "Providers", path: "/providers" },
    { name: "How it Works", path: "/#how-it-works" },
    { name: "About", path: "/about" },
]

const roleMenus: Record<string, { label: string; href: string; icon: any }[]> = {
    USER: [
        { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
        { label: "Bookings", href: "/user/dashboard/bookings", icon: CalendarRange },
        { label: "Settings", href: "/user/dashboard/settings", icon: Settings },
    ],
    PROVIDER: [
        { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
        { label: "Jobs", href: "/provider/dashboard/jobs", icon: Briefcase },
        { label: "Settings", href: "/provider/dashboard/settings", icon: Settings },
    ],
    ADMIN: [
        { label: "Admin Panel", href: "/admin/dashboard", icon: Shield },
    ],
}

function UserMenu() {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [])

    if (!session?.user) {
        return (
            <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                Sign in
            </Link>
        )
    }

    const name: string = (session.user as any).name || "User"
    const role: string = (session.user as any).role || "USER"
    const initial = name.charAt(0).toUpperCase()
    const menuItems = roleMenus[role] ?? roleMenus.USER

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 pr-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Account menu"
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-background">
                    {initial}
                </div>
                <ChevronDown size={14} className="text-secondary" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-surface py-1 shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-primary truncate">{name}</p>
                        <p className="text-xs text-secondary truncate mt-0.5">{session.user.email}</p>
                    </div>

                    <div className="py-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                            >
                                <item.icon size={16} className="mr-3 text-muted" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-border py-1">
                        <button
                            onClick={() => { setOpen(false); signOut({ callbackUrl: "/login" }) }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <LogOut size={16} className="mr-3" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: session } = useSession()

    // Hide on auth pages and dashboard pages
    const HIDDEN_PATHS = [
        "/login", "/signup", "/forgot-password", "/reset-password",
        "/admin/login", "/onboarding",
    ]
    const isAuthPage = HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith(p + "?"))
    const isDashboard =
        pathname.startsWith("/user/dashboard") ||
        pathname.startsWith("/provider/dashboard") ||
        pathname.startsWith("/admin/dashboard") ||
        (pathname.startsWith("/admin") && pathname !== "/admin")

    if (isAuthPage || isDashboard) return null

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-background font-bold text-lg">
                            N
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-primary">
                            NE-Connect
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${
                                    pathname === link.path ? "text-primary" : "text-secondary"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <RegionSelector />
                        <div className="h-5 w-px bg-border"></div>
                        <ThemeToggle />
                        <UserMenu />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <ThemeToggle />
                        <UserMenu />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-8 md:hidden bg-background">
                    <div className="relative z-20 grid gap-6 rounded-md bg-surface p-4 text-primary shadow-md border border-border">
                        <nav className="grid grid-flow-row auto-rows-max text-sm gap-4">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center p-2 text-sm font-medium hover:underline"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="p-2 border-t border-border mt-2 pt-4">
                                <RegionSelector />
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}
