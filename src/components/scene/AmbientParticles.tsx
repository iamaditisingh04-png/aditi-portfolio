import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { glowTexture } from './textures'
import {
  CREEK_Z_END,
  CREEK_Z_START,
  WATER_LEVEL,
  creekCenterX,
  creekHalfWidth,
  mulberry32,
} from './world'

type Leaf = {
  x: number
  z: number
  speed: number
  offset: number
  spin: number
  scale: number
}

/** Leaves drifting downstream on the current. */
function FloatingLeaves({ count }: { count: number }) {
  const { animate } = useSceneMotion()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const leaves = useMemo<Leaf[]>(() => {
    const rand = mulberry32(97)
    return Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * 1.3,
      z: rand(),
      speed: 0.8 + rand() * 0.5,
      offset: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 1.4,
      scale: 0.55 + rand() * 0.6,
    }))
  }, [count])

  const geometry = useMemo(() => new THREE.CircleGeometry(1, 5), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#7fae55',
        roughness: 0.8,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#3f6a37'),
        emissiveIntensity: 0.15,
      }),
    [],
  )

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const time = state.clock.elapsedTime

    leaves.forEach((leaf, index) => {
      const travel = animate ? (leaf.z + time * 0.012 * leaf.speed) % 1 : leaf.z
      const z = THREE.MathUtils.lerp(CREEK_Z_START + 1.4, CREEK_Z_END - 0.6, travel)
      const width = creekHalfWidth(z) * 0.78
      const x =
        creekCenterX(z) + leaf.x * width + Math.sin(time * 0.6 + leaf.offset) * 0.12 * width

      dummy.position.set(x, WATER_LEVEL + 0.035, z)
      dummy.rotation.set(
        Math.sin(time * 0.8 + leaf.offset) * 0.18,
        time * leaf.spin + leaf.offset,
        Math.cos(time * 0.7 + leaf.offset) * 0.12,
      )
      dummy.scale.setScalar(leaf.scale * 0.32)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, leaves.length]}
      frustumCulled={false}
    />
  )
}

type Petal = {
  origin: [number, number, number]
  drift: [number, number, number]
  speed: number
  phase: number
  spin: number
  scale: number
}

/** Petals loosened by the breeze, turning slowly in the sunlight. */
function FloatingPetals({ count }: { count: number }) {
  const { animate } = useSceneMotion()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const petals = useMemo<Petal[]>(() => {
    const rand = mulberry32(1409)
    return Array.from({ length: count }, () => {
      const z = -13 + rand() * 22
      const center = creekCenterX(z)
      return {
        origin: [
          center + (rand() - 0.5) * 13,
          0.7 + rand() * 4.2,
          z,
        ],
        drift: [1.2 + rand() * 2.4, 0.35 + rand() * 0.9, 0.6 + rand() * 1.6],
        speed: 0.1 + rand() * 0.22,
        phase: rand() * Math.PI * 2,
        spin: (rand() - 0.5) * 2.4,
        scale: 0.5 + rand() * 0.7,
      }
    })
  }, [count])

  const geometry = useMemo(() => {
    const petal = new THREE.SphereGeometry(0.16, 7, 5)
    petal.scale(1, 0.16, 0.62)
    return petal
  }, [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.7,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#ffd9df'),
        emissiveIntensity: 0.18,
      }),
    [],
  )

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const palette = ['#f7e6d0', '#f3b8c2', '#f6d98b', '#fdf3e0']
    petals.forEach((_, index) => {
      color.set(palette[index % palette.length])
      mesh.setColorAt(index, color)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [color, petals])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const time = state.clock.elapsedTime

    petals.forEach((petal, index) => {
      const t = time * petal.speed + petal.phase
      const x = petal.origin[0] + Math.sin(t * 0.7) * petal.drift[0]
      const y =
        petal.origin[1] +
        Math.sin(t * 1.3 + petal.phase) * petal.drift[1] -
        (animate ? ((time * 0.16 + petal.phase) % 3.2) : 0)
      const z = petal.origin[2] + Math.cos(t * 0.55) * petal.drift[2]

      dummy.position.set(x, Math.max(y, 0.2), z)
      dummy.rotation.set(
        Math.sin(t * 1.6) * 0.9,
        t * petal.spin,
        Math.cos(t * 1.1) * 0.7,
      )
      dummy.scale.setScalar(petal.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, petals.length]} frustumCulled={false} />
  )
}

/** Slow golden motes of light above the meadow. */
function Fireflies({ count }: { count: number }) {
  const { animate } = useSceneMotion()
  const geometry = useMemo(() => {
    const rand = mulberry32(311)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const z = rand() * 34 - 18
      const half = creekHalfWidth(z)
      positions[i * 3] = creekCenterX(z) + (rand() - 0.5) * half * 8
      positions[i * 3 + 1] = 0.9 + rand() * 2.6
      positions[i * 3 + 2] = z
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [count])

  const texture = useMemo(() => glowTexture(), [])
  const group = useRef<THREE.Points>(null)
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: texture,
        size: 0.22,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: '#ffeaa8',
        sizeAttenuation: true,
      }),
    [texture],
  )

  useFrame((state) => {
    if (group.current && animate) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.05
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.12
    }
  })

  return <points ref={group} geometry={geometry} material={material} />
}

export function AmbientParticles() {
  const { quality } = useSceneMotion()
  const high = quality === 'high'
  return (
    <group>
      <FloatingLeaves count={high ? 26 : 12} />
      <FloatingPetals count={high ? 44 : 18} />
      <Fireflies count={high ? 56 : 24} />
    </group>
  )
}
