import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ORIGIN = [200, 0, 0]

const FULL = [
    'const academy = {',
    '  name: "UDS Group",',
    '  city: "Sirdaryo",',
    '  courses: ["Web", "Python", "React"],',
    '};',
    '',
    'function start() {',
    '  return academy.courses.map(c =>',
    '    `${c}: amaliy kurs`',
    '  );',
    '}',
].join('\n')

/* ---------- Kod yozilish animatsiyasi (doska, monitor, noutbuk) ---------- */
export function useCodeTexture() {
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
        const total = FULL.length + 40
        const n = Math.floor((state.clock.elapsedTime * 16) % total)
        const shown = Math.min(n, FULL.length)
        if (shown === last.current) return
        last.current = shown

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#0d1117'
        ctx.fillRect(0, 0, 1024, 512)
        ctx.fillStyle = '#2ecc40'
        ctx.font = '36px monospace'
        FULL.slice(0, shown)
            .split('\n')
            .forEach((line, i) => ctx.fillText(line, 30, 60 + i * 42))
        tex.needsUpdate = true
    })

    return tex
}

const lerp = THREE.MathUtils.lerp
const LIFT = 0.48 // turganda tana qancha ko'tariladi

export function Chair({ position = [0, 0, 0], rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.56, 0.07, 0.5]} />
        <meshStandardMaterial color="#2b2f36" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.88, 0.27]}>
        <boxGeometry args={[0.56, 0.7, 0.06]} />
        <meshStandardMaterial color="#2b2f36" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.48, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 12]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  )
}

/* standRef bo'lsa: odam o'tirgan (0) dan turgan (1) holatga o'tadi.
   shift = turganda yon tomonga qancha siljiydi, turn = qancha buriladi */
export function Person({
  position = [0, 0, 0],
  rotationY = 0,
  shirt = '#3b82f6',
  pants = '#38404c',
  hair = '#2b211c',
  skin = '#f0c3a0',
  glasses = false,
  seed = 0,
  look = 0.25,
  standRef,
  shift = 0,
  turn = 0,
}) {
  const outer = useRef()
  const upper = useRef()
  const head = useRef()
  const body = useRef()
  const armL = useRef()
  const armR = useRef()
  const thighL = useRef()
  const thighR = useRef()
  const shinL = useRef()
  const shinR = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime + seed
    const s = standRef ? standRef.current : 0
    const sit = 1 - s

    outer.current.position.x = position[0] + shift * s
    outer.current.rotation.y = rotationY + turn * s
    upper.current.position.y = LIFT * s

    head.current.rotation.y = Math.sin(t * 0.6) * look
    head.current.rotation.x = Math.sin(t * 1.1) * 0.05
    body.current.scale.y = 1 + Math.sin(t * 1.8) * 0.015

    // Qo'llar: o'tirganda yozadi, turganda bittasi pastda, ikkinchisi qo'l silkitadi
    armL.current.rotation.set(lerp(1.1 + Math.sin(t * 10) * 0.05, 0.08, s), 0, 0)
    armR.current.rotation.set(lerp(1.1 + Math.cos(t * 9) * 0.05, 0, s), 0, s * (2.4 + Math.sin(t * 6) * 0.25))

    // Oyoqlar
    ;[thighL, thighR].forEach((r) => {
      r.current.rotation.x = (Math.PI / 2) * sit
      r.current.position.y = lerp(0.6, 1.08, s)
    })
    ;[shinL, shinR].forEach((r) => {
      r.current.rotation.x = -(Math.PI / 2) * sit
    })
  })

  return (
    <group ref={outer} position={position} rotation={[0, rotationY, 0]}>
      <group ref={upper}>
        {/* Tana */}
        <mesh ref={body} position={[0, 0.95, 0]}>
          <capsuleGeometry args={[0.2, 0.35, 6, 12]} />
          <meshStandardMaterial color={shirt} roughness={0.9} />
        </mesh>

        {/* Qo'llar */}
        {[
          [-0.27, armL],
          [0.27, armR],
        ].map(([x, ref], i) => (
          <group key={i} ref={ref} position={[x, 1.2, 0]} rotation={[1.1, 0, 0]}>
            <mesh position={[0, -0.35, 0]}>
              <capsuleGeometry args={[0.06, 0.58, 4, 8]} />
              <meshStandardMaterial color={shirt} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.73, 0]}>
              <sphereGeometry args={[0.065, 10, 10]} />
              <meshStandardMaterial color={skin} roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Bosh */}
        <group ref={head} position={[0, 1.58, 0]}>
          <mesh>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color={skin} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.015, 0.02]}>
            <sphereGeometry args={[0.256, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color={hair} roughness={1} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.24, -0.01, 0]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color={skin} roughness={0.9} />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.085, 0.01, -0.215]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color="#1a1a1a" />
            </mesh>
          ))}
          {glasses &&
            [-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.085, 0.01, -0.228]}>
                <torusGeometry args={[0.055, 0.009, 8, 20]} />
                <meshStandardMaterial color="#222" />
              </mesh>
            ))}
        </group>
      </group>

      {/* Oyoqlar: son + boldir */}
      {[
        [-0.11, thighL, shinL],
        [0.11, thighR, shinR],
      ].map(([x, th, sh], i) => (
        <group key={i} ref={th} position={[x, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.09, 0.3, 4, 8]} />
            <meshStandardMaterial color={pants} roughness={0.9} />
          </mesh>
          <group ref={sh} position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, -0.25, 0]}>
              <capsuleGeometry args={[0.08, 0.34, 4, 8]} />
              <meshStandardMaterial color={pants} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.54, -0.05]}>
              <boxGeometry args={[0.16, 0.1, 0.28]} />
              <meshStandardMaterial color="#f4f4f4" roughness={0.8} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

