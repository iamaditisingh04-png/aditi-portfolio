import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useSceneMotion } from './sceneMotion'
import { paintGeometry } from './paint'
import {
  creekDistance,
  creekHalfWidth,
  ensureNonIndexed,
  landNoise,
  mulberry32,
  organic,
  terrainHeight,
} from './world'

/** A full double-ring bloom with a stem, used for daisies, cosmos and poppies. */
export function buildFlower(
  petalColor: string,
  centerColor: string,
  petalCount: number,
  petalSize: number,
  stemHeight: number,
) {
  const petal = new THREE.Color(petalColor)
  const petalTip = new THREE.Color(petalColor).lerp(new THREE.Color('#ffffff'), 0.34)
  const stemDark = new THREE.Color('#3e6a37')
  const stemLight = new THREE.Color('#84b25e')

  const stem = ensureNonIndexed(new THREE.CylinderGeometry(0.011, 0.019, stemHeight, 5))
  stem.translate(0, stemHeight / 2, 0)
  paintGeometry(stem, (vertex, color) => {
    color.copy(stemDark).lerp(stemLight, THREE.MathUtils.clamp(vertex.y / stemHeight, 0, 1))
  })
  const parts: THREE.BufferGeometry[] = [stem]

  for (let ring = 0; ring < 2; ring += 1) {
    const count = ring === 0 ? petalCount : Math.max(4, petalCount - 3)
    const size = ring === 0 ? petalSize : petalSize * 0.64

    for (let i = 0; i < count; i += 1) {
      const geometry = ensureNonIndexed(new THREE.SphereGeometry(size, ring === 0 ? 7 : 6, 4))
      geometry.scale(1, 0.2, 2.05)
      geometry.translate(0, 0, size * 1.25)
      geometry.rotateX(-0.16 - ring * 0.14)
      geometry.rotateY((i / count) * Math.PI * 2 + ring * 0.42)
      geometry.translate(0, stemHeight + ring * 0.012, 0)

      paintGeometry(geometry, (vertex, color) => {
        const t = THREE.MathUtils.clamp(vertex.z / (size * 3.2), 0, 1)
        color.copy(petal).lerp(petalTip, t * 0.55)
      })
      parts.push(geometry)
    }
  }

  const center = ensureNonIndexed(new THREE.SphereGeometry(petalSize * 0.52, 9, 6))
  center.scale(1, 0.6, 1)
  center.translate(0, stemHeight + 0.006, 0)
  paintGeometry(center, (vertex, color) => {
    color.set(centerColor)
    color.offsetHSL(0, 0, Math.sin(vertex.x * 46) * 0.035)
  })
  parts.push(center)

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())
  return merged
}

/** Hanging bluebells on a slender stem. */
function buildBluebell() {
  const stemHeight = 0.5
  const stem = ensureNonIndexed(new THREE.CylinderGeometry(0.009, 0.016, stemHeight, 5))
  stem.translate(0, stemHeight / 2, 0)
  paintGeometry(stem, (vertex, color) => {
    color.set('#3e6a37').lerp(new THREE.Color('#7aa958'), THREE.MathUtils.clamp(vertex.y / stemHeight, 0, 1))
  })
  const parts: THREE.BufferGeometry[] = [stem]

  for (let i = 0; i < 4; i += 1) {
    const bell = ensureNonIndexed(new THREE.ConeGeometry(0.05, 0.15, 6, 1))
    bell.translate(0.055 + i * 0.012, stemHeight - i * 0.085, 0)
    paintGeometry(bell, (vertex, color) => {
      const t = THREE.MathUtils.clamp((vertex.y - stemHeight + 0.4) / 0.4, 0, 1)
      color.set('#6f7fd4').lerp(new THREE.Color('#c3cdf6'), t * 0.7)
    })
    parts.push(bell)
  }

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())
  return merged
}

/** A lavender spike: many tiny florets stacked up the stem. */
function buildLavender() {
  const stemHeight = 0.62
  const stem = ensureNonIndexed(new THREE.CylinderGeometry(0.008, 0.014, stemHeight, 5))
  stem.translate(0, stemHeight / 2, 0)
  paintGeometry(stem, (vertex, color) => {
    color.set('#40663a').lerp(new THREE.Color('#7ea45a'), THREE.MathUtils.clamp(vertex.y / stemHeight, 0, 1))
  })
  const parts: THREE.BufferGeometry[] = [stem]

  for (let i = 0; i < 14; i += 1) {
    const floret = ensureNonIndexed(new THREE.SphereGeometry(0.026, 6, 4))
    const angle = i * 2.4
    const radius = 0.022 + i * 0.002
    floret.translate(Math.cos(angle) * radius, 0.36 + i * 0.021, Math.sin(angle) * radius)
    paintGeometry(floret, (_vertex, color) => {
      color.set('#8c6fc4').lerp(new THREE.Color('#dcc8f2'), i / 14)
    })
    parts.push(floret)
  }

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())
  return merged
}

