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
            {/* Center piece - Abstract Sleek Glass Knot (Light Theme) */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[0, 0, 0]} scale={1.8}>
                    <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={3}
                        resolution={256}
                        thickness={2}
                        chromaticAberration={0.05}
                        anisotropy={0.2}
                        distortion={0}
                        distortionScale={0}
                        temporalDistortion={0}
                        iridescence={0.8}
                        iridescenceIOR={1.1}
                        iridescenceThicknessRange={[100, 400]}
                        clearcoat={1}
                        color="#ffffff"
                    />
                    <Edges scale={1.01} threshold={30} color="rgba(0,0,0,0.05)" />
                </mesh>
            </Float>

            {/* Orbiting Sleek Rings (Luxe Stone Theme) */}
            <Float speed={1} rotationIntensity={1} floatIntensity={0.5}>
                <mesh position={[3, 1.5, -2]} scale={1.5} rotation={[0.4, 0.2, 0]}>
                    <torusGeometry args={[1, 0.02, 16, 64]} />
                    <meshStandardMaterial color="#9C8E7C" metalness={0.6} roughness={0.1} />
                </mesh>
            </Float>

            <Float speed={1.2} rotationIntensity={1.5} floatIntensity={0.5}>
                <mesh position={[-3, -1, 1]} scale={2} rotation={[-0.2, 0.5, 0.1]}>
                    <torusGeometry args={[1, 0.01, 16, 64]} />
                    <meshStandardMaterial color="#78716C" metalness={0.4} roughness={0.1} />
                </mesh>
            </Float>
        </group>
    )
}

export function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { margin: "200px" })

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 opacity-100 transition-opacity duration-1000">
            {isInView && (
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
                    <ambientLight intensity={1.5} color="#ffffff" />
                    <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" castShadow />
                    
                    {/* Professional Accent Lights (Stone/Champagne) */}
                    <pointLight position={[-8, 2, -5]} intensity={6} color="#9C8E7C" />
                    <pointLight position={[8, -2, 5]} intensity={4} color="#78716C" />

                    <Environment files="/potsdamer_platz_1k.hdr" background blur={1} />

                    <PremiumGeometry />

                    <ContactShadows
                        position={[0, -3.5, 0]}
                        opacity={0.15}
                        scale={15}
                        blur={2.5}
                        far={5}
                        resolution={256}
                        color="#3A332E"
                    />
                </Canvas>
            )}
            {/* Professional blend overlay (Luxe Stone Theme) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/40 via-[#FAF9F6]/80 to-[#FAF9F6] pointer-events-none z-10"></div>
        </div>
    )
}
