"use client"

import { HeroSection } from "@/components/landing/HeroSection"
import { ServiceShowcase } from "@/components/landing/ServiceShowcase"
import { RegionShowcase } from "@/components/landing/RegionShowcase"
import { FeaturedProfessionals } from "@/components/landing/FeaturedProfessionals"
import { TrustSection } from "@/components/landing/TrustSection"
import { Testimonials } from "@/components/landing/Testimonials"
import { ProviderCTA } from "@/components/landing/ProviderCTA"
import { ChatbotShowcase } from "@/components/landing/ChatbotShowcase"
import { PremiumFooter } from "@/components/landing/PremiumFooter"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            <HeroSection />
            <ServiceShowcase />
            <RegionShowcase />
            <FeaturedProfessionals />
            <TrustSection />
            <Testimonials />
            <ProviderCTA />
            <ChatbotShowcase />
            <PremiumFooter />
        </div>
    )
}
