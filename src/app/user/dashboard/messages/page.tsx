"use client"

import { Suspense } from "react"
import { Inbox } from "@/components/Inbox"

export default function UserMessagesPage() {
    return (
        <div className="bg-white dark:bg-black border border-border rounded-xl shadow-sm overflow-hidden min-h-[600px]">
            <Suspense fallback={<div className="p-8 text-center text-muted">Loading messages...</div>}>
                <Inbox hideHeader />
            </Suspense>
        </div>
    )
}
