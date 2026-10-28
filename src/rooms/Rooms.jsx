import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Desk, Plant } from '../scenes/ClassroomScene'
import { Shell, Box, useDashTexture } from './common'

const SHIRTS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#ec4899']
const HAIRS = ['#2b211c', '#5a3b22', '#1a1a1a', '#8a5a2b', '#2b211c', '#6b3a1e']
const SKINS = ['#f0c3a0', '#e0ac85', '#f6d2b5', '#c98f68', '#f0c3a0', '#e6b894']
const person = (k) => ({ shirt: SHIRTS[k % 6], hair: HAIRS[k % 6], skin: SKINS[k % 6], seed: k * 1.7 })

/* Devordagi katta ekran */
function WallScreen({ tex, position = [0, 2.0, -3.94], size = [6, 2.5] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[size[0] + 0.3, size[1] + 0.3, 0.06]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ---------- 1. UDS Soft — ERP ofisi ---------- */
export function SoftRoom() {
  const wall = useDashTexture('erp')
  const desk = useDashTexture('erp', '#4ade80')
  const items = []
  let k = 0
  for (const z of [-0.4, 2.4]) for (const x of [-3.6, 0, 3.6]) items.push({ pos: [x, 0, z], p: person(k++) })
  return (
    <group>
      <Shell label="UDS Soft" accent="#2ecc40" />
      <WallScreen tex={wall} />
      {items.map((d, i) => (
        <Desk key={i} position={d.pos} person={d.p} tex={desk} />
      ))}
      <Plant position={[5.4, 0, -3.4]} />
    </group>
  )
}

/* ---------- 2. UDS Market — ombor va savdo ---------- */
function Rack({ position, seed = 0 }) {
  const cols = ['#c9a36b', '#b88b52', '#d8b27a', '#a8793f']
  return (
    <group position={position}>
      <Box position={[0, 1.2, 0]} size={[2.4, 0.06, 0.8]} color="#3b6ea5" />
      {[0.25, 1.05, 1.85].map((y, r) => (
        <group key={y}>
          <Box position={[0, y, 0]} size={[2.4, 0.06, 0.8]} color="#3b6ea5" />
          {[-0.85, -0.3, 0.25, 0.8].map((x, i) => (
            <Box
              key={i}
              position={[x, y + 0.28, 0]}
              size={[0.42 + ((i + r + seed) % 2) * 0.1, 0.5, 0.6]}
              color={cols[(i + r + seed) % 4]}
            />
          ))}
        </group>
      ))}
      {[-1.2, 1.2].map((x) => (
        <Box key={x} position={[x, 1.1, 0]} size={[0.08, 2.2, 0.8]} color="#e8892b" />
      ))}
    </group>
  )
}

function Pallet({ position, color = '#9aa0a8', height = 4 }) {
  return (
    <group position={position}>
      <Box position={[0, 0.08, 0]} size={[1.3, 0.16, 1.0]} color="#a07a45" />
      {Array.from({ length: height }).map((_, i) => (
        <Box key={i} position={[0, 0.3 + i * 0.28, 0]} size={[1.1, 0.26, 0.8]} color={color} />
      ))}
    </group>
  )
}

function RebarBundle({ position }) {
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      {[-0.12, 0, 0.12].map((y, r) =>
        [-0.12, 0, 0.12].map((z, c) => (
          <mesh key={r + '-' + c} position={[0, 0.2 + y + r * 0.0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
            <meshStandardMaterial color="#6b4a3a" roughness={0.6} />
          </mesh>
        ))
      )}
    </group>
  )
}

export function SupplyRoom() {
  const screen = useDashTexture('orders')
  const small = useDashTexture('orders', '#4ade80')
  return (
    <group>
      <Shell label="UDS Market" accent="#f59e0b" />
      <WallScreen tex={screen} position={[0, 2.4, -3.94]} size={[4.2, 1.8]} />
      <Rack position={[-4.4, 0, -3.3]} seed={0} />
      <Rack position={[4.4, 0, -3.3]} seed={1} />
      <Pallet position={[-3.8, 0, 0.2]} color="#9aa0a8" height={4} />
      <Pallet position={[-2.3, 0, 0.2]} color="#cfd3d8" height={3} />
      <Pallet position={[2.6, 0, 0.4]} color="#e0b97a" height={5} />
      <RebarBundle position={[0.6, 0, 1.2]} />
      <Desk position={[-1.2, 0, 2.7]} person={person(1)} tex={small} />
      <Desk position={[2.6, 0, 2.7]} person={person(4)} tex={small} />
      <Plant position={[5.4, 0, 3.0]} />
    </group>
  )
}

/* ---------- 3. Logistika — yuk mashinasi, konveyer, xarita ---------- */
function Truck({ position }) {
  const g = useRef()
  const wheels = useRef([])
  useFrame((s) => {
    if (g.current) g.current.position.y = Math.sin(s.clock.elapsedTime * 6) * 0.015
    wheels.current.forEach((w) => w && (w.rotation.x -= 0.05))
  })
  return (
    <group position={position}>
      <group ref={g}>
        <Box position={[0, 1.15, 0]} size={[3.6, 1.7, 1.5]} color="#f1f3f5" />
        <Box position={[0, 1.15, 0.76]} size={[3.6, 0.28, 0.02]} color="#2ecc40" />
        <Box position={[2.3, 0.8, 0]} size={[1.1, 1.1, 1.5]} color="#2ecc40" />
        <Box position={[2.62, 1.05, 0]} size={[0.5, 0.45, 1.4]} color="#bfe3f5" rough={0.3} />
        {[-1.2, 1.2, 2.4].map((x, i) => (
          <group key={x}>
            {[-0.8, 0.8].map((z, j) => (
              <mesh
                key={z}
                ref={(el) => (wheels.current[i * 2 + j] = el)}
                position={[x, 0.28, z]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.28, 0.28, 0.2, 14]} />
                <meshStandardMaterial color="#1f2328" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}

function Conveyor({ position }) {
  const parcels = useRef([])
  useFrame((s) => {
    parcels.current.forEach((p, i) => {
      if (!p) return
      const u = (s.clock.elapsedTime * 0.12 + i / 5) % 1
      p.position.x = -2.8 + u * 5.6
    })
  })
  return (
    <group position={position}>
      <Box position={[0, 0.7, 0]} size={[6, 0.14, 0.9]} color="#2b2f36" />
      {[-2.7, 0, 2.7].map((x) => (
        <Box key={x} position={[x, 0.35, 0]} size={[0.1, 0.7, 0.8]} color="#5c6168" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} ref={(el) => (parcels.current[i] = el)} position={[0, 0.98, 0]}>
          <boxGeometry args={[0.5, 0.42, 0.5]} />
          <meshStandardMaterial color={['#c9a36b', '#d8b27a', '#b88b52'][i % 3]} />
        </mesh>
      ))}
    </group>
  )
}

export function LogisticsRoom() {
  const map = useDashTexture('map', '#2ecc40')
  const desk = useDashTexture('map', '#4ade80')
  return (
    <group>
      <Shell label="Logistika" accent="#38bdf8" floor="#b9bec4" />
      <WallScreen tex={map} />
      {/* yo'l belgisi chiziqlari */}
      {[-3, -1, 1].map((x) => (
        <Box key={x} position={[x, 0.01, 0.9]} size={[1.2, 0.02, 0.12]} color="#f5f5f5" />
      ))}
      <Truck position={[-2.3, 0, 1.2]} />
      <Conveyor position={[0.2, 0, -2.2]} />
      <Desk position={[-3.6, 0, 3.0]} person={person(2)} tex={desk} />
      <Desk position={[0, 0, 3.0]} person={person(5)} tex={desk} />
      <Pallet position={[4.4, 0, 0.4]} color="#e0b97a" height={3} />
      <Plant position={[5.4, 0, -3.4]} />
    </group>
  )
}
