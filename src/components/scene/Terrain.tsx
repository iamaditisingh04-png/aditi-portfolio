
import { useMemo } from 'react'
import * as THREE from 'three'
import { groundTexture } from './textures'

const SIZE = 118
const SEGMENTS = 196

export function Terrain() {
  const texture = useMemo(() => {
    const tex = groundTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(12, 12)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      SIZE,
      SIZE,
      SEGMENTS,
      SEGMENTS,
    )

    geo.rotateX(-Math.PI / 2)

    const position = geo.attributes.position

    // A level garden floor.
    for (let i = 0; i < position.count; i++) {
      position.setY(i, 0)
    }

    position.needsUpdate = true
    geo.computeVertexNormals()

    return geo
  }, [])

  return (
    <mesh
      geometry={geometry}
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        map={texture}
        color="#c3d0a3"
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}
