
import { useMemo } from 'react'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { glowTexture, mistTexture } from './textures'

/** Soft atmospheric lighting for the sunset flower meadow. */
export function Lighting() {
  const { quality, theme } = useSceneMotion()
  const isDay = theme === 'day'

  const sun = useMemo(() => glowTexture(), [])
  const mist = useMemo(() => mistTexture(), [])

  return (
    <group>
      {/* Soft colour from the sunset sky */}
      <hemisphereLight
        args={[
          isDay ? '#f7c9d2' : '#465a91',
          isDay ? '#65764b' : '#17233a',
          isDay ? 0.85 : 0.48,
        ]}
      />

      {/* Gentle ambient illumination */}
      <ambientLight
        intensity={isDay ? 0.48 : 0.22}
        color={isDay ? '#ffe1c5' : '#9eafff'}
      />

      {/* Main golden sunset light */}
      <directionalLight
        position={isDay ? [16, 10, -20] : [-12, 16, -8]}
        intensity={isDay ? 1.75 : 1.15}
        color={isDay ? '#ffbd91' : '#a8c5ff'}
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

      {/* Lavender-pink fill light */}
      <directionalLight
        position={[-14, 8, -18]}
        intensity={isDay ? 0.35 : 0.3}
        color={isDay ? '#d4a6ce' : '#738de0'}
      />

      {/* Warm light on the foreground flowers */}
      <directionalLight
        position={[3, 4.5, 15]}
        intensity={isDay ? 0.3 : 0.12}
        color={isDay ? '#ffdbb0' : '#8499dc'}
      />

      {/* Large, soft sun glow */}
      <sprite
        position={[16, 10, -48]}
        scale={[48, 48, 1]}
      >
        <spriteMaterial
          map={sun}
          color={isDay ? '#ffbd91' : '#b9d3ff'}
          transparent
          opacity={isDay ? 0.48 : 0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Peach-coloured mist floating above the meadow */}
      {[
        {
          position: [-3.4, 0.75, -7] as [number, number, number],
          scale: [9, 3.2],
        },
        {
          position: [4.6, 0.85, 1.5] as [number, number, number],
          scale: [11, 3.6],
        },
        {
          position: [-7.2, 1.5, -13] as [number, number, number],
          scale: [13, 4.4],
        },
        {
          position: [1.8, 0.6, 9] as [number, number, number],
          scale: [8, 2.6],
        },
        {
          position: [8.5, 2.4, -18] as [number, number, number],
          scale: [16, 5],
        },
        {
          position: [-11, 1.1, 4] as [number, number, number],
          scale: [12, 3.4],
        },
      ].map((blob, index) => (
        <sprite
          key={index}
          position={blob.position}
          scale={[blob.scale[0], blob.scale[1], 1]}
        >
          <spriteMaterial
            map={mist}
            transparent
            opacity={0.18}
            depthWrite={false}
            color={isDay ? '#ffd5c4' : '#a7b9e9'}
          />
        </sprite>
      ))}
    </group>
  )
}
