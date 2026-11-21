import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { creekCenterX, terrainHeight } from './world'

type ButterflyProps = {
  origin: [number, number, number]
  phase: number
  color: string
  scale: number
}

function Butterfly({ origin, phase, color, scale }: ButterflyProps) {
  const group = useRef<THREE.Group>(null)
  const leftWing = useRef<THREE.Group>(null)
  const rightWing = useRef<THREE.Group>(null)
  const { animate } = useSceneMotion()

  useFrame((state) => {
    if (!animate) return
    const t = state.clock.elapsedTime * 0.45 + phase
    if (group.current) {
      group.current.position.set(
        origin[0] + Math.sin(t * 1.1) * 2.1,
        origin[1] + Math.sin(t * 2.3) * 0.35,
        origin[2] + Math.cos(t * 0.9) * 1.7,
      )
      group.current.rotation.y = Math.sin(t * 0.8) * 0.8
    }
    const flap = Math.sin(state.clock.elapsedTime * 9 + phase) * 0.9
    if (leftWing.current) leftWing.current.rotation.y = flap
    if (rightWing.current) rightWing.current.rotation.y = -flap
  })

  return (
    <group ref={group} position={origin} scale={scale}>
      <group ref={leftWing}>
        <mesh position={[0.12, 0, 0]} rotation={[-Math.PI / 2.6, 0, 0]}>
          <circleGeometry args={[0.13, 10]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            emissive={color}
            emissiveIntensity={0.25}
            roughness={0.6}
          />
        </mesh>
      </group>
      <group ref={rightWing}>
        <mesh position={[-0.12, 0, 0]} rotation={[-Math.PI / 2.6, 0, 0]}>
          <circleGeometry args={[0.13, 10]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            emissive={color}
            emissiveIntensity={0.25}
            roughness={0.6}
          />
        </mesh>
      </group>
      <mesh>
        <capsuleGeometry args={[0.012, 0.09, 2, 4]} />
        <meshStandardMaterial color="#3c4a35" />
      </mesh>
    </group>
  )
}

function Bird({ phase, radius, height, speed }: { phase: number; radius: number; height: number; speed: number }) {
  const group = useRef<THREE.Group>(null)
  const { animate } = useSceneMotion()

  useFrame((state) => {
    if (!animate || !group.current) return
    const t = state.clock.elapsedTime * speed + phase
    group.current.position.set(Math.cos(t) * radius, height + Math.sin(t * 2) * 0.5, -36 + Math.sin(t) * 6)
    group.current.rotation.y = -t
  })

  return (
    <group ref={group}>
      <mesh rotation={[0, 0, 0.5]} position={[-0.35, 0, 0]}>
        <planeGeometry args={[0.62, 0.06]} />
        <meshBasicMaterial color="#3d5a4a" side={THREE.DoubleSide} transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[0, 0, -0.5]} position={[0.35, 0, 0]}>
        <planeGeometry args={[0.62, 0.06]} />
        <meshBasicMaterial color="#3d5a4a" side={THREE.DoubleSide} transparent opacity={0.75} />
      </mesh>
    </group>
  )
}

/** Butterflies over the flowers and a few birds high above the valley. */
export function Fauna() {
  const { quality } = useSceneMotion()
  const butterflies = useMemo(() => {
    const spots: Array<[number, number, number]> = [
      [creekCenterX(-4) + 3.4, 1.1, -4],
      [creekCenterX(2) - 3.1, 1.25, 2],
      [creekCenterX(-10) + 4.2, 1.4, -10],
      [creekCenterX(6) + 2.6, 1.0, 6],
      [creekCenterX(-2) - 5.2, 1.15, -2],
      [creekCenterX(9) + 3.8, 1.3, 9],
    ]
    return spots.map((spot, index) => ({
      origin: [spot[0], spot[1] + terrainHeight(spot[0], spot[2]), spot[2]] as [number, number, number],
      phase: index * 1.7,
      color: ['#f5cd68', '#e9a5ae', '#fdf7e3', '#9fe3dc', '#f7b7c6', '#ffe9a8'][index],
      scale: 0.9 + index * 0.06,
    }))
  }, [])

  return (
    <group>
      {butterflies.map((butterfly, index) => (
        <Butterfly key={index} {...butterfly} />
      ))}
      <Bird phase={0} radius={16} height={11} speed={0.06} />
      <Bird phase={2.2} radius={21} height={13} speed={0.045} />
      {quality === 'high' && <Bird phase={4.1} radius={13} height={9.5} speed={0.07} />}
    </group>
  )
}