/* ---------- O'quvchi stoli ---------- */
export function Desk({ position, person, tex }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 0.08, 0.9]} />
        <meshStandardMaterial color="#9aa0a8" roughness={0.8} />
      </mesh>
      {[[-1, -0.35], [1, -0.35], [-1, 0.35], [1, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#5c6168" />
        </mesh>
      ))}
      <mesh position={[0, 0.94, -0.15]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 1.12, -0.15]}>
        <boxGeometry args={[0.74, 0.46, 0.05]} />
        <meshStandardMaterial color="#1b1f24" />
      </mesh>
      <mesh position={[0, 1.12, -0.122]}>
        <planeGeometry args={[0.66, 0.33]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.85, 0.22]}>
        <boxGeometry args={[0.5, 0.03, 0.18]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <Chair position={[0, 0, 0.9]} />
      <Person position={[0, 0, 0.9]} {...person} />
    </group>
  )
}

/* ---------- Ustoz stoli ---------- */
function TeacherStation({ position, tex, standRef }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.0, 0.08, 0.8]} />
        <meshStandardMaterial color="#b08a5a" roughness={0.8} />
      </mesh>
      {[[-0.9, -0.33], [0.9, -0.33], [-0.9, 0.33], [0.9, 0.33]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#6e5232" />
        </mesh>
      ))}

      {/* Noutbuk */}
      <mesh position={[0, 0.85, -0.02]}>
        <boxGeometry args={[0.6, 0.025, 0.4]} />
        <meshStandardMaterial color="#c9ccd1" metalness={0.5} roughness={0.4} />
      </mesh>
      <group position={[0, 0.86, 0.18]} rotation={[0.25, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.025]} />
          <meshStandardMaterial color="#c9ccd1" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, -0.014]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.54, 0.34]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>

      {/* Krujka */}
      <mesh position={[0.7, 0.88, -0.1]}>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 12]} />
        <meshStandardMaterial color="#2ecc40" />
      </mesh>

      <Chair position={[0, 0, -0.85]} rotationY={Math.PI} />
      <Person
        position={[0, 0, -0.85]}
        rotationY={Math.PI}
        shirt="#2ecc40"
        pants="#2b2f36"
        hair="#4a3426"
        skin="#e9b98f"
        glasses
        look={0.45}
        seed={3}
        standRef={standRef}
        shift={1.45}
        turn={0.35}
      />
    </group>
  )
}
export function Plant({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.3, 0.25, 0.4, 10]} />
                <meshStandardMaterial color="#c0763a" roughness={0.9} />
            </mesh>
            {[[0, 0.9, 0], [-0.15, 0.75, 0.1], [0.15, 0.75, -0.1]].map((p, i) => (
                <mesh key={i} position={p}>
                    <coneGeometry args={[0.16, 0.9, 6]} />
                    <meshStandardMaterial color="#2e9e45" roughness={0.9} />
                </mesh>
            ))}
        </group>
    )
}

