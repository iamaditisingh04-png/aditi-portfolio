
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {
  creekDistance,
  creekHalfWidth,
  mulberry32,
  terrainHeight,
} from './world'

// Merge geometries using position attributes only.
function mergeParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const positionOnly: THREE.BufferGeometry[] = []

  for (const part of parts) {
    const source = part.index ? part.toNonIndexed() : part.clone()
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
      'position',
      source.getAttribute('position').clone(),
    )

    source.dispose()
    positionOnly.push(geometry)
  }

  const merged = mergeGeometries(positionOnly, false)

  positionOnly.forEach((geometry) => geometry.dispose())
  parts.forEach((geometry) => geometry.dispose())

  if (!merged) {
    throw new Error('Could not merge flower geometry.')
  }

  merged.computeVertexNormals()
  return merged
}

// Curved, tapered petals.
function buildPetal(size = 0.105) {
  const positions: number[] = []
  const indices: number[] = []

  const rows = 12
  const columns = 10

  for (let row = 0; row <= rows; row++) {
    const v = row / rows

    for (let column = 0; column <= columns; column++) {
      const u = (column / columns) * 2 - 1

      const width =
        size * Math.pow(Math.sin(Math.PI * v), 0.55)

      const x = u * width + 0.035 * v * v
      const y = v * size * 2.2
      const z =
        -Math.pow(u, 2) * size * 0.18 +
        Math.sin(v * Math.PI) * size * 0.1

      positions.push(x, y, z)
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * (columns + 1) + column
      const b = a + columns + 1

      indices.push(a, b, a + 1)
      indices.push(a + 1, b, b + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )

  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

// Kept for compatibility with Foreground.tsx.
export function buildFlower(
  petalColor: string,
  centerColor: string,
  petalCount: number,
  petalSize: number,
  stemHeight: number,
) {
  void petalColor
  void centerColor

  const parts: THREE.BufferGeometry[] = []

  const stem = new THREE.CylinderGeometry(
    0.012,
    0.019,
    stemHeight,
    8,
  )

  stem.translate(0, stemHeight / 2, 0)
  parts.push(stem)

  const petalGeometry = buildPetal(petalSize)

  for (let i = 0; i < petalCount; i++) {
    const petal = petalGeometry.clone()

    petal.rotateY((i / petalCount) * Math.PI * 2)
    petal.translate(0, stemHeight, 0)

    parts.push(petal)
  }

  petalGeometry.dispose()

  return mergeParts(parts)
}

// Long pointed tulip leaves.
function buildLeaf() {
  const positions: number[] = []
  const indices: number[] = []

  const rows = 14

  for (let i = 0; i <= rows; i++) {
    const t = i / rows

    const width =
      0.065 * Math.pow(Math.sin(Math.PI * t), 0.8)

    const y = t * 0.68
    const z = -0.018 * Math.sin(t * Math.PI)

    positions.push(-width, y, z)
    positions.push(width, y, z)
  }

  for (let i = 0; i < rows; i++) {
    const a = i * 2

    indices.push(a, a + 2, a + 1)
    indices.push(a + 1, a + 2, a + 3)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )

  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

// Stems and angled leaves.
function buildTulipStem() {
  const parts: THREE.BufferGeometry[] = []

  const stem = new THREE.CylinderGeometry(
    0.012,
    0.018,
    0.58,
    8,
  )

  stem.translate(0, 0.29, 0)
  parts.push(stem)

  for (const side of [-1, 1]) {
    const leaf = buildLeaf()

    leaf.rotateZ(side * 0.42)
    leaf.translate(side * 0.035, 0.12, 0)

    parts.push(leaf)
  }

  return mergeParts(parts)
}

// Six petals create an open tulip cup.
function buildTulipBloom() {
  const parts: THREE.BufferGeometry[] = []
  const flowerHeight = 0.58

  const petal = buildPetal(0.095)

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const layer = petal.clone()

    layer.rotateY(-angle)
    layer.rotateX(i % 2 === 0 ? -0.08 : 0.08)

    layer.translate(
      Math.cos(angle) * 0.035,
      flowerHeight - 0.045,
      Math.sin(angle) * 0.035,
    )

    parts.push(layer)
  }

  petal.dispose()

  return mergeParts(parts)
}

type TulipPlacement = {
  matrix: THREE.Matrix4
  tint: THREE.Color
}

// Natural flower distribution with room for the river and cottage.
function createTulipPlacements(count: number): TulipPlacement[] {
  const rand = mulberry32(927)
  const placements: TulipPlacement[] = []

  const palette = [
    '#e88ca8',
    '#ef9eb5',
    '#f4bdca',
    '#d982a8',
    '#f7e6dc',
    '#f1c0a8',
    '#d66b86',
    '#e9a0a0',
    '#f8d9df',
  ]

  const position = new THREE.Vector3()
  const rotation = new THREE.Quaternion()
  const scale = new THREE.Vector3()
  const matrix = new THREE.Matrix4()
  const euler = new THREE.Euler()

  let attempts = 0

  while (
    placements.length < count &&
    attempts < count * 60
  ) {
    attempts++

    const x = (rand() - 0.5) * 66
    const z = rand() * 58 - 28

    // Keep the river and its banks clear.
    const distance = creekDistance(x, z)
    const width = creekHalfWidth(z)

    if (distance < width * 1.65) continue

    // Keep the entire connected cottage and its entrance clear.
    // The connected rooms extend along the X-axis.
    const cottageStart = 8
    const cottageEnd = 26
    const cottageCenter = (cottageStart + cottageEnd) / 2
    const cottageHalfLength = (cottageEnd - cottageStart) / 2 + 4
    const cottageHalfDepth = 10

    const cottageDistance =
      Math.pow((x - cottageCenter) / cottageHalfLength, 2) +
      Math.pow((z + 1) / cottageHalfDepth, 2)

    if (cottageDistance < 1) continue

    const y = terrainHeight(x, z)

    position.set(x, y + 0.015, z)

    euler.set(
      (rand() - 0.5) * 0.16,
      rand() * Math.PI * 2,
      (rand() - 0.5) * 0.16,
    )

    rotation.setFromEuler(euler)

    const size = 0.82 + rand() * 0.48

    scale.set(
      size * (0.9 + rand() * 0.2),
      size,
      size * (0.9 + rand() * 0.2),
    )

    matrix.compose(position, rotation, scale)

    placements.push({
      matrix: matrix.clone(),
      tint: new THREE.Color(
        palette[Math.floor(rand() * palette.length)],
      ),
    })
  }

  return placements
}

function TulipField() {
  const { quality } = useSceneMotionFallback()

  const count = quality === 'high' ? 8500 : 5000

  const stemRef = useRef<THREE.InstancedMesh>(null)
  const bloomRef = useRef<THREE.InstancedMesh>(null)

  const stemGeometry = useMemo(() => buildTulipStem(), [])
  const bloomGeometry = useMemo(() => buildTulipBloom(), [])

  const stemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#557c48',
        roughness: 0.88,
        side: THREE.DoubleSide,
      }),
    [],
  )

  // One permanent material, with no day/night changes.
  const bloomMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.72,
        side: THREE.DoubleSide,
      }),
    [],
  )

  const placements = useMemo(
    () => createTulipPlacements(count),
    [count],
  )

  useLayoutEffect(() => {
    const stems = stemRef.current
    const blooms = bloomRef.current

    if (!stems || !blooms) return

    placements.forEach((flower, index) => {
      stems.setMatrixAt(index, flower.matrix)
      blooms.setMatrixAt(index, flower.matrix)
      blooms.setColorAt(index, flower.tint)
    })

    stems.instanceMatrix.needsUpdate = true
    blooms.instanceMatrix.needsUpdate = true

    if (blooms.instanceColor) {
      blooms.instanceColor.needsUpdate = true
    }
  }, [placements])

  return (
    <group>
      <instancedMesh
        ref={stemRef}
        args={[stemGeometry, stemMaterial, placements.length]}
        frustumCulled={false}
        castShadow
      />

      <instancedMesh
        ref={bloomRef}
        args={[bloomGeometry, bloomMaterial, placements.length]}
        frustumCulled={false}
        castShadow
      />
    </group>
  )
}

function useSceneMotionFallback() {
  return useSceneMotion()
}

export function Flora() {
  return (
    <group>
      <TulipField />
    </group>
  )
}
