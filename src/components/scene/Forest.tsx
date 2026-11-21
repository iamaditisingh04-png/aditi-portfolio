import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { paintGeometry } from './paint'
import { createFoliageMaterial } from './foliage'
import { ensureNonIndexed, landNoise, mulberry32, organic, terrainHeight } from './world'

type Band = {
  zFrom: number
  zTo: number
  count: number
  scaleFrom: number
  scaleTo: number
  tint: string
}

const BANDS: Band[] = [
  { zFrom: -19, zTo: -28, count: 26, scaleFrom: 1.1, scaleTo: 1.8, tint: '#f2f7ec' },
  { zFrom: -28, zTo: -38, count: 34, scaleFrom: 1.2, scaleTo: 2.1, tint: '#e8f0dd' },
  { zFrom: -38, zTo: -50, count: 30, scaleFrom: 1.3, scaleTo: 2.3, tint: '#dbe8d6' },
  { zFrom: -50, zTo: -66, count: 26, scaleFrom: 1.4, scaleTo: 2.5, tint: '#d4e6d6' },
]

/** A single low-detail tree used for the forested background layers. */
function buildForestTree() {
  const parts: THREE.BufferGeometry[] = []
  const trunk = ensureNonIndexed(new THREE.CylinderGeometry(0.11, 0.2, 1.7, 6))
  trunk.translate(0, 0.85, 0)
  paintGeometry(trunk, (vertex, color) => {
    color.set('#5b4531').multiplyScalar(0.85 + (vertex.y / 1.7) * 0.25)
  })
  parts.push(trunk)

  const rand = mulberry32(77)
  const dark = new THREE.Color('#3c6339')
  const light = new THREE.Color('#9ec46a')

  for (let i = 0; i < 10; i += 1) {
    const radius = 0.42 + rand() * 0.52
    const base = new THREE.IcosahedronGeometry(radius, i < 3 ? 3 : 2)
    base.scale(1.15, 0.82, 1.15)
    const clump = organic(base, 0.32, i + 5)
    const angle = rand() * Math.PI * 2
    const ring = rand() * 1.2
    clump.translate(
      Math.cos(angle) * ring,
      1.8 + rand() * 1.6 - Math.pow(ring / 1.2, 2) * 0.4,
      Math.sin(angle) * ring,
    )
    paintGeometry(clump, (vertex, color) => {
      const t = THREE.MathUtils.clamp((vertex.y - 1.3) / 2.4, 0, 1)
      color.copy(dark).lerp(light, t * 0.85)
    })
    parts.push(clump)
  }

  const merged = mergeGeometries(parts)!
  parts.forEach((part) => part.dispose())
  return merged
}

type Instance = {
  position: [number, number, number]
  rotation: number
  scale: [number, number, number]
  tint: THREE.Color
}

function ForestBand({
  band,
  geometry,
  material,
}: {
  band: Band
  geometry: THREE.BufferGeometry
  material: THREE.Material
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const instances = useMemo<Instance[]>(() => {
    const rand = mulberry32(Math.round(Math.abs(band.zFrom) * 131 + band.count))
    const base = new THREE.Color(band.tint)
    const result: Instance[] = []

    let attempts = 0
    while (result.length < band.count && attempts < band.count * 20) {
      attempts += 1
      const x = (rand() - 0.5) * 96
      const z = band.zFrom + rand() * (band.zTo - band.zFrom)
      const y = terrainHeight(x, z) - 0.6
      if (y > 12) continue
      // Leave gaps so the forest reads as groves rather than a wall.
      if (landNoise(x * 0.2, z * 0.2) < -0.55) continue

      const scale = band.scaleFrom + rand() * (band.scaleTo - band.scaleFrom)
      const tint = base.clone()
      // Warm, sunlit crowns mixed with cooler shade keep the treeline from repeating.
      tint.offsetHSL((rand() - 0.5) * 0.04, (rand() - 0.5) * 0.1, (rand() - 0.5) * 0.12)

      result.push({
        position: [x, y, z],
        rotation: rand() * Math.PI * 2,
        scale: [scale * (0.85 + rand() * 0.3), scale * (0.9 + rand() * 0.45), scale * (0.85 + rand() * 0.3)],
        tint,
      })
    }

    return result
  }, [band])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    instances.forEach((instance, index) => {
      dummy.position.set(...instance.position)
      dummy.rotation.set(0, instance.rotation, 0)
      dummy.scale.set(...instance.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      mesh.setColorAt(index, instance.tint)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [dummy, instances])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, instances.length]}
      frustumCulled={false}
      receiveShadow
    />
  )
}

/** Distant forest layers with progressively hazier tints for atmospheric depth. */
export function Forest() {
  const { animate } = useSceneMotion()
  const geometry = useMemo(() => buildForestTree(), [])
  const { material, uniforms } = useMemo(
    () => createFoliageMaterial({ breakup: 0.16, translucency: 0.34, rim: 0.16 }),
    [],
  )

  useFrame((_, delta) => {
    if (animate) uniforms.uTime.value += delta
  })

  return (
    <group>
      {BANDS.map((band) => (
        <ForestBand key={band.zFrom} band={band} geometry={geometry} material={material} />
      ))}
    </group>
  )
}
