import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Experience from './scenes/Experience'
import Overlay from './Overlay'

export default function App() {
  const fadeRef = useRef()
  const sections = useRef({})

  return (
    <>
      <Canvas camera={{ position: [0, 0, 9], fov: 55 }}>
        <color attach="background" args={['#05080c']} />
        <ScrollControls pages={14} damping={0.25}>
          <Experience fadeRef={fadeRef} sections={sections} />
        </ScrollControls>
      </Canvas>

      <Overlay sections={sections} />

      <div
        ref={fadeRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </>
  )
}