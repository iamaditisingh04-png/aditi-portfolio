import { useMemo } from 'react'
import * as THREE from 'three'
import { paintGeometry } from './paint'
import { creekCenterX, mulberry32, organic, smoothstep, terrainHeight } from './world'

type RockSpec = { x: number; z: number; scale: number; seed: number; stretch?: number }

const ROCKS: RockSpec[] = [
  { x: -2.4, z: 9.6, scale: 0.68, seed: 3, stretch: 1.25 },
  { x: -3.6, z: 5.4, scale: 0.92, seed: 5 },
  { x: -1.2, z: 2.2, scale: 0.52, seed: 8 },
  { x: -4.8, z: -1.4, scale: 1.15, seed: 11, stretch: 1.35 },
  { x: -2.9, z: -5.8, scale: 0.78, seed: 13 },
  { x: -6.2, z: -9.2, scale: 1.32, seed: 17 },
  { x: 8.4, z: -0.6, scale: 1.05, seed: 19 },
  { x: 9.8, z: 3.8, scale: 0.86, seed: 23 },
  { x: 7.2, z: 6.6, scale: 0.62, seed: 29 },
  { x: 11.5, z: 8.4, scale: 1.2, seed: 31 },
  { x: 6.8, z: -6.4, scale: 0.95, seed: 37 },
  { x: 10.2, z: -11.2, scale: 1.45, seed: 41 },
  { x: -9.4, z: 2.6, scale: 1.6, seed: 43, stretch: 1.4 },
  { x: -12.2, z: 7.2, scale: 1.25, seed: 47 },
  { x: 14.6, z: -3.4, scale: 1.55, seed: 53 },
  { x: -16.4, z: -4.6, scale: 1.8, seed: 59 },
  { x: 3.6, z: 12.4, scale: 0.55, seed: 61 },
  { x: -7.8, z: 12.8, scale: 0.82, seed: 67 },
]

/** Stones sitting inside the creek, catching foam. */
const CREEK_ROCKS = [
  { z: -12.4, offset: -0.62, scale: 0.36, seed: 71 },
  { z: -7.2, offset: 0.75, scale: 0.3, seed: 73 },
  { z: -2.6, offset: -0.8, scale: 0.28, seed: 79 },
  { z: 3.4, offset: 0.9, scale: 0.34, seed: 83 },
  { z: 8.6, offset: -0.55, scale: 0.26, seed: 89 },
]

function buildRock(spec: RockSpec) {
  const geometry = organic(new THREE.IcosahedronGeometry(1, 2), 0.26, spec.seed)
  const rand = mulberry32(spec.seed * 31)
  const stone = new THREE.Color('#8f9588')
  const moss = new THREE.Color('#4a763f')
  const fresh = new THREE.Color('#86ae58')
  const lichen = new THREE.Color('#d6dfb2')

  paintGeometry(geometry, (vertex, color) => {
    const mossy = smoothstep(-0.2, 0.62, vertex.y) * (0.62 + Math.sin(vertex.x * 3.1 + vertex.z * 2.4) * 0.3)
    color.copy(stone)
    color.offsetHSL(0, 0, (Math.sin(vertex.x * 5.7) + Math.cos(vertex.z * 6.3)) * 0.03)
    color.lerp(moss, THREE.MathUtils.clamp(mossy, 0, 0.92))
    color.lerp(fresh, THREE.MathUtils.clamp(vertex.y - 0.2, 0, 1) * 0.35)

    const speckle = Math.sin(vertex.x * 9.3) * Math.cos(vertex.z * 8.1) * Math.sin(vertex.y * 7.7)
    if (speckle > 0.55) color.lerp(lichen, 0.3 + rand() * 0.15)
  })

  return geometry
}

export function Rocks() {
  const rocks = useMemo(
    () =>
      ROCKS.map((spec) => ({
        spec,
        geometry: buildRock(spec),
        y: terrainHeight(spec.x, spec.z) + spec.scale * 0.2,
      })),
    [],
  )

  const creekRocks = useMemo(
    () =>
      CREEK_ROCKS.map((spec) => {
        const x = creekCenterX(spec.z) + spec.offset
        return {
          geometry: buildRock({ x, z: spec.z, scale: spec.scale, seed: spec.seed }),
          position: [x, 0.02, spec.z] as [number, number, number],
          scale: spec.scale,
        }
      }),
    [],
  )

  return (
    <group>
      {rocks.map(({ spec, geometry, y }) => (
        <mesh
          key={`${spec.x}-${spec.z}`}
          geometry={geometry}
          position={[spec.x, y, spec.z]}
          rotation={[0.08 + (spec.seed % 7) * 0.01, spec.seed * 1.7, -0.05]}
          scale={[
            spec.scale * 1.2 * (spec.stretch ?? 1),
            spec.scale * 0.78,
            spec.scale * 1.05,
          ]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial vertexColors roughness={0.92} metalness={0} />
        </mesh>
      ))}

      {creekRocks.map((rock, index) => (
        <mesh
          key={`creek-${index}`}
          geometry={rock.geometry}
          position={rock.position}
          scale={[rock.scale * 1.3, rock.scale * 0.7, rock.scale]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial vertexColors roughness={0.55} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}
