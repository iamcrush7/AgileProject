"use client"

import { useState } from "react"
import { Mail, Lock, User, Phone, MapPin, Briefcase, Languages, FileText, Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

type UserRole = "USER" | "PROVIDER"

const NE_STATES = [
    "Arunachal Pradesh", "Assam", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Sikkim", "Tripura",
]
const PROFESSIONS = [
    "Electrician", "Plumber", "Carpenter", "Painter", "Cleaner",
    "AC Repair", "Appliance Repair", "Welder", "Mason", "Driver", "Other",
]
const LANGUAGES = ["English", "Assamese", "Hindi", "Bengali", "Manipuri", "Mizo", "Naga", "Bodo", "Nepali", "Khasi", "Garo"]

function FieldInput({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="relative">
            <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
                {...props}
                className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted"
            />
        </div>
    )
}

function SelectInput({ icon: Icon, children, ...props }: { icon: any } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10" />
            <select
                {...props}
                className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
            >
                {children}
            </select>
        </div>
    )
}

export default function SignupPage() {
    const router = useRouter()
    const [role, setRole] = useState<UserRole>("USER")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPass, setShowPass] = useState(false)

    // Shared fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    // Provider-only fields
    const [profession, setProfession] = useState("")
    const [experience, setExperience] = useState("")
    const [selectedLangs, setSelectedLangs] = useState<string[]>([])
    const [bio, setBio] = useState("")

    function toggleLang(lang: string) {
        setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) { setError("Passwords do not match."); return }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return }

        setIsLoading(true)
        setError("")
        try {
            const body: Record<string, any> = { name, email, phone, state, city, password, role }
            if (role === "PROVIDER") {
                body.profession = profession
                body.experience = parseInt(experience) || 0
                body.languages = selectedLangs.join(", ")
                body.bio = bio
            }

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || "Registration failed. Please try again.")
            } else {
                await signIn("credentials", { email, password, redirect: false })
                router.push("/")
            }
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col pt-8 pb-12">
            {/* Header Mini Nav */}
            <div className="w-full max-w-lg mx-auto px-4 mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-background font-bold text-sm">NE</div>
                    <span className="text-xl font-bold text-primary tracking-tight">Connect</span>
                </Link>
                <Link href="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Sign in &rarr;</Link>
            </div>

            <div className="flex-1 w-full max-w-lg mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Create your account</h1>
                    <p className="text-secondary mt-1 text-sm">Join thousands of users across Northeast India</p>
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {(["USER", "PROVIDER"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`p-4 rounded-lg border text-left transition-all ${role === r ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-surface hover:border-gray-400 dark:hover:border-gray-600"}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${role === r ? "bg-primary text-background" : "bg-gray-100 dark:bg-gray-800 text-secondary"}`}>
                                {r === "USER" ? <User size={20} /> : <Briefcase size={20} />}
                            </div>
                            <p className="font-semibold text-primary text-sm">{r === "USER" ? "Customer" : "Professional"}</p>
                            <p className="text-xs text-secondary mt-0.5">{r === "USER" ? "Book services" : "Offer services"}</p>
                        </button>
                    ))}
                </div>

                {/* Main Form container */}
                <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-md px-4 py-3">
                                {error}
                            </div>
                        )}

                        {/* Basic Info */}
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">Basic Info</p>
                            <div className="grid grid-cols-1 gap-3">
                                <FieldInput icon={User} type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" />
                                <FieldInput icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address" />
                                <FieldInput icon={Phone} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number (optional)" pattern="[0-9]{10}" />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">Location</p>
                            <div className="grid grid-cols-2 gap-3">
                                <SelectInput icon={MapPin} value={state} onChange={e => setState(e.target.value)} required>
                                    <option value="">State</option>
                                    {NE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </SelectInput>
                                <FieldInput icon={MapPin} type="text" value={city} onChange={e => setCity(e.target.value)} required placeholder="City / Town" />
                            </div>
                        </div>

                        {/* Provider Extra Fields */}
                        {role === "PROVIDER" && (
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">Professional Info</p>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <SelectInput icon={Briefcase} value={profession} onChange={e => setProfession(e.target.value)} required>
                                            <option value="">Profession</option>
                                            {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </SelectInput>
                                        <FieldInput icon={Briefcase} type="number" value={experience} onChange={e => setExperience(e.target.value)} required min={0} max={50} placeholder="Years Exp." />
                                    </div>

                                    {/* Languages */}
                                    <div className="pt-2">
                                        <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5"><Languages size={12} /> Languages Spoken</p>
                                        <div className="flex flex-wrap gap-2">
                                            {LANGUAGES.map(lang => (
                                                <button
                                                    key={lang}
                                                    type="button"
                                                    onClick={() => toggleLang(lang)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedLangs.includes(lang) ? "bg-primary text-background border-primary" : "border-border text-secondary hover:border-gray-400 dark:hover:border-gray-500"}`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="pt-2">
                                        <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={12} /> Short Bio</p>
                                        <textarea
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            rows={3}
                                            required
                                            placeholder="Describe your services and expertise..."
                                            className="w-full bg-background border border-border rounded-md px-4 py-3 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">Security</p>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        placeholder="Password (min 6 chars)"
                                        className="w-full bg-background border border-border rounded-md pl-10 pr-10 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-secondary">
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        required
                                        placeholder="Confirm Password"
                                        className="w-full bg-background border border-border rounded-md pl-10 pr-10 py-2 text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted"
                                    />
                                </div>
                                {confirm && password !== confirm && (
                                    <p className="text-xs text-red-500 font-medium mt-1">Passwords don't match</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !!(confirm && password !== confirm)}
                            className="w-full bg-primary hover:bg-primary/90 text-background font-medium rounded-md py-2.5 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 mt-6"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="mt-6 grid grid-cols-3 gap-2 py-4 border-y border-border">
                        {["Free to join", "Verified pros", "Instant booking"].map((b) => (
                            <div key={b} className="flex flex-col sm:flex-row items-center sm:gap-1.5 text-[10px] sm:text-xs font-medium text-secondary text-center sm:text-left">
                                <Check size={12} className="text-emerald-500 shrink-0 mb-1 sm:mb-0" />
                                <span>{b}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-secondary text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-medium hover:underline transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
