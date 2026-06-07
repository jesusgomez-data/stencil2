'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export const FRAME_COLORS = [
  { label: 'Havana', hex: '#7A3B20' },
  { label: 'Negro',  hex: '#1a1a1a' },
  { label: 'Azul',   hex: '#0D2147' },
  { label: 'Verde',  hex: '#1C3B1C' },
]

export const VIEW_PRESETS: Record<string, [number, number, number]> = {
  Frontal:  [0,    0,   5.8],
  Lateral:  [5.7,  0.5, 0.6],
  Superior: [0.26, 5.5, 1.6],
  Atrás:    [0,    0.4, -5.8],
}

function SunglassesModel({ color }: { color: string }) {
  const frameMat = { color, roughness: 0.62, metalness: 0.04, envMapIntensity: 1.2 }
  const lensMat  = { color: '#0a1525', transparent: true, opacity: 0.88, roughness: 0.08, metalness: 0.35 }

  return (
    <group>
      <mesh position={[-0.6, 0, 0]} scale={[1, 0.72, 0.16]}>
        <torusGeometry args={[0.34, 0.042, 20, 80]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[0.6, 0, 0]} scale={[1, 0.72, 0.16]}>
        <torusGeometry args={[0.34, 0.042, 20, 80]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[-0.6, 0, 0.02]} scale={[0.34, 0.245, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial {...lensMat} />
      </mesh>
      <mesh position={[0.6, 0, 0.02]} scale={[0.34, 0.245, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial {...lensMat} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.26, 0.038, 0.04]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[-0.09, -0.04, 0.04]}>
        <boxGeometry args={[0.025, 0.065, 0.018]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[0.09, -0.04, 0.04]}>
        <boxGeometry args={[0.025, 0.065, 0.018]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[-0.93, 0, 0]}>
        <boxGeometry args={[0.038, 0.072, 0.038]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[0.93, 0, 0]}>
        <boxGeometry args={[0.038, 0.072, 0.038]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[-1.27, 0.01, -0.48]} rotation={[0, 0.46, 0]}>
        <boxGeometry args={[0.82, 0.026, 0.026]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[1.27, 0.01, -0.48]} rotation={[0, -0.46, 0]}>
        <boxGeometry args={[0.82, 0.026, 0.026]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>
      <mesh position={[0, 0, -0.8]}>
        <planeGeometry args={[4.5, 3]} />
        <meshBasicMaterial color="#CC0000" transparent opacity={0.07} depthWrite={false} />
      </mesh>
    </group>
  )
}

function SceneController({ view }: { view: string }) {
  const controlsRef = useRef<any>(null)
  const targetPos   = useRef(new THREE.Vector3(...VIEW_PRESETS.Frontal))
  const animating   = useRef(false)

  useEffect(() => {
    const preset = VIEW_PRESETS[view]
    if (!preset) return
    const [x, y, z] = preset
    targetPos.current.set(x, y, z)
    animating.current = true
  }, [view])

  useFrame(() => {
    if (!animating.current || !controlsRef.current) return
    const cam = controlsRef.current.object
    cam.position.lerp(targetPos.current, 0.07)
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.update()
    if (cam.position.distanceTo(targetPos.current) < 0.04) {
      animating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate
      autoRotateSpeed={0.6}
      enableZoom
      enablePan={false}
      minDistance={3.5}
      maxDistance={9}
    />
  )
}

function Scene({ color, view }: { color: string; view: string }) {
  return (
    <>
      <ambientLight intensity={0.28} color="#ffe8c0" />
      {/* Key light — warm white, upper-left */}
      <directionalLight position={[-2, 4, 3]} intensity={3.5} color="#fff8f0" />
      {/* Fill — cool subtle from right */}
      <directionalLight position={[3, 1, -2]} intensity={0.7} color="#c8d8f0" />
      {/* Pedestal warm glow — below */}
      <pointLight position={[0, -2, 1.5]} intensity={4.5} color="#D4862A" distance={6} />
      {/* Rim light from back-top */}
      <pointLight position={[0, 3, -3]} intensity={2.2} color="#ffffff" distance={8} />
      <SunglassesModel color={color} />
      <SceneController view={view} />
    </>
  )
}

export interface Viewer3DProps {
  activeColor?: string
  activeView?: string
  hideControls?: boolean
}

export default function Viewer3D({ activeColor: extColor, activeView: extView, hideControls = false }: Viewer3DProps) {
  const [internalColor, setInternalColor] = useState(FRAME_COLORS[0].hex)
  const [internalView,  setInternalView]  = useState('Frontal')

  const activeColor = extColor ?? internalColor
  const activeView  = extView  ?? internalView

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene color={activeColor} view={activeView} />
      </Canvas>

      {!hideControls && (
        <>
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {Object.keys(VIEW_PRESETS).map((v) => (
              <button
                key={v}
                onClick={() => setInternalView(v)}
                className={`font-code text-[10px] tracking-widest px-3 py-1.5 border transition-all uppercase ${
                  activeView === v
                    ? 'bg-white text-black border-white'
                    : 'bg-black/50 text-white/40 border-white/15 hover:border-white/50 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            {FRAME_COLORS.map((c) => (
              <button
                key={c.label}
                title={c.label}
                onClick={() => setInternalColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
                  activeColor === c.hex
                    ? 'border-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                    : 'border-white/25 hover:border-white/60'
                }`}
              />
            ))}
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-code text-[9px] tracking-[0.3em] text-white/25 uppercase whitespace-nowrap z-10 select-none">
            ARRASTRA PARA ROTAR
          </p>
        </>
      )}
    </div>
  )
}
