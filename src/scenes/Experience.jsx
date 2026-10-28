import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { MathUtils } from 'three'
import SpaceScene from './SpaceScene'
import ClassroomScene, { ORIGIN } from './ClassroomScene'
import { SoftRoom, SupplyRoom, LogisticsRoom } from '../rooms/Rooms'

const clamp = MathUtils.clamp
const smooth = MathUtils.smoothstep
const lerp = MathUtils.lerp

/* ---- Scroll bo'limlari (0..1) ----
   kosmos | UDS Soft | UDS Market | Logistika | UDS Academy (sinf) */
const SPACE_END = 0.16
const ROOMS = [
  { key: 'soft', x: 300, a: 0.16, b: 0.33, Comp: SoftRoom },
  { key: 'supply', x: 400, a: 0.33, b: 0.5, Comp: SupplyRoom },
  { key: 'logistics', x: 500, a: 0.5, b: 0.67, Comp: LogisticsRoom },
]
const ACADEMY_START = 0.67
const BOUNDS = [SPACE_END, ...ROOMS.map((r) => r.b)]

// Yangi xonalar uchun umumiy kamera yo'li (pc = xona ichidagi progress 0..1)
const ROOM_KEYS = [
  { t: 0.0, pos: [14, 13, 14], look: [0, 0.8, 0], fov: 30 },
  { t: 0.4, pos: [9.5, 8, 10], look: [0, 0.9, 0], fov: 30 },
  { t: 1.0, pos: [7, 6.2, 9.5], look: [0, 1.1, -0.4], fov: 32 },
]

// UDS Academy sinfi: kamera yo'li
const KEYS = [
  { t: 0.0, pos: [14, 13, 14], look: [0, 0.8, 0], fov: 30 },
  { t: 0.28, pos: [8, 7.5, 8], look: [0, 0.8, 0], fov: 30 },
  { t: 0.4, pos: [0.8, 3.2, 2.8], look: [-1.8, 1.3, -3.3], fov: 34 },
  { t: 0.68, pos: [0.8, 3.2, 2.8], look: [-1.8, 1.3, -3.3], fov: 34 },
  { t: 0.8, pos: [9, 8, 9], look: [0, 0.8, 0], fov: 30 },
  { t: 1.0, pos: [11, 9.5, 11], look: [0, 1, 0], fov: 30 },
]

function sample(keys, pc) {
  let i = 0
  while (i < keys.length - 2 && pc > keys[i + 1].t) i++
  const a = keys[i]
  const b = keys[i + 1]
  const k = smooth(pc, a.t, b.t)
  const mix = (u, v) => u.map((n, j) => lerp(n, v[j], k))
  return { pos: mix(a.pos, b.pos), look: mix(a.look, b.look), fov: lerp(a.fov, b.fov, k) }
}

const win = (x, a, b, c, d) => smooth(x, a, b) * (1 - smooth(x, c, d))

function setSec(el, o, dy = 30) {
  if (!el) return
  el.style.opacity = o
  el.style.transform = `translateY(${(1 - o) * dy}px)`
  el.style.visibility = o < 0.02 ? 'hidden' : 'visible'
}

export default function Experience({ fadeRef, sections }) {
  const scroll = useScroll()
  const space = useRef()
  const roomRefs = useRef({})
  const academy = useRef()
  const standRef = useRef(0)

  useEffect(() => {
    const onWheel = (e) => {
      if (e.target.closest?.('[data-overlay]')) scroll.el.scrollTop += e.deltaY
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [scroll])

  useFrame((state, delta) => {
    const p = scroll.offset
    const cam = state.camera
    const s = sections.current

    // Qaysi sahna ko'rinadi
    const inSpace = p < SPACE_END
    const inAcademy = p >= ACADEMY_START
    space.current.visible = inSpace
    academy.current.visible = inAcademy
    ROOMS.forEach((r) => {
      const g = roomRefs.current[r.key]
      if (g) g.visible = p >= r.a && p < r.b
    })

    // Hamma kartochkalarni avval yashiramiz, keyin kerakligini ko'rsatamiz
    Object.values(s).forEach((el) => setSec(el, 0))

    if (inSpace) {
      const ps = p / SPACE_END
      const zoom = clamp((ps - 0.15) / 0.65, 0, 1)
      cam.fov = 55
      cam.position.set(0, 0, 9 - 6.9 * Math.pow(zoom, 1.5))
      cam.rotation.set(0, 0, 0)
      setSec(s.hero, 1 - smooth(ps, 0.0, 0.22))
      standRef.current = 0
    } else if (!inAcademy) {
      const r = ROOMS.find((q) => p >= q.a && p < q.b)
      const pc = clamp((p - r.a) / (r.b - r.a), 0, 1)
      const c = sample(ROOM_KEYS, pc)
      cam.fov = c.fov
      cam.position.set(r.x + c.pos[0], c.pos[1], c.pos[2])
      cam.lookAt(r.x + c.look[0], c.look[1], c.look[2])
      setSec(s[r.key], win(pc, 0.14, 0.26, 0.82, 0.94))
      standRef.current = 0
    } else {
      // UDS Academy
      const pc = clamp((p - ACADEMY_START) / (1 - ACADEMY_START), 0, 1)
      const c = sample(KEYS, pc)
      cam.fov = c.fov
      cam.position.set(ORIGIN[0] + c.pos[0], c.pos[1], c.pos[2])
      cam.lookAt(ORIGIN[0] + c.look[0], c.look[1], c.look[2])

      const target = smooth(pc, 0.3, 0.38) * (1 - smooth(pc, 0.7, 0.76))
      standRef.current = lerp(standRef.current, target, 1 - Math.exp(-delta * 4))

      setSec(s.courses, win(pc, 0.03, 0.09, 0.25, 0.31))
      setSec(s.teacher, win(pc, 0.4, 0.46, 0.64, 0.7))
      setSec(s.contact, win(pc, 0.8, 0.86, 2, 3))
    }
    cam.updateProjectionMatrix()

    // Oq o'tish: kosmosdan oldin va har bir xona chegarasida
    let f = 0
    if (inSpace) f = clamp((p / SPACE_END - 0.55) / 0.3, 0, 1)
    BOUNDS.concat(ACADEMY_START).forEach((b) => {
      f = Math.max(f, 1 - clamp(Math.abs(p - b) / 0.018, 0, 1))
    })
    if (fadeRef?.current) fadeRef.current.style.opacity = f
  })

  return (
    <>
      <group ref={space}>
        <SpaceScene />
      </group>
      {ROOMS.map((r) => (
        <group key={r.key} ref={(el) => (roomRefs.current[r.key] = el)} position={[r.x, 0, 0]} visible={false}>
          <r.Comp />
        </group>
      ))}
      <group ref={academy} visible={false}>
        <ClassroomScene standRef={standRef} />
      </group>
    </>
  )
}
