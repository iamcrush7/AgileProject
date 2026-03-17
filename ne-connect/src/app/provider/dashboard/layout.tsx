import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default async function ProviderDashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session?.user) redirect("/login")
    // @ts-ignore
    if (session.user.role === "USER") redirect("/user/dashboard")
    // @ts-ignore  
    if (session.user.role === "ADMIN") redirect("/admin/dashboard")

    return (
        <DashboardLayout role="PROVIDER" user={session.user}>
            {children}
        </DashboardLayout>
    )
}
