
import { useMemo } from 'react'
import * as THREE from 'three'
import { landNoise, mulberry32 } from './world'

type RidgeSpec = {
  seed: number
  z: number
  height: number
  color: string
  haze: string
  width: number
}

const RIDGES: RidgeSpec[] = [
  {
    seed: 3,
    z: -82,
    height: 23,
    color: '#a18ba9',
    haze: '#e9b9bd',
    width: 300,
  },
  {
    seed: 11,
    z: -62,
    height: 15,
    color: '#b18a9c',
    haze: '#efc2b4',
    width: 270,
  },
  {
    seed: 23,
    z: -47,
    height: 8,
    color: '#bd8c91',
    haze: '#f2c9b3',
    width: 230,
  },
]

function buildRidge(spec: RidgeSpec) {
  const rand = mulberry32(spec.seed)
  const segments = 100

  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  const top = new THREE.Color(spec.color)
  const bottom = new THREE.Color(spec.haze)
  const tint = new THREE.Color()

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const x = -spec.width / 2 + t * spec.width

    const broadNoise =
      landNoise(x * 0.035 + spec.seed, spec.seed * 0.7) * 0.55 +
      landNoise(x * 0.11 - spec.seed, spec.seed * 0.3) * 0.2

    const silhouette =
      spec.height *
        (0.32 +
          0.68 *
            Math.sin(
              Math.PI * Math.min(1, t * 1.05),
            )) +
      broadNoise * spec.height * 0.3 +
      rand() * 0.35

    const z =
      spec.z + Math.sin(i * 0.17 + spec.seed) * 2.4

    // Bottom edge of the distant hill
    positions.push(x, -8, z)

    // Natural irregular hill silhouette
    positions.push(x, silhouette, z)

    // Soft atmospheric haze at the bottom
    tint.copy(bottom)
    colors.push(tint.r, tint.g, tint.b)

    // Muted lavender and rose tones at the ridge
    tint
      .copy(top)
      .offsetHSL(
        Math.sin(i * 0.13 + spec.seed) * 0.012,
        0,
        (broadNoise - 0.5) * 0.06,
      )

    colors.push(tint.r, tint.g, tint.b)

    if (i < segments) {
      const base = i * 2

      indices.push(
        base,
        base + 2,
        base + 1,
        base + 1,
        base + 2,
        base + 3,
      )
    }
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )

  geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3),
  )

  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

/** Soft, layered sunset hills with no trees or vegetation. */
export function DistantHills() {
  const ridges = useMemo(
    () =>
      RIDGES.map((spec) => ({
        geometry: buildRidge(spec),
        z: spec.z,
      })),
    [],
  )

  return (
    <group>
      {ridges.map((ridge, index) => (
        <mesh
          key={index}
          geometry={ridge.geometry}
          renderOrder={-1}
          frustumCulled={false}
        >
          <meshBasicMaterial
            vertexColors
            fog
            side={THREE.DoubleSide}
            depthWrite={true}
          />
        </mesh>
      ))}
    </group>
  )
}