/* ---------- SHAHAR ---------- */
function rng(seed) {
    return () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function Tree({ position, scale = 1, color }) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.1, 0.14, 0.8, 6]} />
                <meshStandardMaterial color="#7a5230" roughness={1} />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
                <icosahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial color={color} flatShading roughness={1} />
            </mesh>
        </group>
    )
}

function Wheel({ position, wheelRef }) {
  return (
    <group position={position} ref={wheelRef}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Shina */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.14, 18]} />
          <meshStandardMaterial color="#1a1a1a" roughness={1} />
        </mesh>
        {/* Disk va spitsalar (ikki tomonda) */}
        {[0.072, -0.072].map((y) => (
          <group key={y} position={[0, y, 0]}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.12, 0.012, 14]} />
              <meshStandardMaterial color="#cfd3d8" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.22, 0.02, 0.035]} />
              <meshStandardMaterial color="#6b7078" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.22, 0.02, 0.035]} />
              <meshStandardMaterial color="#6b7078" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function Car({ color, speed, offset, dir, lane }) {
  const ref = useRef()
  const wheels = useRef([])

  useFrame((state) => {
    const dist = state.clock.elapsedTime * speed + offset
    ref.current.position.x = dir * ((dist % 90) - 45)
    const spin = -dist / 0.2 // g'ildirak radiusi 0.2
    wheels.current.forEach((w) => {
      if (w) w.rotation.z = spin
    })
  })

  const glass = '#1d2b3a'

  return (
    <group ref={ref} position={[0, 0.04, lane]} rotation={[0, dir > 0 ? 0 : Math.PI, 0]}>
      {/* Kuzov */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.5, 0.3, 0.76]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Kapot va bagajnik (biroz pastroq) */}
      <mesh position={[0.55, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.72]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0.4, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.72]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Kabina */}
      <mesh position={[-0.1, 0.55, 0]}>
        <boxGeometry args={[0.82, 0.3, 0.66]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Tom */}
      <mesh position={[-0.1, 0.71, 0]}>
        <boxGeometry args={[0.7, 0.03, 0.6]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>

      {/* Oynalar */}
      <mesh position={[-0.1, 0.56, 0]}>
        <boxGeometry args={[0.66, 0.2, 0.68]} />
        <meshStandardMaterial color={glass} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0.31, 0.56, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.58]} />
        <meshStandardMaterial color={glass} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[-0.51, 0.56, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.58]} />
        <meshStandardMaterial color={glass} roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Oyna ustunlari (eshiklar orasi) */}
      <mesh position={[-0.1, 0.56, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.69]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Eshik chizig'i */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.1, 0.25, s * 0.382]}>
          <boxGeometry args={[0.02, 0.22, 0.005]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}

      {/* Yon ko'zgular */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.2, 0.48, s * 0.4]}>
          <boxGeometry args={[0.08, 0.06, 0.06]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

      {/* Old chiroqlar */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.755, 0.27, s * 0.26]}>
          <boxGeometry args={[0.03, 0.1, 0.16]} />
          <meshBasicMaterial color="#fff3b0" toneMapped={false} />
        </mesh>
      ))}
      {/* Orqa chiroqlar */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.755, 0.27, s * 0.28]}>
          <boxGeometry args={[0.03, 0.09, 0.14]} />
          <meshBasicMaterial color="#e11d2e" toneMapped={false} />
        </mesh>
      ))}

      {/* Bamperlar */}
      <mesh position={[0.77, 0.12, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.8]} />
        <meshStandardMaterial color="#2a2d33" roughness={0.8} />
      </mesh>
      <mesh position={[-0.77, 0.12, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.8]} />
        <meshStandardMaterial color="#2a2d33" roughness={0.8} />
      </mesh>

      {/* Nomer taxtachalari */}
      <mesh position={[0.8, 0.12, 0]}>
        <boxGeometry args={[0.01, 0.07, 0.24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.8, 0.12, 0]}>
        <boxGeometry args={[0.01, 0.07, 0.24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* G'ildiraklar */}
      {[
        [0.48, 0, 0.38],
        [0.48, 0, -0.38],
        [-0.48, 0, 0.38],
        [-0.48, 0, -0.38],
      ].map((p, i) => (
        <Wheel key={i} position={p} wheelRef={(el) => (wheels.current[i] = el)} />
      ))}
    </group>
  )
}

