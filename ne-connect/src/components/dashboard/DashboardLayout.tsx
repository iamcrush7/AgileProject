"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar"

type Role = "USER" | "PROVIDER" | "ADMIN"

export function DashboardLayout({ children, role, user }: { children: React.ReactNode, role: Role, user: any }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* ── Sidebar ── */}
            <DashboardSidebar
                role={role}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* ── Main column: TopBar + scrollable content ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
                {/* TopBar is sticky at the top of this column */}
                <DashboardTopBar
                    onMenuClick={() => setIsMobileOpen(true)}
                    user={user}
                />

                {/* Scrollable page content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
