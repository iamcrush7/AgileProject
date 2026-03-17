"use client"

import { useState } from "react"
import { Bell, Search, Menu, LogOut, Settings, UserCircle } from "lucide-react"
import { signOut } from "next-auth/react"

interface TopBarProps {
    onMenuClick: () => void
    user: any
}

export function DashboardTopBar({ onMenuClick, user }: TopBarProps) {
    const [profileOpen, setProfileOpen] = useState(false)
    const initial = user?.name?.charAt(0)?.toUpperCase() || "U"

    return (
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-border bg-surface z-30">
            {/* Left: Mobile menu button & Search */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-md text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Search bar */}
                <div className="hidden md:flex items-center gap-2 pl-3 pr-2 py-1.5 bg-background border border-border rounded-md w-72 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                    <Search size={16} className="text-muted shrink-0" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm text-primary w-full placeholder:text-muted"
                    />
                    <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded border border-border bg-surface">
                        <kbd className="text-[10px] font-medium text-muted font-sans">⌘K</kbd>
                    </div>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-md text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
                </button>

                <div className="h-5 w-px bg-border mx-1" />

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2.5 p-1 pr-2 rounded-full border border-transparent hover:border-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-background font-semibold text-xs shrink-0">
                            {initial}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-primary leading-none">{user?.name?.split(" ")[0] || "User"}</p>
                        </div>
                    </button>

                    {profileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                                <div className="px-4 py-3 border-b border-border mb-1">
                                    <p className="text-sm font-semibold text-primary truncate">{user?.name}</p>
                                    <p className="text-xs text-secondary truncate mt-0.5">{user?.email}</p>
                                </div>
                                
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <UserCircle size={16} className="text-muted" /> Profile
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Settings size={16} className="text-muted" /> Settings
                                </button>
                                
                                <div className="pt-1 mt-1 border-t border-border">
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={16} className="text-red-500" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
