import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default async function ProviderDashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session?.user) redirect("/login")
    // @ts-ignore
    if (session.user.role === "USER") redirect("/user/dashboard")
    // @ts-ignore
    if (session.user.role === "ADMIN") redirect("/admin/dashboard")

    // Check if provider is approved by admin
    const userId = (session.user as any).id
    const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId },
        select: { verified: true }
    })

    // If profile doesn't exist yet, or not verified → pending page
    if (!providerProfile || !providerProfile.verified) {
        redirect("/provider/pending")
    }

    return (
        <DashboardLayout role="PROVIDER" user={session.user}>
            {children}
        </DashboardLayout>
    )
}