/** A single curved, tapering blade built from a soft V-shaped strip. */
function buildBlade(height: number, width: number, curve: number, twist: number) {
  const segments = 4
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const w = width * (1 - t * 0.92)
    const x = curve * t * t + Math.sin(t * 2.6) * twist
    const y = height * t
    positions.push(-w, y, x - w * 0.32, w, y, x + w * 0.32)
    uvs.push(0, t, 1, t)
    if (i < segments) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry.toNonIndexed()
}

/** A tuft of tapered blades, optionally with seed heads. */
function buildGrassTuft(blades: number, height: number, seedHead: boolean, seed: number) {
  const parts: THREE.BufferGeometry[] = []
  const base = new THREE.Color('#3f6834')
  const mid = new THREE.Color('#6d9a4b')
  const tip = new THREE.Color('#b2d078')
  const rand = mulberry32(seed)

  for (let i = 0; i < blades; i += 1) {
    const bladeHeight = height * (0.68 + rand() * 0.55)
    const blade = buildBlade(bladeHeight, 0.032 + rand() * 0.012, (rand() - 0.35) * 0.3, (rand() - 0.5) * 0.12)
    blade.rotateZ((rand() - 0.5) * 0.55)
    blade.rotateX((rand() - 0.5) * 0.3)
    blade.rotateY((i / blades) * Math.PI * 2 + rand() * 0.5)
    blade.translate((rand() - 0.5) * 0.13, 0, (rand() - 0.5) * 0.13)

    paintGeometry(blade, (vertex, color) => {
      const t = THREE.MathUtils.clamp(vertex.y / bladeHeight, 0, 1)
      color.copy(base).lerp(mid, Math.min(1, t * 1.6))
      if (t > 0.55) color.lerp(tip, (t - 0.55) / 0.45)
    })
    parts.push(blade)

    if (seedHead && i % 2 === 0) {
      const head = ensureNonIndexed(new THREE.SphereGeometry(0.026, 6, 4))
      head.scale(1, 2.4, 1)
      head.translate(0, bladeHeight * (0.86 + rand() * 0.16), 0)
      paintGeometry(head, (_vertex, color) => color.set('#dcc98d'))
      parts.push(head)
    }
  }

  return mergeGeometries(parts)!
}

/** Low clover-like ground cover that fills the gaps between the flowers. */
function buildGroundCover(seed: number) {
  const parts: THREE.BufferGeometry[] = []
  const rand = mulberry32(seed)
  const dark = new THREE.Color('#375f31')
  const light = new THREE.Color('#7fae56')

  for (let i = 0; i < 6; i += 1) {
    const leaf = ensureNonIndexed(new THREE.SphereGeometry(0.085, 6, 3))
    leaf.scale(1, 0.16, 1.85)
    const angle = (i / 6) * Math.PI * 2 + rand() * 0.5
    leaf.rotateZ(rand() * 0.3)
    leaf.rotateY(angle)
    leaf.translate(Math.cos(angle) * 0.1, 0.03 + rand() * 0.02, Math.sin(angle) * 0.1)
    paintGeometry(leaf, (vertex, color) => {
      const t = THREE.MathUtils.clamp(vertex.y / 0.06 + Math.hypot(vertex.x, vertex.z), 0, 1)
      color.copy(dark).lerp(light, 0.35 + t * 0.55)
    })
    parts.push(leaf)
  }

  return mergeGeometries(parts)!
}

function buildBush(seed: number) {
  const parts: THREE.BufferGeometry[] = []
  const rand = mulberry32(seed)
  const dark = new THREE.Color('#315832')
  const light = new THREE.Color('#93c168')

  for (let i = 0; i < 9; i += 1) {
    const radius = 0.38 + rand() * 0.44
    const base = new THREE.IcosahedronGeometry(radius, 2)
    base.scale(1.1, 0.86, 1.1)
    const clump = organic(base, 0.3, seed + i * 5)
    const angle = rand() * Math.PI * 2
    const ring = rand() * 0.66
    clump.translate(Math.cos(angle) * ring, radius * 0.66 + rand() * 0.32, Math.sin(angle) * ring)
    paintGeometry(clump, (vertex, color) => {
      const t = THREE.MathUtils.clamp(vertex.y / 1.15, 0, 1)
      color.copy(dark).lerp(light, t * 0.9)
      color.offsetHSL(0, 0.01, Math.sin(vertex.x * 6.1 + vertex.z * 4.7) * 0.03)
    })
    parts.push(clump)
  }

  return mergeGeometries(parts)!
}

