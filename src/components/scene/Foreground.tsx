import { useMemo } from 'react'
import * as THREE from 'three'
import { glowTexture } from './textures'
import { terrainHeight } from './world'
import { buildFlower } from './Flora'

type Cluster = {
  x: number
  z: number
  scale: number
  rotation: number
  kind: 'daisy' | 'cosmos' | 'buttercup'
}

/**
 * Oversized planting on the near right bank. These read as the foreground layer
 * against the smaller instanced flowers further up the valley.
 */
const CLUSTERS: Cluster[] = [
  { x: 7.2, z: 3.4, scale: 0.62, rotation: 0.5, kind: 'daisy' },
  { x: 8.6, z: 1.8, scale: 0.72, rotation: -0.35, kind: 'cosmos' },
  { x: 6.4, z: 4.8, scale: 0.55, rotation: 1.15, kind: 'buttercup' },
]

export function Foreground() {
  const daisy = useMemo(() => buildFlower('#fffaf0', '#f5cd68', 9, 0.1, 0.85), [])
  const cosmos = useMemo(() => buildFlower('#f2b9c2', '#f7d98a', 7, 0.12, 1.05), [])
  const buttercup = useMemo(() => buildFlower('#f8d977', '#e09a4c', 6, 0.09, 0.7), [])
  const geometries = { daisy, cosmos, buttercup }

  const leaf = useMemo(() => new THREE.ConeGeometry(0.26, 2.2, 4), [])
  const bokeh = useMemo(() => glowTexture(), [])

  return (
    <group>
      {CLUSTERS.map((cluster, index) => (
        <mesh
          key={index}
          geometry={geometries[cluster.kind]}
          position={[cluster.x, terrainHeight(cluster.x, cluster.z) - 0.05, cluster.z]}
          rotation={[0, cluster.rotation, 0.03]}
          scale={cluster.scale}
        >
          <meshStandardMaterial vertexColors roughness={0.8} />
        </mesh>
      ))}

      {[
        { x: 5.2, z: 4.6, rotation: 0.6, scale: 1.1 },
        { x: 6.9, z: 2.9, rotation: -0.4, scale: 1.3 },
        { x: 8.2, z: 1.1, rotation: 0.9, scale: 1.15 },
      ].map((blade, index) => (
        <mesh
          key={`blade-${index}`}
          geometry={leaf}
          position={[blade.x, terrainHeight(blade.x, blade.z) + 0.75, blade.z]}
          rotation={[0.2, blade.rotation, 0.3]}
          scale={blade.scale}
        >
          <meshStandardMaterial color="#3c6b3d" roughness={0.95} flatShading />
        </mesh>
      ))}

      {/* Soft out-of-focus light at the edges of frame. */}
      <sprite position={[2.1, 1.5, 9.4]} scale={[2.4, 2.4, 1]}>
        <spriteMaterial
          map={bokeh}
          color="#fff3cc"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[-2.2, 2.6, 9.8]} scale={[3.2, 3.2, 1]}>
        <spriteMaterial
          map={bokeh}
          color="#ffe6b5"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
