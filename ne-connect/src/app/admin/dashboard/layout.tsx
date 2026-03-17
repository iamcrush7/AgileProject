import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session?.user) redirect("/admin/login")
    // @ts-ignore
    if (session.user.role !== "ADMIN") redirect("/login")

    return (
        <DashboardLayout role="ADMIN" user={session.user}>
            {children}
        </DashboardLayout>
    )
}