/** A fern: arching fronds with paired leaflets, for the shaded banks. */
function buildFern(seed: number) {
  const rand = mulberry32(seed)
  const parts: THREE.BufferGeometry[] = []
  const dark = new THREE.Color('#2d5531')
  const light = new THREE.Color('#79ad50')
  const fronds = 6

  for (let f = 0; f < fronds; f += 1) {
    const length = 0.5 + rand() * 0.4
    const frond = buildBlade(length, 0.018, 0.16 + rand() * 0.22, 0.04)
    frond.rotateZ(0.5 + rand() * 0.4)
    frond.rotateY((f / fronds) * Math.PI * 2 + rand() * 0.6)
    frond.translate((rand() - 0.5) * 0.06, 0, (rand() - 0.5) * 0.06)
    paintGeometry(frond, (vertex, color) => {
      const t = THREE.MathUtils.clamp(vertex.y / length, 0, 1)
      color.copy(dark).lerp(light, t * 0.9)
    })
    parts.push(frond)

    const pairs = 5
    for (let i = 1; i <= pairs; i += 1) {
      const t = i / (pairs + 1)
      const size = 0.085 * (1 - t * 0.55)
      for (const side of [-1, 1]) {
        const leaflet = ensureNonIndexed(new THREE.SphereGeometry(size, 4, 2))
        leaflet.scale(2.1, 0.22, 0.85)
        leaflet.rotateZ(-0.35 * side)
        leaflet.translate(side * (0.03 + size * 0.9) + 0.15 * t * t, length * t, 0)
        leaflet.rotateY((f / fronds) * Math.PI * 2)
        paintGeometry(leaflet, (vertex, color) => {
          color.copy(dark).lerp(light, 0.35 + t * 0.6 + vertex.y * 0.4)
        })
        parts.push(leaflet)
      }
    }
  }

  return mergeGeometries(parts)!
}

