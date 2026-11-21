
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
        emissive: '#3f6a37',
        emissiveIntensity: 0.15,
      }),
    [],
  )

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const time = state.clock.elapsedTime

    leaves.forEach((leaf, index) => {
      const travel = animate
        ? (leaf.z + time * 0.012 * leaf.speed) % 1
        : leaf.z

      const z = THREE.MathUtils.lerp(
        CREEK_Z_START + 1.4,
        CREEK_Z_END - 0.6,
        travel,
      )

      const width = creekHalfWidth(z) * 0.78

      const x =
        creekCenterX(z) +
        leaf.x * width +
        Math.sin(time * 0.6 + leaf.offset) * 0.12 * width

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

/** Petals loosened by the breeze. */
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
        drift: [
          1.2 + rand() * 2.4,
          0.35 + rand() * 0.9,
          0.6 + rand() * 1.6,
        ],
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
        emissive: '#ffd9df',
        emissiveIntensity: 0.18,
      }),
    [],
  )

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const palette = [
      '#f7e6d0',
      '#f3b8c2',
      '#f6d98b',
      '#fdf3e0',
    ]

    petals.forEach((_, index) => {
      color.set(palette[index % palette.length])
      mesh.setColorAt(index, color)
    })

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }
  }, [color, petals])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const time = state.clock.elapsedTime

    petals.forEach((petal, index) => {
      const t = time * petal.speed + petal.phase

      const x =
        petal.origin[0] +
        Math.sin(t * 0.7) * petal.drift[0]

      const y =
        petal.origin[1] +
        Math.sin(t * 1.3 + petal.phase) * petal.drift[1] -
        (animate ? ((time * 0.16 + petal.phase) % 3.2) : 0)

      const z =
        petal.origin[2] +
        Math.cos(t * 0.55) * petal.drift[2]

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
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, petals.length]}
      frustumCulled={false}
    />
  )
}

type Firefly = {
  x: number
  y: number
  z: number
  phase: number
  speed: number
  drift: number
}

/** More widely distributed, individually flickering fireflies. */
function Fireflies({ count }: { count: number }) {
  const { animate, theme } = useSceneMotion()
  const isNight = theme === 'night'

  const group = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  const fireflies = useMemo<Firefly[]>(() => {
    const rand = mulberry32(311)

    return Array.from({ length: count }, () => {
      const z = rand() * 34 - 18

      return {
        x: (rand() - 0.5) * 48,
        y: 0.9 + rand() * 2.6,
        z,
        phase: rand() * Math.PI * 2,
        speed: 0.7 + rand() * 1.5,
        drift: 0.12 + rand() * 0.3,
      }
    })
  }, [count])

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    fireflies.forEach((fly, index) => {
      positions[index * 3] = fly.x
      positions[index * 3 + 1] = fly.y
      positions[index * 3 + 2] = fly.z

      colors[index * 3] = 1
      colors[index * 3 + 1] = 0.85
      colors[index * 3 + 2] = 0.48
    })

    const geo = new THREE.BufferGeometry()

    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )

    geo.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3),
    )

    return geo
  }, [count, fireflies])

  const texture = useMemo(() => glowTexture(), [])

  useFrame((state) => {
    const points = group.current
    const mat = materialRef.current

    if (!points || !mat) return

    if (!isNight) {
      mat.opacity = 0
      return
    }

    const time = state.clock.elapsedTime

    const positions = geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute

    const colors = geometry.getAttribute(
      'color',
    ) as THREE.BufferAttribute

    fireflies.forEach((fly, index) => {
      const t = time * fly.speed + fly.phase

      // Each firefly has its own soft flickering rhythm.
      const pulse =
        0.22 +
        0.78 *
          Math.pow(
            (Math.sin(t * 2.1) + 1) * 0.5,
            1.7,
          )

      const brightness = pulse * (animate ? 1 : 0.75)

      // Independent floating movement.
      positions.setXYZ(
        index,
        fly.x + Math.sin(t * 0.55) * fly.drift,
        fly.y + Math.sin(t * 0.85) * fly.drift,
        fly.z + Math.cos(t * 0.45) * fly.drift,
      )

      colors.setXYZ(
        index,
        brightness,
        brightness * 0.78,
        brightness * 0.42,
      )
    })

    positions.needsUpdate = true
    colors.needsUpdate = true

    mat.opacity = 0.95

    points.rotation.y = Math.sin(time * 0.12) * 0.025
    points.position.y = Math.sin(time * 0.5) * 0.06
  })

  return (
    <points ref={group} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        map={texture}
        size={0.42}
        transparent
        opacity={isNight ? 0.95 : 0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#ffffff"
        vertexColors
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}

/** Small warm ground lanterns along the garden approach to the cottage. */
function GardenLanterns() {
  const { theme } = useSceneMotion()
  const isNight = theme === 'night'

  // A gentle line of lamps leading towards the cottage.
  const positions: [number, number, number][] = [
    [1.5, 0, 8],
    [3, 0, 6],
    [4.5, 0, 4],
    [6, 0, 2],
    [7.5, 0, 0],
  ]

  return (
    <group visible={isNight}>
      {positions.map(([x, y, z], index) => (
        <group key={index} position={[x, y, z]}>
          {/* Low stone/wood base */}
          <mesh position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.18, 8]} />
            <meshStandardMaterial
              color="#594633"
              roughness={0.9}
            />
          </mesh>

          {/* Lantern frame */}
          <mesh position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.105, 0.12, 0.42, 6, 1, true]} />
            <meshStandardMaterial
              color="#60472d"
              metalness={0.35}
              roughness={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Warm glowing glass */}
          <mesh position={[0, 0.39, 0]}>
            <sphereGeometry args={[0.085, 10, 10]} />
            <meshStandardMaterial
              color="#ffbf69"
              emissive="#ff9c36"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>

          {/* Lantern roof */}
          <mesh position={[0, 0.64, 0]}>
            <coneGeometry args={[0.16, 0.16, 6]} />
            <meshStandardMaterial
              color="#59402a"
              metalness={0.25}
              roughness={0.7}
            />
          </mesh>

          {/* Warm pool of light */}
          <pointLight
            position={[0, 0.48, 0]}
            color="#ffb45e"
            intensity={1.15}
            distance={4.5}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}

export function AmbientParticles() {
  const { quality } = useSceneMotion()
  const high = quality === 'high'

  return (
    <group>
      <FloatingLeaves count={high ? 26 : 12} />
      <FloatingPetals count={high ? 44 : 18} />
      <Fireflies count={high ? 110 : 48} />
      <GardenLanterns />
    </group>
  )
}
