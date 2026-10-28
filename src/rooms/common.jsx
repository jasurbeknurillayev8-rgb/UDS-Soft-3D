import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Matn yozilgan tekstura (devordagi yozuv uchun) */
export function useLabelTexture(text, color = '#2ecc40', bg = '#16191d') {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 280
    const g = c.getContext('2d')
    g.fillStyle = bg
    g.fillRect(0, 0, 1024, 280)
    g.fillStyle = color
    g.font = 'bold 130px Arial'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(text, 512, 150)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [text, color, bg])
}

/* Jonli dashboard teksturasi: 'erp' (ustunlar), 'orders' (ro'yxat), 'map' (xarita + yuk) */
export function useDashTexture(mode = 'erp', accent = '#2ecc40') {
  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return { canvas, tex }
  }, [])
  const last = useRef(-1)

  useFrame((state) => {
    const frame = Math.floor(state.clock.elapsedTime * 8)
    if (frame === last.current) return
    last.current = frame
    const t = state.clock.elapsedTime
    const g = canvas.getContext('2d')
    g.fillStyle = '#0d1117'
    g.fillRect(0, 0, 1024, 512)
    g.fillStyle = accent
    g.font = 'bold 40px Arial'

    if (mode === 'erp') {
      g.fillText('UDS Soft · ERP', 30, 56)
      for (let i = 0; i < 9; i++) {
        const h = 90 + (Math.sin(t * 1.4 + i * 0.9) * 0.5 + 0.5) * 230
        g.fillStyle = i % 3 === 0 ? accent : '#1f6f2c'
        g.fillRect(40 + i * 100, 470 - h, 70, h)
      }
      g.fillStyle = '#9fb0bf'
      g.font = '26px Arial'
      g.fillText('Ombor · Moliya · Buyurtmalar', 560, 56)
    } else if (mode === 'orders') {
      g.fillText('UDS Market', 30, 56)
      const rows = ['Sement M400 — 50 qop', 'Armatura Ø12 — 2 tonna', 'Gipsokarton — 100 dona', 'Beton B25 — 8 m³', 'Kafel — 40 m²']
      const st = ['Faol', "Yo'lda", 'Yetkazildi']
      g.font = '32px Arial'
      rows.forEach((r, i) => {
        const y = 120 + i * 70
        g.fillStyle = '#e6edf3'
        g.fillText('#' + (4821 - i) + '  ' + r, 40, y)
        g.fillStyle = i === Math.floor(t) % 5 ? '#f5b301' : accent
        g.fillText(st[(i + Math.floor(t / 2)) % 3], 790, y)
      })
    } else {
      g.fillText('Yetkazib berish · jonli xarita', 30, 56)
      const pts = [[120, 360], [300, 250], [470, 300], [650, 190], [860, 260]]
      g.strokeStyle = '#2b3b4a'
      g.lineWidth = 6
      g.beginPath()
      pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])))
      g.stroke()
      pts.forEach((p) => {
        g.fillStyle = '#1f6f2c'
        g.beginPath()
        g.arc(p[0], p[1], 14, 0, Math.PI * 2)
        g.fill()
      })
      const u = (t * 0.18) % 1
      const seg = Math.min(Math.floor(u * 4), 3)
      const k = u * 4 - seg
      const x = pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * k
      const y = pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * k
      g.fillStyle = '#f5b301'
      g.beginPath()
      g.arc(x, y, 22, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = '#e6edf3'
      g.font = '28px Arial'
      g.fillText('TRK-9284-0017  ·  24 soat ichida', 40, 470)
    }
    tex.needsUpdate = true
  })

  return tex
}

/* Har bir xonaning umumiy qobig'i: pol, orqa va chap devor, aksent chiziq, yozuv, derazalar */
export function Shell({ label, accent = '#2ecc40', wall = '#eef0f2', floor = '#c4c7cc' }) {
  const sign = useLabelTexture(label, accent)
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[12, 0.2, 8]} />
        <meshStandardMaterial color={floor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, -4.1]}>
        <boxGeometry args={[12.4, 3.4, 0.2]} />
        <meshStandardMaterial color={wall} roughness={0.9} />
      </mesh>
      <mesh position={[-6.1, 1.7, 0]}>
        <boxGeometry args={[0.2, 3.4, 8.4]} />
        <meshStandardMaterial color="#e3e6e9" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.09, -3.97]}>
        <boxGeometry args={[12, 0.18, 0.06]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[-5.97, 2.9, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.4, 0.9]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {[1.6, 3.2].map((z) => (
        <group key={z} position={[-5.97, 1.7, z]}>
          <mesh>
            <boxGeometry args={[0.06, 1.2, 1.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.02, 1.0, 1.1]} />
            <meshStandardMaterial color="#bfe3f5" emissive="#9fd3ee" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 12, 6]} intensity={1.6} />
    </group>
  )
}

/* Oddiy quti */
export function Box({ position, size, color, rough = 0.85, ...rest }) {
  return (
    <mesh position={position} {...rest}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={rough} />
    </mesh>
  )
}
