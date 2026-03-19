import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Clock, CheckCircle2, Mail, LogOut } from "lucide-react"
import { signOut } from "@/auth"

export default async function ProviderPendingPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")
    // @ts-ignore
    if (session.user.role !== "PROVIDER") redirect("/")

    const name = (session.user as any).name || "there"
    const firstName = name.split(" ")[0]

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <div className="mb-12 text-center">
                <span className="text-2xl font-black text-stone-800 tracking-tight">Sahyog-NE</span>
            </div>

            {/* Card */}
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-100 p-10 text-center">

                {/* Animated Clock Icon */}
                <div className="relative mx-auto w-24 h-24 mb-8">
                    <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-40" />
                    <div className="relative w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                        <Clock size={40} className="text-amber-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-stone-800 mb-3 tracking-tight">
                    Hang tight, {firstName}!
                </h1>

                <p className="text-stone-500 text-lg mb-8 leading-relaxed">
                    Your provider account is currently <span className="font-semibold text-amber-600">under review</span>.
                    Our admin team will verify your profile and approve you shortly.
                </p>

                {/* Steps */}
                <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={14} className="text-green-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-stone-700 text-sm">Account Created</p>
                            <p className="text-stone-400 text-xs mt-0.5">Your account has been registered successfully.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Clock size={14} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-stone-700 text-sm">Admin Review</p>
                            <p className="text-stone-400 text-xs mt-0.5">Our team is reviewing your profile. This usually takes 24–48 hours.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={14} className="text-stone-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-stone-400 text-sm">Access Granted</p>
                            <p className="text-stone-400 text-xs mt-0.5">Once approved, you can start accepting jobs.</p>
                        </div>
                    </div>
                </div>

                {/* Email note */}
                <div className="flex items-center justify-center gap-2 text-sm text-stone-500 mb-8">
                    <Mail size={16} className="text-stone-400" />
                    <span>We'll notify you at <strong className="text-stone-700">{session.user.email}</strong></span>
                </div>

                {/* Sign out */}
                <form action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/login" })
                }}>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-red-600 transition-colors font-medium"
                    >
                        <LogOut size={15} />
                        Sign out
                    </button>
                </form>
            </div>

            <p className="mt-8 text-xs text-stone-400">
                Need help? Contact us at{" "}
                <a href="mailto:support@sahyog-ne.in" className="underline hover:text-stone-600">
                    support@sahyog-ne.in
                </a>
            </p>
        </div>
    )
}
