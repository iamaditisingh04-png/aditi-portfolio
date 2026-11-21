import { useMemo } from 'react'
import * as THREE from 'three'
import { groundTexture } from './textures'
import { terrainColor, terrainHeight } from './world'

const SIZE = 118
const SEGMENTS = 196

/** The valley floor: a fine heightfield with layered vertex colouring and ground detail. */
export function Terrain() {
  const texture = useMemo(() => groundTexture(), [])

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)

    const position = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(position.count * 3)
    const color = new THREE.Color()

    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i)
      const z = position.getZ(i)
      const height = terrainHeight(x, z)
      position.setY(i, height)

      terrainColor(x, z, height, color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors map={texture} roughness={0.96} metalness={0} />
    </mesh>
  )
}
