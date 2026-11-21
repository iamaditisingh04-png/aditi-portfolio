import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'

const LOOK_AT = new THREE.Vector3(0.3, 1.1, -7)

/** Cinematic camera: gentle pointer parallax plus a scroll-driven dolly for depth. */
export function CameraRig() {
  const { animate } = useSceneMotion()
  const { camera, size } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  const target = useRef(new THREE.Vector3())

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    const onScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
      scroll.current = progress
    }
    onMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as PointerEvent)
    onScroll()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useFrame((_state, delta) => {
    const portrait = size.width / Math.max(1, size.height) < 0.95
    // Standing above the creek, looking downstream to the waterfall.
    const baseX = portrait ? 1.9 : 2.4
    const baseZ = portrait ? 18.6 : 14.2
    const baseY = portrait ? 4.2 : 3.35
    const drift = scroll.current

    if (!animate) {
      camera.position.set(baseX, baseY, baseZ)
      camera.lookAt(LOOK_AT)
      return
    }

    target.current.set(
      baseX + pointer.current.x * (portrait ? 0.4 : 0.85),
      baseY + pointer.current.y * (portrait ? 0.2 : 0.4) + drift * 0.55,
      baseZ + drift * 2.6,
    )

    const smoothing = 1 - Math.exp(-delta * 1.9)
    camera.position.lerp(target.current, smoothing)
    camera.lookAt(LOOK_AT.x, LOOK_AT.y + drift * 0.4, LOOK_AT.z)
  })

  return null
}
