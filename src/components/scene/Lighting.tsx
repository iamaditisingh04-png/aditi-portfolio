import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { cloudTexture, glowTexture, mistTexture, shaftTexture } from './textures'

/** Soft cumulus banks drifting near the horizon. */
function Clouds() {
  const texture = useMemo(() => cloudTexture(), [])
  const { animate, quality } = useSceneMotion()
  const group = useRef<THREE.Group>(null)
  const puffs = useMemo<
    Array<{ position: [number, number, number]; scale: [number, number, number]; opacity: number }>
  >(
    () => [
      { position: [-46, 26, -92] as [number, number, number], scale: [52, 22, 1], opacity: 0.5 },
      { position: [-12, 32, -104] as [number, number, number], scale: [68, 26, 1], opacity: 0.42 },
      { position: [26, 24, -96] as [number, number, number], scale: [58, 21, 1], opacity: 0.48 },
      { position: [60, 30, -88] as [number, number, number], scale: [46, 18, 1], opacity: 0.36 },
      { position: [-72, 20, -80] as [number, number, number], scale: [40, 15, 1], opacity: 0.34 },
      { position: [8, 15, -78] as [number, number, number], scale: [34, 11, 1], opacity: 0.26 },
    ],
    [],
  )

  useFrame((state) => {
    if (group.current && animate) {
      group.current.position.x = Math.sin(state.clock.elapsedTime * 0.008) * 10
    }
  })

  return (
    <group ref={group}>
      {puffs.slice(0, quality === 'high' ? puffs.length : 3).map((puff, index) => (
        <sprite key={index} position={puff.position} scale={puff.scale}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={puff.opacity}
            depthWrite={false}
            color="#fffdf6"
          />
        </sprite>
      ))}
    </group>
  )
}

/** Warm afternoon sun with shadows, volumetric shafts and ground mist. */
export function Lighting() {
  const { quality, animate } = useSceneMotion()
  const sun = useMemo(() => glowTexture(), [])
  const shaft = useMemo(() => shaftTexture(), [])
  const mist = useMemo(() => mistTexture(), [])
  const raysRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!raysRef.current || !animate) return
    raysRef.current.children.forEach((child, index) => {
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      if (material) {
        material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.3 + index * 1.3) * 0.04
      }
    })
  })

  return (
    <group>
      {/* Cool sky above, warm bounced light below: the classic warm-light/cool-shade contrast. */}
      <hemisphereLight args={['#d7ecff', '#446f3e', 0.92]} />
      <ambientLight intensity={0.3} color="#ffeed0" />

      <directionalLight
        position={[19, 13.5, 7]}
        intensity={2.95}
        color="#ffd08a"
        castShadow
        shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-bias={-0.0004}
        shadow-normalBias={0.045}
        shadow-radius={4}
      />

      <directionalLight position={[-14, 8, -18]} intensity={0.5} color="#9ec9ff" />
      <directionalLight position={[3, 4.5, 15]} intensity={0.32} color="#ffcf95" />

      <sprite position={[29, 14.5, -52]} scale={[56, 56, 1]}>
        <spriteMaterial
          map={sun}
          color="#ffdfae"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <Clouds />

      <group ref={raysRef}>
        {[-13, -7.5, -2, 3.5, 9, 14].map((x, index) => (
          <mesh key={x} position={[x, 9 + index * 1.3, -19 - index * 3.2]} rotation={[0, 0, 0.2]}>
            <planeGeometry args={[4, 40]} />
            <meshBasicMaterial
              map={shaft}
              transparent
              opacity={0.15}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              color="#fff4c9"
            />
          </mesh>
        ))}

        {/* Low shafts falling through the near trees, catching the meadow haze. */}
        {[
          { x: -7.2, y: 5.6, z: -6.5, tilt: 0.34, width: 3.2, opacity: 0.1 },
          { x: 1.4, y: 5.9, z: -9.5, tilt: 0.28, width: 3.8, opacity: 0.085 },
          { x: 8.6, y: 5.2, z: -3.5, tilt: 0.4, width: 2.6, opacity: 0.075 },
        ].map((ray) => (
          <mesh key={`near-${ray.x}`} position={[ray.x, ray.y, ray.z]} rotation={[0, 0, ray.tilt]}>
            <planeGeometry args={[ray.width, 22]} />
            <meshBasicMaterial
              map={shaft}
              transparent
              opacity={ray.opacity}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              color="#ffe9b8"
            />
          </mesh>
        ))}
      </group>

      {[
        { position: [-3.4, 0.75, -7] as [number, number, number], scale: [9, 3.2] },
        { position: [4.6, 0.85, 1.5] as [number, number, number], scale: [11, 3.6] },
        { position: [-7.2, 1.5, -13] as [number, number, number], scale: [13, 4.4] },
        { position: [1.8, 0.6, 9] as [number, number, number], scale: [8, 2.6] },
        { position: [8.5, 2.4, -18] as [number, number, number], scale: [16, 5] },
        { position: [-11, 1.1, 4] as [number, number, number], scale: [12, 3.4] },
      ].map((blob, index) => (
        <sprite key={index} position={blob.position} scale={[blob.scale[0], blob.scale[1], 1]}>
          <spriteMaterial map={mist} transparent opacity={0.24} depthWrite={false} color="#fff6e2" />
        </sprite>
      ))}

      {quality === 'high' && (
        <>
          <sprite position={[-17, 7, -30]} scale={[38, 13, 1]}>
            <spriteMaterial map={mist} transparent opacity={0.18} depthWrite={false} color="#ffffff" />
          </sprite>
          <sprite position={[19, 5, -24]} scale={[26, 9, 1]}>
            <spriteMaterial map={mist} transparent opacity={0.15} depthWrite={false} color="#fff8e2" />
          </sprite>
          <sprite position={[0, 1.6, -34]} scale={[42, 8, 1]}>
            <spriteMaterial map={mist} transparent opacity={0.16} depthWrite={false} color="#eaf9f2" />
          </sprite>
        </>
      )}
    </group>
  )
}
