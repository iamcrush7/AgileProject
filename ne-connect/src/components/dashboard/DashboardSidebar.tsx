"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard, UserCircle, CalendarRange, MessageSquare,
    Settings, LogOut, PackageSearch, Package, Shield,
    Users, Briefcase, FileText, Activity, X, CheckSquare,
    type LucideIcon
} from "lucide-react"

type Role = "USER" | "PROVIDER" | "ADMIN"

interface NavItem {
    name: string
    href: string
    icon: LucideIcon
}

interface NavSection {
    title?: string
    items: NavItem[]
}

const getRoleNav = (role: Role): NavSection[] => {
    switch (role) {
        case "USER":
            return [
                {
                    items: [
                        { name: "Overview", href: "/user/dashboard", icon: LayoutDashboard },
                        { name: "My Bookings", href: "/user/dashboard/bookings", icon: CalendarRange },
                    ]
                },
                {
                    title: "Account",
                    items: [
                        { name: "My Profile", href: "/user/dashboard/profile", icon: UserCircle },
                    ]
                }
            ]
        case "PROVIDER":
            return [
                {
                    items: [
                        { name: "Dashboard", href: "/provider/dashboard", icon: Activity },
                        { name: "Jobs & Requests", href: "/provider/dashboard/jobs", icon: Briefcase },
                        { name: "My Services", href: "/provider/dashboard/services", icon: PackageSearch },
                    ]
                },
                {
                    title: "Insights",
                    items: [
                        { name: "Reviews", href: "/provider/dashboard/reviews", icon: CheckSquare },
                        { name: "Public Profile", href: "/provider/dashboard/profile", icon: UserCircle },
                    ]
                }
            ]
        case "ADMIN":
            return [
                {
                    items: [
                        { name: "Command Center", href: "/admin/dashboard", icon: Shield },
                        { name: "Users", href: "/admin/dashboard/users", icon: Users },
                        { name: "Providers", href: "/admin/dashboard/providers", icon: Briefcase },
                    ]
                },
                {
                    title: "Platform",
                    items: [
                        { name: "Bookings", href: "/admin/dashboard/bookings", icon: FileText },
                        { name: "Categories", href: "/admin/dashboard/categories", icon: Package },
                        { name: "Support", href: "/admin/dashboard/support", icon: MessageSquare },
                    ]
                }
            ]
        default:
            return []
    }
}

interface SidebarProps {
    role: Role
    isMobileOpen: boolean
    setIsMobileOpen: (v: boolean) => void
}

export function DashboardSidebar({ role, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname()
    const sections = getRoleNav(role)
    const roleColors = {
        USER: "from-blue-500 to-indigo-600",
        PROVIDER: "from-emerald-500 to-teal-600",
        ADMIN: "from-orange-500 to-red-600"
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 ease-in-out
                    bg-surface border-r border-border
                    lg:relative lg:translate-x-0
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo & Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="font-semibold text-primary tracking-tight">NE-Connect</span>
                    </Link>

                    {/* Mobile close */}
                    <button 
                        onClick={() => setIsMobileOpen(false)} 
                        className="lg:hidden p-1 rounded-md text-secondary hover:text-primary hover:bg-stone-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Role Indicator */}
                <div className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border text-xs font-medium text-secondary w-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {role === "USER" ? "Customer" : role === "PROVIDER" ? "Professional" : "Administrator"} Portal
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                            {section.title && (
                                <p className="px-3 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
                                    {section.title}
                                </p>
                            )}
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                            ${isActive
                                                ? "bg-stone-100 text-primary font-bold shadow-sm"
                                                : "text-secondary hover:bg-stone-50 hover:text-primary"
                                            }
                                        `}
                                    >
                                        <Icon size={18} className={`shrink-0 ${isActive ? "text-primary" : "text-muted group-hover:text-secondary"}`} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                {/* Sign Out Footer */}
                <div className="p-4 border-t border-border shrink-0">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} className="shrink-0 text-red-500" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    )
}