function Road({ position, rotationY = 0 }) {
    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            <mesh position={[0, -0.18, 0]}>
                <boxGeometry args={[130, 0.04, 3.4]} />
                <meshStandardMaterial color="#4b4f56" roughness={1} />
            </mesh>
            {Array.from({ length: 40 }, (_, i) => (
                <mesh key={i} position={[-60 + i * 3, -0.155, 0]}>
                    <boxGeometry args={[1.2, 0.01, 0.12]} />
                    <meshStandardMaterial color="#f2f2f2" />
                </mesh>
            ))}
            <Car color="#e4572e" speed={4} offset={10} dir={1} lane={0.85} />
            <Car color="#3b82f6" speed={3} offset={55} dir={1} lane={0.85} />
            <Car color="#f2b705" speed={3.5} offset={30} dir={-1} lane={0.85} />
        </group>
    )
}

function makeWindowTexture() {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 128
    const g = c.getContext('2d')
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, 128, 128)
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            g.fillStyle = Math.random() < 0.3 ? '#ffe3a0' : '#8fb3cf'
            g.fillRect(10 + i * 60, 10 + j * 60, 42, 42)
        }
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    return t
}

function Lamp({ position, rotationY = 0 }) {
    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.05, 0.07, 3, 8]} />
                <meshStandardMaterial color="#3a3f46" />
            </mesh>
            <mesh position={[0.35, 3, 0]}>
                <boxGeometry args={[0.8, 0.06, 0.06]} />
                <meshStandardMaterial color="#3a3f46" />
            </mesh>
            <mesh position={[0.7, 2.93, 0]}>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshBasicMaterial color="#fff3b0" toneMapped={false} />
            </mesh>
        </group>
    )
}

