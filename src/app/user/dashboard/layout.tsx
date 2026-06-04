import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session?.user) redirect("/login")
    if (session.user.role === "PROVIDER") redirect("/provider/dashboard")
    if (session.user.role === "ADMIN") redirect("/admin/dashboard")

    return (
        <DashboardLayout role="USER" user={session.user}>
            {children}
        </DashboardLayout>
    )
}
