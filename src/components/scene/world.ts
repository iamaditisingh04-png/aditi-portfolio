import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** Where the creek begins (at the waterfall) and ends (behind the camera). */
export const CREEK_Z_START = -16.4
export const CREEK_Z_END = 15
export const WATER_LEVEL = 0.06

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Deterministic pseudo-random generator so the world is identical on every load. */
export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Meandering centre line of the creek. */
export function creekCenterX(z: number) {
  return Math.sin(z * 0.16) * 2.3 + Math.sin(z * 0.055 + 1.1) * 1.9
}

/** The creek widens gently as it comes toward the viewer. */
export function creekHalfWidth(z: number) {
  const t = clamp((z - CREEK_Z_START) / (CREEK_Z_END - CREEK_Z_START), 0, 1)
  return 1.2 + t * 1.85
}

export function creekDistance(x: number, z: number) {
  return Math.abs(x - creekCenterX(z))
}

function relief(x: number, z: number) {
  return (
    Math.sin(x * 0.13) * Math.cos(z * 0.11) * 0.95 +
    Math.sin(x * 0.29 + z * 0.19) * 0.4 +
    Math.cos(z * 0.37 - x * 0.23) * 0.3
  )
}

/** Layered, organic landform noise — four octaves of smooth ridged variation. */
export function landNoise(x: number, z: number) {
  let value = 0
  let amplitude = 1
  let frequency = 0.085

  for (let i = 0; i < 4; i += 1) {
    value +=
      amplitude *
      Math.sin(x * frequency + Math.cos(z * frequency * 1.27) * 1.5) *
      Math.cos(z * frequency * 0.83 - Math.sin(x * frequency * 0.71))
    amplitude *= 0.52
    frequency *= 2.11
  }

  return value
}

/**
 * Heightfield: the creek bed lifts to the waterline right at the bank, then
 * climbs into meadow and distant hills. Keeping the shore tight is what makes
 * the water read as a real creek instead of a trench.
 */
export function terrainHeight(x: number, z: number) {
  const width = creekHalfWidth(z)
  const distance = creekDistance(x, z)
  const shore = smoothstep(width * 0.56, width * 1.03, distance)
  const bank = smoothstep(width * 1.0, width * 4.4, distance) * (1.72 + landNoise(x, z) * 1.15)
  const bed = -0.95 + Math.sin(x * 0.9 + z * 0.7) * 0.045
  const ridges =
    smoothstep(12, 40, Math.abs(x)) * (4.2 + landNoise(x * 0.62, z * 0.62) * 1.9) +
    smoothstep(18, 56, -z) * (5.4 + landNoise(x * 0.5 + 3, z * 0.5) * 2.1)
  const micro = Math.sin(x * 1.9) * Math.cos(z * 1.7) * 0.035

  return bed + shore * 1.2 + bank + ridges + micro
}

const PALETTE = {
  bed: new THREE.Color('#2c5140'),
  moss: new THREE.Color('#5b8548'),
  leaf: new THREE.Color('#78a85b'),
  lime: new THREE.Color('#b5cf78'),
  forest: new THREE.Color('#315c3b'),
  blush: new THREE.Color('#e9a5ae'),
  sun: new THREE.Color('#cfd98c'),
}

/** Hand-tuned meadow colouring: mossy near water, flowery patches on the banks. */
export function terrainColor(x: number, z: number, height: number, target = new THREE.Color()) {
  const width = creekHalfWidth(z)
  const distance = creekDistance(x, z)
  const n = relief(x, z)
  const patch = Math.sin(x * 0.21 + z * 0.13) * Math.cos(x * 0.09 - z * 0.17)

  const detail = landNoise(x * 1.6, z * 1.6)

  target.copy(PALETTE.moss).lerp(PALETTE.leaf, clamp(0.5 + n * 0.45, 0, 1))
  target.lerp(PALETTE.lime, clamp(0.4 + n * 0.5 + detail * 0.25, 0, 1) * 0.36)
  target.lerp(PALETTE.forest, smoothstep(2.4, 8.5, height) * 0.6)
  if (distance < width * 1.35) target.lerp(PALETTE.bed, 0.42)
  if (patch > 0.45) target.lerp(PALETTE.blush, 0.2)
  if (detail < -0.5) target.lerp(PALETTE.forest, 0.18)

  // Golden light pooled on the open meadow, so the banks are never one flat green.
  const warmth = clamp(0.5 + n * 0.6, 0, 1) * smoothstep(0.5, 2.6, height)
  target.lerp(PALETTE.sun, warmth * 0.16)

  return target
}

/** Convert to non-indexed geometry only when needed (for safe merging). */
export function ensureNonIndexed<T extends THREE.BufferGeometry>(geometry: T): T {
  return (geometry.index ? geometry.toNonIndexed() : geometry) as T
}

/**
 * Turns a hard-edged primitive into a soft organic mass: displaces every vertex
 * by a smooth positional field, welds the seams, and recomputes smooth normals.
 * Because displacement depends only on position, duplicated vertices stay welded
 * instead of tearing the surface apart.
 */
export function organic(geometry: THREE.BufferGeometry, amount = 0.28, seed = 1) {
  const position = geometry.attributes.position as THREE.BufferAttribute
  const vertex = new THREE.Vector3()

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i)
    const wobble =
      Math.sin(vertex.x * 3.7 + seed * 1.3) *
      Math.cos(vertex.y * 4.1 - seed * 0.7) *
      Math.sin(vertex.z * 3.3 + seed * 0.4) +
      Math.sin(vertex.y * 6.1 + vertex.x * 2.3 + seed) * 0.35
    const scale = 1 + wobble * amount
    position.setXYZ(i, vertex.x * scale, vertex.y * scale, vertex.z * scale)
  }

  // Per-face normals and seams block welding, so drop them before smoothing.
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')

  const welded = mergeVertices(geometry, 0.0001)
  welded.computeVertexNormals()
  const result = welded.toNonIndexed()

  // Keep a (unused) uv attribute so foliage parts can still be merged together.
  const count = result.attributes.position.count
  result.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2))

  welded.dispose()
  geometry.dispose()
  return result
}
