
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'

const smooth = (value: number) => {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export function CameraRig() {
  const { animate, progress } = useSceneMotion()
  const { camera, size } = useThree()

  const pointer = useRef({ x: 0, y: 0 })
  const currentLookAt = useRef(new THREE.Vector3(0.3, 1.1, -7))

  useFrame((state, delta) => {
    const portrait = size.width / Math.max(1, size.height) < 0.95

    if (animate) {
      pointer.current.x = THREE.MathUtils.lerp(
        pointer.current.x,
        state.pointer.x,
        1 - Math.exp(-delta * 2),
      )

      pointer.current.y = THREE.MathUtils.lerp(
        pointer.current.y,
        state.pointer.y,
        1 - Math.exp(-delta * 2),
      )
    }

    const p = THREE.MathUtils.clamp(progress, 0, 1)

    const stops = [
      // Outside the cottage
      { p: 0, position: [2.4, 3.35, 14.2], look: [0.3, 1.1, -7] },

      // Approaching the entrance
      { p: 0.22, position: [6.5, 3.1, 5.5], look: [8, 1.4, -1] },

      // Reaching the doorway
      { p: 0.4, position: [6.7, 1.8, 3.2], look: [6.7, 1.4, -1] },

      // Entering the welcome room
      { p: 0.52, position: [6.7, 1.7, -0.5], look: [6.7, 1.4, -2.7] },

      // Moving through the Library
      { p: 0.60, position: [7.8, 1.7, -1.2], look: [8, 1.4, -2.5] },
      { p: 0.68, position: [9.4, 1.7, -1.65], look: [10.8, 1.4, -1.65] },
      { p: 0.74, position: [11.1, 1.7, -1.65], look: [12.5, 1.4, -1.65] },

      // Entering the Project Workshop
      { p: 0.78, position: [12.5, 1.7, -1.65], look: [13.5, 1.4, -1.65] },
      { p: 0.82, position: [14.0, 1.7, -1.65], look: [15.0, 1.4, -1.65] },

      // Moving through the Workshop
      { p: 0.86, position: [15.7, 1.7, -1.65], look: [16.8, 1.4, -1.65] },

      // Entering the Achievement Gallery
      { p: 0.89, position: [17.2, 1.7, -1.65], look: [18.2, 1.4, -1.65] },
      { p: 0.92, position: [19.1, 1.7, -1.65], look: [20.1, 1.4, -1.65] },

      // Exploring the Gallery
      { p: 0.95, position: [21.8, 1.7, -1.65], look: [22.6, 1.4, -1.65] },

      // Approaching the Mailbox Room
      { p: 0.975, position: [23.8, 1.7, -1.65], look: [24.7, 1.4, -1.65] },

      // Final destination: Mailbox Room
      { p: 1, position: [26.0, 1.7, -1.65], look: [26.7, 1.4, -1.65] },
    ] as const

    let index = stops.findIndex((stop, i) => {
      return (
        i < stops.length - 1 &&
        p >= stop.p &&
        p <= stops[i + 1].p
      )
    })

    if (index === -1) index = stops.length - 2

    const from = stops[index]
    const to = stops[index + 1]

    const t = smooth((p - from.p) / (to.p - from.p))

    const position = new THREE.Vector3()
      .fromArray(from.position)
      .lerp(new THREE.Vector3().fromArray(to.position), t)

    const look = new THREE.Vector3()
      .fromArray(from.look)
      .lerp(new THREE.Vector3().fromArray(to.look), t)

    if (animate) {
      position.x += pointer.current.x * (portrait ? 0.12 : 0.25)
      position.y += pointer.current.y * (portrait ? 0.06 : 0.12)
    }

    camera.position.lerp(
      position,
      1 - Math.exp(-delta * 2.2),
    )

    currentLookAt.current.lerp(
      look,
      1 - Math.exp(-delta * 2.2),
    )

    camera.lookAt(currentLookAt.current)
  })

  return null
}
