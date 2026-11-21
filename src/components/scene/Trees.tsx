import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useSceneMotion } from './sceneMotion'
import { paintGeometry } from './paint'
import { createFoliageMaterial } from './foliage'
import { ensureNonIndexed, mulberry32, organic, terrainHeight } from './world'

type Palette = 'green' | 'lime' | 'blossom' | 'deep'

const PALETTES: Record<Palette, [string, string, string, string]> = {
  green: ['#2f5735', '#447c3d', '#6ba04e', '#9cc56a'],
  lime: ['#436b31', '#5f8f3c', '#8fbc56', '#c4dc88'],
  deep: ['#24452e', '#356041', '#4f8149', '#7ba85f'],
  blossom: ['#b9717f', '#dd97a3', '#efb9c2', '#fbdfdb'],
}

type TreeSpec = {
  x: number
  z: number
  scale: number
  seed: number
  palette: Palette
  lean: number
}

const TREES: TreeSpec[] = [
  { x: -8.4, z: -13.2, scale: 1.18, seed: 2, palette: 'green', lean: 0.18 },
  { x: 7.6, z: -14.4, scale: 1.34, seed: 4, palette: 'deep', lean: -0.14 },
  { x: -11.5, z: -6.2, scale: 1.02, seed: 6, palette: 'lime', lean: 0.22 },
  { x: 11.2, z: -7.4, scale: 1.1, seed: 9, palette: 'green', lean: -0.2 },
  { x: -14.8, z: 1.2, scale: 1.3, seed: 12, palette: 'blossom', lean: 0.1 },
  { x: 14.2, z: -0.4, scale: 1.16, seed: 15, palette: 'deep', lean: -0.12 },
  { x: -9.6, z: 7.6, scale: 0.9, seed: 18, palette: 'green', lean: 0.24 },
  { x: 12.4, z: 8.2, scale: 1.0, seed: 21, palette: 'lime', lean: -0.18 },
  { x: -19.4, z: -11.8, scale: 1.42, seed: 24, palette: 'deep', lean: 0.08 },
  { x: 18.8, z: -13.2, scale: 1.36, seed: 27, palette: 'green', lean: -0.1 },
  { x: 21.2, z: 5.4, scale: 1.24, seed: 33, palette: 'blossom', lean: 0.16 },
  { x: -22.4, z: 10.2, scale: 1.18, seed: 36, palette: 'green', lean: -0.2 },
  { x: 4.6, z: -18.6, scale: 1.24, seed: 39, palette: 'lime', lean: 0.12 },
  { x: -5.2, z: -20.4, scale: 1.32, seed: 42, palette: 'deep', lean: -0.16 },
  { x: 16.4, z: -21.5, scale: 1.28, seed: 45, palette: 'green', lean: 0.14 },
  { x: -17.6, z: 16.8, scale: 1.12, seed: 48, palette: 'lime', lean: -0.18 },
  { x: 26.5, z: -2.4, scale: 1.46, seed: 51, palette: 'deep', lean: -0.06 },
  { x: -26.8, z: -3.6, scale: 1.38, seed: 54, palette: 'green', lean: 0.14 },
]

function buildTrunk(spec: TreeSpec, height: number, rand: () => number) {
  const trunk = ensureNonIndexed(
    new THREE.CylinderGeometry(0.075 * spec.scale, 0.22 * spec.scale, height, 12, 4),
  )
  trunk.translate(0, height / 2, 0)

  const position = trunk.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i)
    const t = Math.max(0, y / height)
    const bend = Math.pow(t, 2) * spec.lean * 0.55
    position.setX(i, position.getX(i) + bend)
    position.setZ(i, position.getZ(i) + Math.sin(t * 1.6) * spec.lean * 0.2)
  }
  trunk.computeVertexNormals()

  const parts: THREE.BufferGeometry[] = [trunk]

  for (let i = 0; i < 4; i += 1) {
    const length = (0.55 + rand() * 0.55) * spec.scale
    const branch = ensureNonIndexed(
      new THREE.CylinderGeometry(0.024 * spec.scale, 0.07 * spec.scale, length, 7),
    )
    branch.translate(0, length / 2, 0)
    branch.rotateZ(0.72 + rand() * 0.42)
    branch.rotateY((i / 4) * Math.PI * 2 + rand() * 0.5)
    const attach = height * (0.56 + rand() * 0.3)
    branch.translate(
      Math.pow(attach / height, 2) * spec.lean * 0.55,
      attach,
      Math.sin((attach / height) * 1.6) * spec.lean * 0.2,
    )
    parts.push(branch)
  }

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())

  const barkLow = new THREE.Color('#4a3524')
  const barkHigh = new THREE.Color('#7c5b3c')
  const moss = new THREE.Color('#587a41')

  paintGeometry(merged, (vertex, color) => {
    const t = THREE.MathUtils.clamp(vertex.y / (height * 0.9), 0, 1)
    color.copy(barkLow).lerp(barkHigh, t * 0.85)
    const mossy = (1 - t) * (0.55 + Math.sin(vertex.x * 7.1 + vertex.z * 5.3) * 0.35)
    color.lerp(moss, THREE.MathUtils.clamp(mossy, 0, 0.55))
  })

  return merged
}

type CrownShape = {
  height: number
  spread: number
  lift: number
}

