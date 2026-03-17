"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Sparkles } from "@react-three/drei"
import { useRef, useMemo } from "react"
import type { Group } from "three"

function AnimatedParticles() {
    const groupRef = useRef<Group>(null!)

    useFrame((state) => {
        if (!groupRef.current) return
        // Very subtle slow rotation of the entire particle group
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
        groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.01

        // Parallax effect based on pointer
        const pointerX = state.pointer.x * 0.5
        const pointerY = state.pointer.y * 0.5

        // Smoothly interpolate position towards pointer
        groupRef.current.position.x += (pointerX - groupRef.current.position.x) * 0.05
        groupRef.current.position.y += (pointerY - groupRef.current.position.y) * 0.05
    })

    return (
        <group ref={groupRef}>
            {/* Front layer, faster */}
            <Sparkles
                count={80}
                scale={15}
                size={3}
                speed={0.4}
                opacity={0.3}
                color="#8b5cf6"
            />
            {/* Back layer, slower, different color */}
            <Sparkles
                count={120}
                scale={20}
                size={2}
                speed={0.2}
                opacity={0.2}
                color="#3b82f6"
            />
            {/* Green accent for the brand */}
            <Sparkles
                count={60}
                scale={12}
                size={4}
                speed={0.6}
                opacity={0.4}
                color="#10b981"
            />
        </group>
    )
}

export function ParticleBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: false, alpha: true }} // Disabled antialias for performance since particles are soft
                dpr={[1, 1.5]} // Strict limit for mobile/high-DPI
            >
                <ambientLight intensity={0.5} />
                <AnimatedParticles />
            </Canvas>
            {/* A very subtle animated gradient overlay to give it a cinematic ambient feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.1)_0%,transparent_50%)] pointer-events-none" />
        </div>
    )
}
