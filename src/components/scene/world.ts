
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** River runs along the left side of the garden. */
export const CREEK_Z_START = -16.4
export const CREEK_Z_END = 15
export const WATER_LEVEL = 0.06

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Deterministic pseudo-random generator. */
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

/** Gentle meandering river positioned on the left. */
export function creekCenterX(z: number) {
  return (
    -8.5 +
    Math.sin(z * 0.16) * 0.8 +
    Math.sin(z * 0.055 + 1.1) * 0.65
  )
}

/** Narrow river that widens slightly toward the viewer. */
export function creekHalfWidth(z: number) {
  const t = clamp(
    (z - CREEK_Z_START) / (CREEK_Z_END - CREEK_Z_START),
    0,
    1,
  )

  return 0.85 + t * 0.65
}

export function creekDistance(x: number, z: number) {
  return Math.abs(x - creekCenterX(z))
}

/** Kept for compatibility with existing scene components. */
export function landNoise(x: number, z: number) {
  return (
    Math.sin(x * 0.085 + Math.cos(z * 0.11) * 1.5) *
    Math.cos(z * 0.07 - Math.sin(x * 0.06))
  )
}

/** Completely flat garden floor. */
export function terrainHeight(_x: number, _z: number) {
  return 0
}

const PALETTE = {
  bed: new THREE.Color('#2c5140'),
  moss: new THREE.Color('#72965b'),
  leaf: new THREE.Color('#91ad68'),
  lime: new THREE.Color('#b5c987'),
  forest: new THREE.Color('#527348'),
  blush: new THREE.Color('#e9a5ae'),
  sun: new THREE.Color('#e8d49a'),
}

/** Soft countryside garden ground colours. */
export function terrainColor(
  x: number,
  z: number,
  _height: number,
  target = new THREE.Color(),
) {
  const distance = creekDistance(x, z)
  const width = creekHalfWidth(z)

  const variation =
    Math.sin(x * 0.21 + z * 0.13) *
    Math.cos(x * 0.09 - z * 0.17)

  target
    .copy(PALETTE.moss)
    .lerp(PALETTE.leaf, clamp(0.5 + variation * 0.35, 0, 1))

  target.lerp(
    PALETTE.lime,
    clamp(0.35 + variation * 0.25, 0, 1) * 0.2,
  )

  if (distance < width * 1.2) {
    target.lerp(PALETTE.bed, 0.25)
  }

  target.lerp(PALETTE.sun, 0.08)

  return target
}

/** Convert to non-indexed geometry only when needed. */
export function ensureNonIndexed<T extends THREE.BufferGeometry>(
  geometry: T,
): T {
  return (geometry.index ? geometry.toNonIndexed() : geometry) as T
}

/** Organic geometry helper retained for existing scene components. */
export function organic(
  geometry: THREE.BufferGeometry,
  amount = 0.28,
  seed = 1,
) {
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

    position.setXYZ(
      i,
      vertex.x * scale,
      vertex.y * scale,
      vertex.z * scale,
    )
  }

  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')

  const welded = mergeVertices(geometry, 0.0001)
  welded.computeVertexNormals()

  const result = welded.toNonIndexed()
  const count = result.attributes.position.count

  result.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(
      new Float32Array(count * 2),
      2,
    ),
  )

  welded.dispose()
  geometry.dispose()

  return result
}
