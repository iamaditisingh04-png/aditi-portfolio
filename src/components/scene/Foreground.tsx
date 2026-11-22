
import { useMemo } from 'react'
import * as THREE from 'three'
import { glowTexture } from './textures'
import { terrainHeight } from './world'
import { buildFlower } from './Flora'

const TULIPS = [
  { x: 7.2, z: 3.4, scale: 0.95, rotation: 0.5, color: '#e96c91' },
  { x: 8.6, z: 1.8, scale: 1.1, rotation: -0.35, color: '#f4a6bc' },
  { x: 6.4, z: 4.8, scale: 0.85, rotation: 1.15, color: '#f2c5d0' },
  { x: 5.5, z: 2.1, scale: 0.9, rotation: 0.8, color: '#e85d73' },
  { x: 9.2, z: 4.1, scale: 0.9, rotation: -0.6, color: '#d98bc0' },
]

export function Foreground() {
  const flower = useMemo(
    () => buildFlower('#ffffff', '#f8d69b', 6, 0.13, 0.56),
    [],
  )

  const bokeh = useMemo(() => glowTexture(), [])

  return (
    <group>
      {TULIPS.map((tulip, index) => (
        <mesh
          key={index}
          geometry={flower}
          position={[
            tulip.x,
            terrainHeight(tulip.x, tulip.z) - 0.05,
            tulip.z,
          ]}
          rotation={[0, tulip.rotation, 0.03]}
          scale={tulip.scale}
        >
          <meshStandardMaterial
            color={tulip.color}
            roughness={0.8}
          />
        </mesh>
      ))}

      <sprite position={[2.1, 1.5, 9.4]} scale={[2.4, 2.4, 1]}>
        <spriteMaterial
          map={bokeh}
          color="#fff0d0"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <sprite position={[-2.2, 2.6, 9.8]} scale={[3.2, 3.2, 1]}>
        <spriteMaterial
          map={bokeh}
          color="#ffe6c2"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