function buildCanopy(spec: TreeSpec, shape: CrownShape, rand: () => number) {
  const { height, spread, lift } = shape
  const palette = PALETTES[spec.palette].map((hex) => new THREE.Color(hex))
  // Each tree leans a little warmer or cooler so a grove never reads as one colour.
  const hueShift = (rand() - 0.5) * 0.055
  const satShift = (rand() - 0.5) * 0.12
  palette.forEach((tone) => tone.offsetHSL(hueShift, satShift, 0))

  const crownY = height + 0.5 * spec.scale * lift
  const massCount = 3
  const clumps = Math.round((spec.scale > 1.05 ? 32 : 25) * (0.92 + spread * 0.12))
  const parts: THREE.BufferGeometry[] = []

  const paintClump = (clump: THREE.BufferGeometry, outer: boolean) => {
    paintGeometry(clump, (vertex, color) => {
      const t = THREE.MathUtils.clamp(
        (vertex.y - crownY + 1.7 * spec.scale * lift) / (3.2 * spec.scale * lift),
        0,
        1,
      )
      const tone = palette[Math.min(3, Math.floor(t * 3.2))]
      color.copy(palette[0]).lerp(tone, 0.42 + t * 0.58)

      // Softer dappled light, with the upper leaves catching more sun.
      const dapple =
        Math.sin(vertex.x * 3.1 + spec.seed) *
        Math.cos(vertex.z * 2.7 - spec.seed * 0.5) *
        Math.sin(vertex.y * 1.9)
      color.offsetHSL(0, 0.015, dapple * 0.028 + t * 0.02 + (outer ? 0.01 : 0))
    })
  }

  for (let i = 0; i < clumps; i += 1) {
    // A few large masses give the crown its silhouette, many small ones its texture.
    const mass = i < massCount
    const radius = (mass ? 0.74 + rand() * 0.3 : 0.42 + rand() * 0.32) * spec.scale
    const base = new THREE.IcosahedronGeometry(radius, mass ? 3 : 2)
    base.scale(1.12 + rand() * 0.34, 0.68 + rand() * 0.3, 1.1 + rand() * 0.32)
    base.rotateY(rand() * Math.PI * 2)
    base.rotateZ((rand() - 0.5) * 0.3)
    const clump = organic(base, mass ? 0.26 : 0.36, spec.seed + i * 17)

    const angle = rand() * Math.PI * 2
    const ring = Math.pow(rand(), mass ? 0.5 : 0.62) * 2.0 * spec.scale * spread
    const normalised = ring / (2 * spec.scale * spread)
    const clumpLift = (rand() - 0.24) * 1.45 * spec.scale * lift

    clump.translate(
      Math.cos(angle) * ring + spec.lean * 0.5,
      crownY + clumpLift - Math.pow(normalised, 2) * 0.62 * spec.scale,
      Math.sin(angle) * ring,
    )

    paintClump(clump, ring > 1.35 * spec.scale * spread)
    parts.push(clump)
  }

  // Broad leaf clusters drooping off the crown edge break the silhouette.
  const tassels = 12
  for (let i = 0; i < tassels; i += 1) {
    const radius = (0.2 + rand() * 0.18) * spec.scale
    const tassel = new THREE.IcosahedronGeometry(radius, 2)
    tassel.scale(0.95 + rand() * 0.3, 1.15 + rand() * 0.5, 0.95 + rand() * 0.3)
    const organicTassel = organic(tassel, 0.34, spec.seed * 3 + i)

    const angle = rand() * Math.PI * 2
    const ring = (1.3 + rand() * 0.85) * spec.scale * spread
    organicTassel.translate(
      Math.cos(angle) * ring + spec.lean * 0.4,
      crownY - (0.25 + rand() * 0.9) * spec.scale * lift,
      Math.sin(angle) * ring,
    )

    paintClump(organicTassel, true)
    parts.push(organicTassel)
  }

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())
  return merged
}

export function Trees() {
  const { animate } = useSceneMotion()
  const { material: leafMaterial, uniforms } = useMemo(
    () => createFoliageMaterial({ wind: 1, breakup: 0.26, translucency: 0.62, rim: 0.26 }),
    [],
  )

  const barkMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }),
    [],
  )

  const trees = useMemo(
    () =>
      TREES.map((spec) => {
        const shapeRand = mulberry32(spec.seed * 37 + 11)
        const shape: CrownShape = {
          height: 3.1 * spec.scale * (0.94 + shapeRand() * 0.16),
          spread: 1.0 + shapeRand() * 0.28,
          lift: 1.0 + shapeRand() * 0.22,
        }
        const rand = mulberry32(spec.seed * 97 + 13)
        return {
          spec,
          bark: buildTrunk(spec, shape.height, rand),
          canopy: buildCanopy(spec, shape, rand),
          y: terrainHeight(spec.x, spec.z) - 0.12,
        }
      }),
    [],
  )

  useFrame((_, delta) => {
    if (animate) uniforms.uTime.value += delta
  })

  return (
    <group>
      {trees.map(({ spec, bark, canopy, y }) => (
        <group key={`${spec.x}-${spec.z}`} position={[spec.x, y, spec.z]}>
          <mesh geometry={bark} material={barkMaterial} castShadow receiveShadow />
          <mesh geometry={canopy} material={leafMaterial} castShadow />
        </group>
      ))}
    </group>
  )
}