/** Shared swaying material for anything grown from the meadow. */
function useWindMaterial(sway: number, cacheKey: string) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0,
      side: THREE.DoubleSide,
    })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.uniforms.uSway = { value: sway }
      shader.vertexShader = `uniform float uTime;\nuniform float uSway;\n${shader.vertexShader}`.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float phase = instanceMatrix[3].x * 0.85 + instanceMatrix[3].z * 0.65;
         float wind = sin(uTime * 1.15 + phase) + 0.45 * sin(uTime * 2.3 + phase * 1.7);
         float bend = max(transformed.y, 0.0);
         transformed.x += wind * uSway * bend;
         transformed.z += wind * uSway * 0.6 * bend;`,
      )
    }
    mat.customProgramCacheKey = () => `meadow-wind-${cacheKey}`
    return mat
  }, [cacheKey, sway, uniforms])

  return { material, uniforms }
}

type ScatterOptions = {
  count: number
  seed: number
  minDistance: number
  maxDistance: number
  scaleRange: [number, number]
  threshold: number
  tints: string[]
  maxHeight?: number
}

type Placement = { matrix: THREE.Matrix4; tint: THREE.Color }

function scatter({ count, seed, minDistance, maxDistance, scaleRange, threshold, tints, maxHeight = 5.5 }: ScatterOptions) {
  const rand = mulberry32(seed)
  const placements: Placement[] = []
  const matrix = new THREE.Matrix4()
  const position = new THREE.Vector3()
  const quaternion = new THREE.Quaternion()
  const scale = new THREE.Vector3()
  const euler = new THREE.Euler()

  let attempts = 0
  while (placements.length < count && attempts < count * 34) {
    attempts += 1
    const x = (rand() - 0.5) * 54
    const z = rand() * 42 - 22
    const width = creekHalfWidth(z)
    const distance = creekDistance(x, z)
    if (distance < width * minDistance || distance > width * maxDistance) continue

    // Patchy, grove-like distribution instead of an even sprinkle.
    const patch = landNoise(x * 0.5 + seed * 0.31, z * 0.5)
    if (patch < threshold) continue

    const y = terrainHeight(x, z)
    if (y > maxHeight) continue

    position.set(x, y, z)
    euler.set((rand() - 0.5) * 0.22, rand() * Math.PI * 2, (rand() - 0.5) * 0.22)
    quaternion.setFromEuler(euler)
    const s = scaleRange[0] + rand() * (scaleRange[1] - scaleRange[0])
    scale.set(s, s * (0.85 + rand() * 0.35), s)
    matrix.compose(position, quaternion, scale)

    placements.push({
      matrix: matrix.clone(),
      tint: new THREE.Color(tints[Math.floor(rand() * tints.length)]),
    })
  }

  return placements
}

type FieldProps = {
  geometry: THREE.BufferGeometry
  options: ScatterOptions
  sway: number
  materialKey: string
}

function FlowerField({ geometry, options, sway, materialKey }: FieldProps) {
  const { animate } = useSceneMotion()
  const { material, uniforms } = useWindMaterial(sway, materialKey)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const placements = useMemo(() => scatter(options), [options])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    placements.forEach((placement, index) => {
      mesh.setMatrixAt(index, placement.matrix)
      mesh.setColorAt(index, placement.tint)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [placements])

  useFrame((_, delta) => {
    if (animate) uniforms.uTime.value += delta
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, placements.length]}
      frustumCulled={false}
      castShadow={false}
    />
  )
}

/** Wildflowers, grass, bushes and moss across the banks. */
export function Flora() {
  const { quality } = useSceneMotion()
  const dense = quality === 'high'
  const k = dense ? 1 : 0.5

  const daisy = useMemo(() => buildFlower('#fffaf0', '#f5cd68', 9, 0.075, 0.34), [])
  const cosmos = useMemo(() => buildFlower('#f0afbb', '#f7d98a', 7, 0.09, 0.46), [])
  const buttercup = useMemo(() => buildFlower('#f8d977', '#e09a4c', 5, 0.07, 0.26), [])
  const poppy = useMemo(() => buildFlower('#e2603f', '#3b2a1e', 4, 0.13, 0.52), [])
  const bluebell = useMemo(() => buildBluebell(), [])
  const lavender = useMemo(() => buildLavender(), [])

  const grass = useMemo(() => buildGrassTuft(4, 0.55, false, 21), [])
  const tallGrass = useMemo(() => buildGrassTuft(3, 1.05, true, 33), [])
  const bush = useMemo(() => buildBush(19), [])
  const clover = useMemo(() => buildGroundCover(521), [])
  const fern = useMemo(() => buildFern(211), [])

  const daisyOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(250 * k),
      seed: 11,
      minDistance: 1.08,
      maxDistance: 6,
      scaleRange: [0.42, 1.18],
      threshold: 0.05,
      tints: ['#fff6e2', '#ffeedd', '#fdf1e2', '#f7e8ff', '#ffe9ef'],
    }),
    [k],
  )

  const cosmosOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(190 * k),
      seed: 29,
      minDistance: 1.2,
      maxDistance: 9,
      scaleRange: [0.45, 1.25],
      threshold: -0.15,
      tints: ['#fff4f6', '#ffe0ea', '#ffd1de', '#f6e6ff', '#fff2dd'],
    }),
    [k],
  )

  const buttercupOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(210 * k),
      seed: 43,
      minDistance: 1.02,
      maxDistance: 5,
      scaleRange: [0.42, 1.15],
      threshold: -0.05,
      tints: ['#fff8d6', '#ffeeb0', '#fffbe6', '#ffe2b8', '#fdf6c9'],
    }),
    [k],
  )

  const poppyOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(115 * k),
      seed: 61,
      minDistance: 1.25,
      maxDistance: 6.5,
      scaleRange: [0.5, 1.2],
      threshold: 0.22,
      tints: ['#fff2e8', '#ffe0cc', '#ffcdb8', '#ffe9d2'],
    }),
    [k],
  )

  const bluebellOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(155 * k),
      seed: 73,
      minDistance: 1.15,
      maxDistance: 7,
      scaleRange: [0.5, 1.25],
      threshold: 0.12,
      tints: ['#f4f6ff', '#e2e8ff', '#efe4ff', '#f8f2ff'],
    }),
    [k],
  )

  const lavenderOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(100 * k),
      seed: 89,
      minDistance: 1.3,
      maxDistance: 7.5,
      scaleRange: [0.55, 1.35],
      threshold: 0.3,
      tints: ['#f6ecff', '#e9d8ff', '#fdf0ff'],
    }),
    [k],
  )

  const grassOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(2400 * k),
      seed: 113,
      minDistance: 1.0,
      maxDistance: 8,
      scaleRange: [0.6, 1.45],
      threshold: -1,
      tints: ['#ffffff', '#f2f7e6', '#e8f0d8'],
      maxHeight: 6.5,
    }),
    [k],
  )

  const tallGrassOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(560 * k),
      seed: 131,
      minDistance: 1.1,
      maxDistance: 7,
      scaleRange: [0.7, 1.5],
      threshold: -0.35,
      tints: ['#ffffff', '#fdf4dd', '#eef6dd'],
      maxHeight: 6,
    }),
    [k],
  )

  const bushOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(82 * k),
      seed: 151,
      minDistance: 1.25,
      maxDistance: 9,
      scaleRange: [0.6, 1.6],
      threshold: -0.25,
      tints: ['#ffffff', '#e6f2d8', '#d9ecd0'],
      maxHeight: 7,
    }),
    [k],
  )

  const cloverOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(620 * k),
      seed: 173,
      minDistance: 1.0,
      maxDistance: 7.5,
      scaleRange: [0.7, 1.7],
      threshold: -1,
      tints: ['#ffffff', '#f0f7e2', '#e4f0d6'],
      maxHeight: 6.8,
    }),
    [k],
  )

  const fernOptions = useMemo<ScatterOptions>(
    () => ({
      count: Math.round(96 * k),
      seed: 191,
      minDistance: 1.05,
      maxDistance: 5.5,
      scaleRange: [0.7, 1.5],
      threshold: 0.05,
      tints: ['#ffffff', '#eef6e4', '#e6f0dd'],
      maxHeight: 5,
    }),
    [k],
  )

  return (
    <group>
      <FlowerField geometry={daisy} options={daisyOptions} sway={0.075} materialKey="daisy" />
      <FlowerField geometry={cosmos} options={cosmosOptions} sway={0.085} materialKey="cosmos" />
      <FlowerField geometry={buttercup} options={buttercupOptions} sway={0.07} materialKey="buttercup" />
      <FlowerField geometry={poppy} options={poppyOptions} sway={0.06} materialKey="poppy" />
      <FlowerField geometry={bluebell} options={bluebellOptions} sway={0.09} materialKey="bluebell" />
      <FlowerField geometry={lavender} options={lavenderOptions} sway={0.1} materialKey="lavender" />
      <FlowerField geometry={grass} options={grassOptions} sway={0.05} materialKey="grass" />
      <FlowerField geometry={tallGrass} options={tallGrassOptions} sway={0.045} materialKey="tall-grass" />
      <FlowerField geometry={bush} options={bushOptions} sway={0.05} materialKey="bush" />
      <FlowerField geometry={clover} options={cloverOptions} sway={0.012} materialKey="clover" />
      <FlowerField geometry={fern} options={fernOptions} sway={0.03} materialKey="fern" />
      <Moss />
    </group>
  )
}

/** Low moss cushions hugging the waterline. */
function Moss() {
  const { quality } = useSceneMotion()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const patches = useMemo(() => {
    const rand = mulberry32(317)
    const count = quality === 'high' ? 90 : 45
    const result: Array<{ position: [number, number, number]; scale: [number, number, number]; rotation: number; tint: string }> = []

    let attempts = 0
    while (result.length < count && attempts < count * 20) {
      attempts += 1
      const z = rand() * 36 - 17
      const width = creekHalfWidth(z)
      const side = rand() > 0.5 ? 1 : -1
      const x = creekCenterXAt(z) + side * width * (0.95 + rand() * 0.55)
      const y = terrainHeight(x, z) + 0.02
      result.push({
        position: [x, y, z],
        scale: [0.22 + rand() * 0.4, 0.04 + rand() * 0.07, 0.22 + rand() * 0.4],
        rotation: rand() * Math.PI,
        tint: ['#4a7a3f', '#5d8f46', '#3e6a37', '#79a558'][Math.floor(rand() * 4)],
      })
    }
    return result
  }, [quality])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    patches.forEach((patch, index) => {
      dummy.position.set(...patch.position)
      dummy.rotation.set(0, patch.rotation, 0)
      dummy.scale.set(...patch.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      color.set(patch.tint)
      mesh.setColorAt(index, color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [color, dummy, patches])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, patches.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 6]} />
      <meshStandardMaterial color="#ffffff" roughness={1} flatShading={false} />
    </instancedMesh>
  )
}

/** Local copy of the creek centreline, kept private to the moss scatter. */
function creekCenterXAt(z: number) {
  return Math.sin(z * 0.16) * 2.3 + Math.sin(z * 0.055 + 1.1) * 1.9
}
