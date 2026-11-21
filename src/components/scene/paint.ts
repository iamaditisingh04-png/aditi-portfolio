import * as THREE from 'three'

/** Bakes a per-vertex colour attribute using a callback in local space. */
export function paintGeometry(
  geometry: THREE.BufferGeometry,
  colorAt: (position: THREE.Vector3, target: THREE.Color) => void,
) {
  const position = geometry.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(position.count * 3)
  const vertex = new THREE.Vector3()
  const color = new THREE.Color()

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i)
    colorAt(vertex, color)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}
