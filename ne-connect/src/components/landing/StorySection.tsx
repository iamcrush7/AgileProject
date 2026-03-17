"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Canvas } from "@react-three/fiber"
import { Float, ContactShadows, Environment, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei"
import { Search, UserCheck, CalendarCheck, ShieldCheck } from "lucide-react"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP)
}

function FloatingCards() {
    return (
        <group>
            {/* These will be animated by GSAP from the parent component using a ref or just let them float and rotate the group via scroll */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                <RoundedBox position={[-2, 1, 0]} args={[2, 3, 0.2]} radius={0.1}>
                    <MeshTransmissionMaterial backside thickness={0.5} color="#8b5cf6" roughness={0.2} transparent opacity={0.8} />
                </RoundedBox>
            </Float>

            <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
                <RoundedBox position={[2, -1, -1]} args={[2.5, 3.5, 0.2]} radius={0.1}>
                    <MeshTransmissionMaterial backside thickness={0.5} color="#10b981" roughness={0.2} transparent opacity={0.8} />
                </RoundedBox>
            </Float>

            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                <RoundedBox position={[0, 0, -2]} args={[3, 2, 0.2]} radius={0.1}>
                    <MeshTransmissionMaterial backside thickness={0.5} color="#3b82f6" roughness={0.2} transparent opacity={0.8} />
                </RoundedBox>
            </Float>
        </group>
    )
}

export function StorySection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const textsRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            })

            const texts = gsap.utils.toArray(".story-text") as HTMLElement[]

            // Intro fade out
            tl.to(".story-intro", { opacity: 0, y: -50, duration: 1 })

            // Scene 1
            tl.fromTo(texts[0], { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
            tl.to(texts[0], { opacity: 0, y: -100, duration: 1, delay: 0.5 })

            // Scene 2 
            tl.fromTo(texts[1], { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
            tl.to(texts[1], { opacity: 0, y: -100, duration: 1, delay: 0.5 })

            // Scene 3
            tl.fromTo(texts[2], { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
            tl.to(texts[2], { opacity: 0, y: -100, duration: 1, delay: 0.5 })

            // Scene 4
            tl.fromTo(texts[3], { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 })
            // Holds at the end

            // Animate 3D canvas wrapper (fake camera movement)
            tl.to(".story-3d-wrapper", {
                scale: 1.5,
                rotation: 15,
                x: "-10vw",
                duration: texts.length * 2,
                ease: "none"
            }, 0)
        })

        // Mobile version (simpler, no pinning)
        mm.add("(max-width: 767px)", () => {
            const texts = gsap.utils.toArray(".story-text") as HTMLElement[]
            texts.forEach((text) => {
                gsap.fromTo(text,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: text,
                            start: "top 80%",
                            end: "top 50%",
                            scrub: true
                        }
                    }
                )
            })
        })

        return () => mm.revert()
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative h-[100svh] md:h-screen w-full bg-[#030712] overflow-hidden flex items-center justify-center">

            {/* Fixed 3D Background specifically for StorySection */}
            <div className="story-3d-wrapper absolute inset-0 z-0 opacity-40">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                    <Environment files="/potsdamer_platz_1k.hdr" />
                    <FloatingCards />
                    <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={10} color="#000000" />
                </Canvas>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex items-center">

                <div className="w-full md:w-1/2 relative h-full flex items-center justify-center md:justify-start" ref={textsRef}>

                    <div className="story-intro absolute inset-x-0 text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                            Cinematic <br className="hidden md:block" /> Service Delivery.
                        </h2>
                        <p className="text-xl text-gray-400 max-w-md mx-auto md:mx-0">
                            Experience the future of local services in Northeast India.
                        </p>
                    </div>

                    <div className="story-text absolute inset-x-0 opacity-0 invisible md:visible">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                <Search size={24} />
                            </div>
                            <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Step 01</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Explore <br />Floating Services</h3>
                        <p className="text-xl text-gray-400 text-balance leading-relaxed">
                            Navigate through an immersive 3D world of categories. Find what you need instantly from thousands of verified professionals.
                        </p>
                    </div>

                    <div className="story-text absolute inset-x-0 opacity-0 invisible md:visible">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                <UserCheck size={24} />
                            </div>
                            <span className="text-purple-400 font-bold tracking-widest uppercase text-sm">Step 02</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Interactive <br />Provider Profiles</h3>
                        <p className="text-xl text-gray-400 text-balance leading-relaxed">
                            Profiles designed like premium trading cards. View portfolios, real reviews, and transparent pricing in stunning detail.
                        </p>
                    </div>

                    <div className="story-text absolute inset-x-0 opacity-0 invisible md:visible">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <CalendarCheck size={24} />
                            </div>
                            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Step 03</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Instant <br />Cinematic Booking</h3>
                        <p className="text-xl text-gray-400 text-balance leading-relaxed">
                            Book instantly with smooth, satisfying micro-interactions. Your time is secured without unnecessary phone calls.
                        </p>
                    </div>

                    <div className="story-text absolute inset-x-0 opacity-0 invisible md:visible">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-amber-400 font-bold tracking-widest uppercase text-sm">Step 04</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Relax and <br />Track Progress</h3>
                        <p className="text-xl text-gray-400 text-balance leading-relaxed">
                            Receive real-time updates and pay securely through the platform only when the job is done to your satisfaction.
                        </p>
                    </div>

                </div>
            </div>

            {/* Mobile Fallback Layout (only visible on mobile, stacking vertically) */}
            <div className="md:hidden absolute inset-0 overflow-y-auto w-full px-6 pt-32 pb-24 z-20 space-y-32">
                <div className="story-text">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <Search size={20} />
                        </div>
                        <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Step 01</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Explore Services</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">Navigate through an immersive world of categories. Find what you need instantly.</p>
                </div>

                <div className="story-text">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <UserCheck size={20} />
                        </div>
                        <span className="text-purple-400 font-bold tracking-widest uppercase text-xs">Step 02</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Provider Profiles</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">View portfolios, real reviews, and transparent pricing.</p>
                </div>

                <div className="story-text">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <CalendarCheck size={20} />
                        </div>
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Step 03</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Instant Booking</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">Book instantly with smooth, satisfying micro-interactions.</p>
                </div>
            </div>
        </section>
    )
}
