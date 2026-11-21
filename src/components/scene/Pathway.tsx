import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { creekCenterX, creekHalfWidth, mulberry32, terrainHeight } from './world'

type Stone = {
  matrix: THREE.Matrix4
  color: THREE.Color
}

const STONE_COLORS = ['#c97850', '#d9c7a4', '#a9a58c', '#b98a63', '#cfae83', '#8f9b7c']

/** A winding stepping-stone path along the right bank. */
export function Pathway() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const stones = useMemo<Stone[]>(() => {
    const rand = mulberry32(529)
    const result: Stone[] = []
    const count = 30

    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1)
      const z = THREE.MathUtils.lerp(-13.5, 12.5, t)
      const x =
        creekCenterX(z) +
        creekHalfWidth(z) +
        3.2 +
        Math.sin(z * 0.45) * 0.7 +
        (rand() - 0.5) * 0.35
      const y = terrainHeight(x, z) + 0.03

      dummy.position.set(x, y, z)
      dummy.rotation.set((rand() - 0.5) * 0.06, rand() * Math.PI, (rand() - 0.5) * 0.06)
      const scale = 0.62 + rand() * 0.3
      dummy.scale.set(scale, 0.55 + rand() * 0.3, scale)
      dummy.updateMatrix()

      result.push({
        matrix: dummy.matrix.clone(),
        color: new THREE.Color(STONE_COLORS[Math.floor(rand() * STONE_COLORS.length)]),
      })
    }

    return result
  }, [dummy])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    stones.forEach((stone, index) => {
      mesh.setMatrixAt(index, stone.matrix)
      mesh.setColorAt(index, stone.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [stones])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, stones.length]} frustumCulled={false}>
      <cylinderGeometry args={[0.5, 0.44, 0.16, 7]} />
      <meshStandardMaterial roughness={0.9} color="#ffffff" flatShading />
    </instancedMesh>
  )
}
