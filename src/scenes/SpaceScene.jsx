import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Stars, useTexture } from '@react-three/drei'
import { MathUtils } from 'three'

const TEX = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/'
const LAT = MathUtils.degToRad(40.5)      // Guliston kengligi
const LON = 68.8                          // Guliston uzunligi
const TARGET_Y = MathUtils.degToRad(-90 - LON)

// Yer yuzasidagi nuqta (Guliston belgisi uchun)
const pin = [
    1.5 * Math.cos(LAT) * Math.cos(MathUtils.degToRad(LON)),
    1.5 * Math.sin(LAT),
    -1.5 * Math.cos(LAT) * Math.sin(MathUtils.degToRad(LON)),
]
export default function SpaceScene() {
    const scroll = useScroll()
    const system = useRef()
    const earth = useRef()
    const moon = useRef()
    const sat = useRef()

    const [earthMap, moonMap] = useTexture([
        TEX + 'earth_atmos_2048.jpg',
        TEX + 'moon_1024.jpg',
    ])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        const p = MathUtils.clamp(scroll.offset / 0.4, 0, 1)

        // Boshida Yer aylanib turadi, scroll bilan Guliston kameraga buriladi
        let spin = (t * 0.08) % (Math.PI * 2)
        if (spin > Math.PI) spin -= Math.PI * 2
        const k = MathUtils.smoothstep(p, 0.05, 0.6)   // 0 = erkin aylanish, 1 = Guliston oldida
        earth.current.rotation.set(
            MathUtils.lerp(0.4, LAT, k),
            TARGET_Y + spin * (1 - k),
            0
        )

        moon.current.position.set(
            Math.cos(t * 0.3) * 4.2,
            Math.sin(t * 0.3) * 0.6,
            Math.sin(t * 0.3) * 4.2
        )

        const a = t * 0.9
        const r = 2.4
        sat.current.position.set(
            Math.cos(a) * r,
            Math.sin(a) * r * 0.4,
            Math.sin(a) * r * 0.9
        )
        sat.current.rotation.y = -a

        const move = MathUtils.clamp(p / 0.25, 0, 1)
        system.current.position.x = 2.6 * (1 - move)
    })

    return (
        <>
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 3, 6]} intensity={2.2} />
            <Stars radius={80} depth={40} count={3000} factor={4} fade />

            <group ref={system} position={[2.6, 0, 0]}>
                
                <mesh ref={earth}>
                    <sphereGeometry args={[1.5, 64, 64]} />
                    <meshStandardMaterial map={earthMap} roughness={0.9} />

                    {/* GULISTON belgisi */}
                    <mesh position={pin}>
                        <sphereGeometry args={[0.025, 16, 16]} />
                        <meshBasicMaterial color="#2ecc40" toneMapped={false} />
                    </mesh>
                    <mesh position={pin}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshBasicMaterial color="#2ecc40" transparent opacity={0.3} toneMapped={false} />
                    </mesh>
                </mesh>

                <mesh ref={moon}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshStandardMaterial map={moonMap} roughness={1} />
                </mesh>

                <group ref={sat}>
                    <mesh>
                        <boxGeometry args={[0.16, 0.16, 0.16]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.3} />
                    </mesh>
                    <mesh position={[-0.3, 0, 0]}>
                        <boxGeometry args={[0.4, 0.02, 0.16]} />
                        <meshStandardMaterial color="#2ecc40" metalness={0.5} roughness={0.4} />
                    </mesh>
                    <mesh position={[0.3, 0, 0]}>
                        <boxGeometry args={[0.4, 0.02, 0.16]} />
                        <meshStandardMaterial color="#2ecc40" metalness={0.5} roughness={0.4} />
                    </mesh>
                </group>
            </group>
        </>
    )
}