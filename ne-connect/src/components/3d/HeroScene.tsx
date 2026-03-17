"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial, Environment, Edges, ContactShadows } from "@react-three/drei"
import { useRef } from "react"
import { useInView } from "framer-motion"
import * as THREE from "three"

function PremiumGeometry() {
    const groupRef = useRef<THREE.Group>(null!)
    const { pointer } = useThree()

    useFrame((state) => {
        if (!groupRef.current) return

        // Smooth parallax based on mouse
        const targetX = (pointer.x * 2)
        const targetY = (pointer.y * 2)

        groupRef.current.rotation.y += 0.005
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05
    })

    return (
        <group ref={groupRef}>
            {/* Center piece - Abstract Glass Crystal */}
            <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
                <mesh position={[0, 0, 0]} scale={2.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={2} // Reduced from 4 for performance
                        resolution={256} // Fixed low resolution for blur
                        thickness={2}
                        chromaticAberration={0.05}
                        anisotropy={0.1}
                        distortion={0.2}
                        distortionScale={0.5}
                        temporalDistortion={0.1}
                        iridescence={1}
                        iridescenceIOR={1}
                        iridescenceThicknessRange={[0, 1400]}
                        clearcoat={1}
                    />
                    <Edges scale={1.05} threshold={15} color="rgba(255,255,255,0.2)" />
                </mesh>
            </Float>

            {/* Orbiting Elements representing different services */}
            <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[4, 2, -2]} scale={0.8} rotation={[0.5, 0.2, 0]}>
                    <torusGeometry args={[1, 0.3, 16, 32]} />
                    <MeshTransmissionMaterial backside thickness={1} chromaticAberration={0.1} color="#8b5cf6" />
                </mesh>
            </Float>

            <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2.5}>
                <mesh position={[-3, -2, 1]} scale={1}>
                    <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
                    <MeshTransmissionMaterial backside thickness={1} chromaticAberration={0.1} color="#10b981" />
                </mesh>
            </Float>

            <Float speed={2} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[-4, 3, -4]} scale={0.6}>
                    <octahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial backside thickness={1} chromaticAberration={0.1} color="#3b82f6" />
                </mesh>
            </Float>

            <Float speed={1.2} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[3, -3, -3]} scale={1.2}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#3b82f6" wireframe opacity={0.15} transparent />
                </mesh>
            </Float>
        </group>
    )
}

export function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { margin: "200px" })

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 opacity-80 mix-blend-screen transition-opacity duration-1000">
            {isInView && (
                <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
                    {/* Colored lights to accent the glass */}
                    <pointLight position={[-10, 0, -5]} intensity={5} color="#8b5cf6" />
                    <pointLight position={[10, -5, 5]} intensity={5} color="#10b981" />

                    <Environment files="/potsdamer_platz_1k.hdr" />

                    <PremiumGeometry />

                    <ContactShadows
                        position={[0, -4, 0]}
                        opacity={0.4}
                        scale={20}
                        blur={2}
                        far={10}
                        resolution={128} // Reduced from 256 for performance
                        color="#000000"
                    />
                </Canvas>
            )}
            {/* Soft Overlay to blend with UI */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-[#030712]/50 dark:to-[#030712] pointer-events-none z-10"></div>
        </div>
    )
}