function City() {
    const { trees, buildings } = useMemo(() => {
        const r = rng(7)
        const greens = ['#4f9d5b', '#5fae62', '#3f8a52', '#74b86a']

        const trees = []
        for (let i = 0; i < 400 && trees.length < 55; i++) {
            const x = (r() - 0.5) * 70
            const z = -24 + r() * 56
            const inRoom = Math.abs(x) < 7.8 && Math.abs(z) < 5.8
            const onRoad = Math.abs(z + 9) < 2.6 || Math.abs(x + 11) < 2.6
            const inBuildings = z < -13 || x < -15
            if (inRoom || onRoad || inBuildings) continue
            trees.push({
                pos: [x, -0.2, z],
                scale: 0.8 + r() * 0.7,
                color: greens[Math.floor(r() * greens.length)],
            })
        }

        const baseTex = makeWindowTexture()
        const palette = ['#e8d9c0', '#d9c7a8', '#c9d3da', '#e3b9a6', '#b8c7a3', '#d8d2e0']
        const buildings = []

        const add = (x, z) => {
            const w = 4.5 + r() * 2.5
            const d = 4.5 + r() * 2.5
            const h = 4 + r() * 10

            // Yo'llarga tegsa, qo'ymaymiz
            const onBackRoad = Math.abs(z + 9) < d / 2 + 2.2
            const onLeftRoad = Math.abs(x + 11) < w / 2 + 2.2
            if (onBackRoad || onLeftRoad) return

            const tex = baseTex.clone()
            tex.repeat.set(Math.max(1, Math.round((w + d) / 4.8)), Math.max(1, Math.round(h / 3)))
            tex.needsUpdate = true

            buildings.push({
                pos: [x, h / 2 - 0.2, z],
                size: [w, h, d],
                color: palette[Math.floor(r() * palette.length)],
                tex,
            })
        }

        for (const z of [-17, -27]) for (let x = -44; x <= 44; x += 8) add(x + (r() - 0.5) * 2, z)
        for (const x of [-19, -29]) for (let z = -1; z <= 33; z += 8) add(x, z + (r() - 0.5) * 2)

        return { trees, buildings }
    }, [])

    return (
        <group>
            {/* Yer */}
            <mesh position={[0, -0.3, 0]}>
                <boxGeometry args={[160, 0.2, 160]} />
                <meshStandardMaterial color="#b9cfa0" roughness={1} />
            </mesh>

            <Road position={[0, 0, -9]} />
            <Road position={[-11, 0, 0]} rotationY={Math.PI / 2} />

            {/* Ko'cha chiroqlari */}
            {Array.from({ length: 9 }, (_, i) => -40 + i * 10)
                .filter((x) => Math.abs(x + 11) > 3)
                .map((x) => (
                    <Lamp key={'b' + x} position={[x, -0.2, -6.9]} rotationY={Math.PI / 2} />
                ))}
            {Array.from({ length: 4 }, (_, i) => -4 + i * 10).map((z) => (
                <Lamp key={'l' + z} position={[-8.6, -0.2, z]} rotationY={Math.PI} />
            ))}

            {trees.map((t, i) => (
                <Tree key={i} position={t.pos} scale={t.scale} color={t.color} />
            ))}

            {/* Binolar (derazali) */}
            {buildings.map((b, i) => (
                <mesh key={i} position={b.pos}>
                    <boxGeometry args={b.size} />
                    {[0, 1, 4, 5].map((n) => (
                        <meshStandardMaterial key={n} attach={`material-${n}`} color={b.color} map={b.tex} roughness={0.9} />
                    ))}
                    {[2, 3].map((n) => (
                        <meshStandardMaterial key={n} attach={`material-${n}`} color="#8d8f94" roughness={0.9} />
                    ))}
                </mesh>
            ))}
        </group>
    )
}

