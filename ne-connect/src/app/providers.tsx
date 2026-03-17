"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <Navbar />
                {children}
                <Toaster position="bottom-right" />
            </ThemeProvider>
        </SessionProvider>
    )
}

