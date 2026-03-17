"use client"

import { MissionStory } from "@/components/about/MissionStory"
import { ImpactCounters } from "@/components/about/ImpactCounters"
import { CoreValues } from "@/components/about/CoreValues"
import { RegionShowcase } from "@/components/landing/RegionShowcase"
import { PremiumFooter } from "@/components/landing/PremiumFooter"
import { motion } from "framer-motion"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#030712] selection:bg-indigo-500/30">
            {/* Page Entry Animation Layer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col min-h-screen"
            >
                {/* 1. Scroll Storytelling Mission */}
                <MissionStory />

                {/* 2. Impact Counters (Animated Stats) */}
                <ImpactCounters />

                {/* 3. Northeast States Identity Grid */}
                <div className="pt-24 pb-12 bg-gray-50 dark:bg-[#0a0f1a]">
                    <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Built for the Northeast</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Our platform is deeply inspired by the rich cultural heritage and tight-knit communities across the 8 states.
                        </p>
                    </div>
                    {/* Reusing the highly polished RegionShowcase from Landing Page */}
                    <div className="-mt-16">
                        <RegionShowcase />
                    </div>
                </div>

                {/* 4. Core Values Grid */}
                <CoreValues />

                {/* 5. Global Footer */}
                <PremiumFooter />
            </motion.div>
        </main>
    )
}
