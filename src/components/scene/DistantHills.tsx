import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { paintGeometry } from './paint'
import { ensureNonIndexed, landNoise, mulberry32, organic, terrainHeight } from './world'

type RidgeSpec = {
  seed: number
  z: number
  height: number
  color: string
  haze: string
  width: number
}

const RIDGES: RidgeSpec[] = [
  { seed: 3, z: -82, height: 26, color: '#8fb6a6', haze: '#e2efdb', width: 300 },
  { seed: 11, z: -62, height: 17, color: '#6f9c82', haze: '#e6f1dc', width: 250 },
  { seed: 23, z: -47, height: 9.5, color: '#54825f', haze: '#e9f2dc', width: 210 },
]

function buildRidge(spec: RidgeSpec) {
  const rand = mulberry32(spec.seed)
  const segments = 72
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const top = new THREE.Color(spec.color)
  const bottom = new THREE.Color(spec.haze)
  const tint = new THREE.Color()

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const x = -spec.width / 2 + t * spec.width
    // Layered landform noise instead of a repeating sine so the skyline is irregular.
    const layered =
      landNoise(x * 0.045 + spec.seed, spec.seed * 0.7) * 0.55 +
      landNoise(x * 0.13 - spec.seed, spec.seed * 0.3) * 0.22
    const silhouette =
      spec.height * (0.36 + 0.64 * Math.sin(Math.PI * Math.min(1, t * 1.06))) +
      layered * spec.height * 0.36 +
      rand() * 0.6
    const z = spec.z + Math.sin(i * 0.21 + spec.seed) * 3.4

    positions.push(x, -8, z)
    positions.push(x, silhouette, z)

    // Haze creeps up the hillside, and each fold catches light a little differently.
    tint.copy(bottom)
    colors.push(tint.r, tint.g, tint.b)
    tint.copy(top).offsetHSL(smoothTint(i, spec.seed), 0, (layered - 0.5) * 0.08)
    colors.push(tint.r, tint.g, tint.b)

    if (i < segments) {
      const base = i * 2
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)

  return geometry
}

function smoothTint(i: number, seed: number) {
  return Math.sin(i * 0.13 + seed) * 0.012
}

/** A rounder distant tree: no cones, no flat shading, just soft foliage mass. */
function buildDistantTree() {
  const rand = mulberry32(4721)
  const parts: THREE.BufferGeometry[] = []
  const trunk = ensureNonIndexed(new THREE.CylinderGeometry(0.13, 0.2, 1.25, 6))
  trunk.translate(0, 0.62, 0)
  paintGeometry(trunk, (vertex, color) => {
    color.set('#4f3d2c').multiplyScalar(0.85 + vertex.y * 0.2)
  })
  parts.push(trunk)

  const dark = new THREE.Color('#3a603f')
  const light = new THREE.Color('#93b96c')

  for (let i = 0; i < 7; i += 1) {
    const radius = 0.62 + rand() * 0.5
    const base = new THREE.IcosahedronGeometry(radius, 2)
    base.scale(1.1, 0.78 + rand() * 0.2, 1.1)
    const clump = organic(base, 0.34, i * 9 + 3)
    const angle = rand() * Math.PI * 2
    const ring = rand() * 0.85
    clump.translate(
      Math.cos(angle) * ring,
      1.35 + rand() * 1.15 - Math.pow(ring, 2) * 0.3,
      Math.sin(angle) * ring,
    )
    paintGeometry(clump, (vertex, color) => {
      const t = THREE.MathUtils.clamp((vertex.y - 1.0) / 2.0, 0, 1)
      color.copy(dark).lerp(light, t * 0.8)
    })
    parts.push(clump)
  }

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())
  return merged
}

/** Background tree silhouettes that sit on the far hills. */
function BackgroundTreeLine() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const trees = useMemo(() => {
    const rand = mulberry32(613)
    const result: Array<{ position: [number, number, number]; scale: [number, number, number]; rotation: number; tint: THREE.Color }> = []
    const palette = ['#5d8a63', '#4f7a58', '#6f9c70', '#568169', '#7aa87a']

    for (let i = 0; i < 46; i += 1) {
      const z = -30 - rand() * 16
      const x = (rand() - 0.5) * 68
      const y = terrainHeight(x, z) - 0.4
      const scale = 0.9 + rand() * 1.7
      result.push({
        position: [x, y, z],
        rotation: rand() * Math.PI * 2,
        scale: [scale * (0.8 + rand() * 0.4), scale * (1.05 + rand() * 0.75), scale * (0.8 + rand() * 0.4)],
        tint: new THREE.Color(palette[Math.floor(rand() * palette.length)]),
      })
    }
    return result
  }, [])

  const geometry = useMemo(() => buildDistantTree(), [])
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }),
    [],
  )

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    trees.forEach((tree, index) => {
      dummy.position.set(...tree.position)
      dummy.rotation.set(0, tree.rotation, 0)
      dummy.scale.set(...tree.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      mesh.setColorAt(index, tree.tint)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [dummy, trees])

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, trees.length]} frustumCulled={false} />
  )
}

/** Layered, hazy hills for atmospheric perspective. */
export function DistantHills() {
  const ridges = useMemo(
    () => RIDGES.map((spec) => ({ geometry: buildRidge(spec), z: spec.z })),
    [],
  )

  return (
    <group>
      {ridges.map((ridge, index) => (
        <mesh key={index} geometry={ridge.geometry} renderOrder={-1}>
          <meshBasicMaterial vertexColors fog />
        </mesh>
      ))}
      <BackgroundTreeLine />
    </group>
  )
}
