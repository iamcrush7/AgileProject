"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="h-9 w-9" />

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-secondary transition-colors hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Moon size={18} />
            ) : (
                <Sun size={18} />
            )}
        </button>
    )
}
