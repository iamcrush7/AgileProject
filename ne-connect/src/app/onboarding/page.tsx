"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Info, Map, Briefcase, FileText, CheckCircle } from "lucide-react"

const schema = z.object({
    businessName: z.string().min(2, "Business name requires at least 2 characters"),
    statePlayed: z.string().min(2, "State selection is required"),
    bio: z.string().min(20, "Please provide a more detailed bio (minimum 20 characters)"),
    experienceYears: z.number().min(0, "Experience must be a positive number"),
    agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms")
})

type FormData = z.infer<typeof schema>

const STEPS = [
    { id: 1, title: "Basic Info", icon: <Info size={18} /> },
    { id: 2, title: "Service Area", icon: <Map size={18} /> },
    { id: 3, title: "Documents", icon: <FileText size={18} /> },
]

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { experienceYears: 0 }
    })

    const onSubmit = (data: FormData) => {
        // Mock submit
        console.log(data)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <main className="min-h-screen pt-32 pb-24 flex justify-center items-center bg-gray-50 dark:bg-black px-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 p-10 rounded-3xl text-center shadow-2xl max-w-md w-full border border-gray-100 dark:border-white/10">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Your provider profile is under review. We will notify you once verified. Welcome to Sahyog-NE!
                    </p>
                    <button onClick={() => window.location.href = "/"} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
                        Return to Dashboard
                    </button>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen pt-28 pb-24 bg-gray-50 dark:bg-black px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Become a Provider</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Join Northeast India's premium service network</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2 rounded-full"></div>
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg transition-colors ${step >= s.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-white/10"
                                }`}>
                                {s.icon}
                            </div>
                            <span className={`text-xs font-semibold mt-2 absolute -bottom-6 ${step >= s.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/10 mt-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h2 className="text-xl font-bold dark:text-white mb-4">Basic Information</h2>
                                <div>
                                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">Business/Personal Name</label>
                                    <input {...register("businessName")} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Arun's Electricals" />
                                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">Professional Bio</label>
                                    <textarea {...register("bio")} rows={4} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tell customers about your skills and experience..."></textarea>
                                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">Years of Experience</label>
                                    <input type="number" {...register("experienceYears", { valueAsNumber: true })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                    {errors.experienceYears && <p className="text-red-500 text-xs mt-1">{errors.experienceYears.message}</p>}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h2 className="text-xl font-bold dark:text-white mb-4">Service Area</h2>
                                <div>
                                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">Primary State</label>
                                    <select {...register("statePlayed")} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Select a state...</option>
                                        <option value="Assam">Assam</option>
                                        <option value="Meghalaya">Meghalaya</option>
                                        <option value="Mizoram">Mizoram</option>
                                        <option value="Nagaland">Nagaland</option>
                                    </select>
                                    {errors.statePlayed && <p className="text-red-500 text-xs mt-1">{errors.statePlayed.message}</p>}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <h2 className="text-xl font-bold dark:text-white mb-4">Document Verification</h2>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center bg-gray-50 dark:bg-black/20">
                                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 mx-auto rounded-full flex flex-col justify-center items-center mb-4">
                                        <FileText size={24} />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">Upload Govt. ID or Certification</p>
                                    <p className="text-xs text-gray-500 mb-4">PNG, JPG or PDF (Max 5MB)</p>
                                    <button type="button" className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl text-sm font-medium dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        Browse Files
                                    </button>
                                </div>

                                <label className="flex items-start space-x-3 mt-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer">
                                    <input type="checkbox" {...register("agreedToTerms")} className="mt-1 w-4 h-4 text-indigo-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Provider Terms of Service</a> and confirm that all submitted information is accurate.
                                    </span>
                                </label>
                                {errors.agreedToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms.message}</p>}
                            </motion.div>
                        )}

                        <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-white/10">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition">
                                    Back
                                </button>
                            ) : <div></div>}

                            {step < 3 ? (
                                <button type="button" onClick={() => setStep(s => s + 1)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/30">
                                    Continue
                                </button>
                            ) : (
                                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/30">
                                    Submit Application
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </main>
    )
}