/* ---------- ASOSIY SAHNA ---------- */
const SHIRTS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#ec4899']
const HAIRS = ['#2b211c', '#5a3b22', '#1a1a1a', '#8a5a2b', '#2b211c', '#6b3a1e']
const SKINS = ['#f0c3a0', '#e0ac85', '#f6d2b5', '#c98f68', '#f0c3a0', '#e6b894']
function RoomDetails() {
    const minute = useRef()
    const hour = useRef()

    useFrame(() => {
        const d = new Date()
        minute.current.rotation.z = -((d.getMinutes() + d.getSeconds() / 60) / 60) * Math.PI * 2
        hour.current.rotation.z = -(((d.getHours() % 12) + d.getMinutes() / 60) / 12) * Math.PI * 2
    })

    // "UDS Academy" yozuvi
    const signTex = useMemo(() => {
        const c = document.createElement('canvas')
        c.width = 1024
        c.height = 280
        const g = c.getContext('2d')
        g.fillStyle = '#16191d'
        g.fillRect(0, 0, 1024, 280)
        g.fillStyle = '#2ecc40'
        g.font = 'bold 150px Arial'
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText('UDS Academy', 512, 150)
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        return t
    }, [])

    const bookColors = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#14b8a6', '#ec4899', '#2ecc40']

    return (
        <group>
            {/* Soat (ustoz stoli tepasida) */}
            <group position={[-4.6, 2.7, -3.95]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.32, 0.32, 0.06, 24]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                <group position={[0, 0, 0.05]}>
                    <group ref={hour}>
                        <mesh position={[0, 0.08, 0]}>
                            <boxGeometry args={[0.04, 0.17, 0.01]} />
                            <meshBasicMaterial color="#222" />
                        </mesh>
                    </group>
                    <group ref={minute}>
                        <mesh position={[0, 0.12, 0.01]}>
                            <boxGeometry args={[0.025, 0.25, 0.01]} />
                            <meshBasicMaterial color="#222" />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* Chap devordagi ikkita deraza */}
            {[1.0, 3.0].map((z) => (
                <group key={z} position={[-5.97, 2.0, z]}>
                    <mesh>
                        <boxGeometry args={[0.06, 1.4, 1.6]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0.04, 0, 0]}>
                        <boxGeometry args={[0.02, 1.2, 1.4]} />
                        <meshStandardMaterial color="#bfe3f5" emissive="#9fd3ee" emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[0.06, 0, 0]}>
                        <boxGeometry args={[0.02, 1.2, 0.05]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                </group>
            ))}

            {/* Yozuv (chap devorda) */}
            <mesh position={[-5.97, 2.8, -1.6]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[2.6, 0.7]} />
                <meshBasicMaterial map={signTex} toneMapped={false} />
            </mesh>

            {/* Kitob javoni (orqa devorda, doskaning o'ng tomonida) */}
            <group position={[4.6, 0, -3.75]}>
                <mesh position={[0, 1.1, 0]}>
                    <boxGeometry args={[1.5, 2.2, 0.4]} />
                    <meshStandardMaterial color="#b08a5a" roughness={0.9} />
                </mesh>
                {[0.55, 1.2, 1.85].map((y, row) => (
                    <group key={y}>
                        <mesh position={[0, y - 0.05, 0.02]}>
                            <boxGeometry args={[1.4, 0.04, 0.38]} />
                            <meshStandardMaterial color="#8a6a40" />
                        </mesh>
                        {bookColors.map((c, i) => (
                            <mesh key={i} position={[-0.55 + i * 0.18, y + 0.2, 0.05]}>
                                <boxGeometry args={[0.12, 0.38 + ((i + row) % 3) * 0.06, 0.26]} />
                                <meshStandardMaterial color={c} roughness={0.9} />
                            </mesh>
                        ))}
                    </group>
                ))}
            </group>
        </group>
    )
}
export default function ClassroomScene({ standRef }) {
    const tex = useCodeTexture()
    const desks = []
    let k = 0
    for (const z of [-1.2, 1.6]) {
        for (const x of [-3.6, 0, 3.6]) {
            desks.push({
                pos: [x, 0, z],
                person: { shirt: SHIRTS[k], hair: HAIRS[k], skin: SKINS[k], seed: k * 1.7 },
            })
            k++
        }
    }

    return (
        <group position={ORIGIN}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[8, 12, 6]} intensity={1.6} />

            <City />
            <RoomDetails />

            {/* Pol */}
            <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[12, 0.2, 8]} />
                <meshStandardMaterial color="#c4c7cc" roughness={0.9} />
            </mesh>

            {/* Devorlar */}
            <mesh position={[0, 1.7, -4.1]}>
                <boxGeometry args={[12.4, 3.4, 0.2]} />
                <meshStandardMaterial color="#eef0f2" roughness={0.9} />
            </mesh>
            <mesh position={[-6.1, 1.7, 0]}>
                <boxGeometry args={[0.2, 3.4, 8.4]} />
                <meshStandardMaterial color="#e3e6e9" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.09, -3.97]}>
                <boxGeometry args={[12, 0.18, 0.06]} />
                <meshStandardMaterial color="#2ecc40" />
            </mesh>

            {/* Doska */}
            <mesh position={[0, 1.95, -3.98]}>
                <boxGeometry args={[6.3, 2.8, 0.06]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0, 1.95, -3.94]}>
                <planeGeometry args={[6, 2.5]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>

            <TeacherStation position={[-4.0, 0, -2.7]} tex={tex} standRef={standRef} />
            <Plant position={[5.4, 0, -3.4]} />

            {desks.map((d, i) => (
                <Desk key={i} position={d.pos} person={d.person} tex={tex} />
            ))}
        </group>
    )
}