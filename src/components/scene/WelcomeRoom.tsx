
import { useMemo } from 'react'

function WoodenDesk() {
  return (
    <group position={[0.65, 0, -1.05]}>
      {/* Desk top */}
      <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.13, 0.75]} />
        <meshStandardMaterial color="#986b43" roughness={0.9} />
      </mesh>

      {/* Desk legs */}
      {[-0.68, 0.68].map((x) =>
        [-0.27, 0.27].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.43, z]} castShadow>
            <boxGeometry args={[0.1, 0.86, 0.1]} />
            <meshStandardMaterial color="#67452f" roughness={1} />
          </mesh>
        )),
      )}

      {/* Welcome letter */}
      <mesh position={[-0.2, 0.96, 0.02]} rotation={[-0.08, 0, -0.08]}>
        <boxGeometry args={[0.62, 0.025, 0.43]} />
        <meshStandardMaterial color="#f2dfb9" roughness={1} />
      </mesh>

      {/* Letter seal */}
      <mesh position={[-0.2, 0.985, 0.02]}>
        <cylinderGeometry args={[0.07, 0.07, 0.025, 16]} />
        <meshStandardMaterial color="#a84f42" roughness={0.7} />
      </mesh>

      {/* Small flower vase */}
      <mesh position={[0.52, 1.04, -0.15]}>
        <cylinderGeometry args={[0.09, 0.13, 0.22, 12]} />
        <meshStandardMaterial color="#d3a77d" roughness={0.8} />
      </mesh>

      {/* Vase stems */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            0.52 + (i - 1) * 0.06,
            1.23 + (i % 2) * 0.04,
            -0.15,
          ]}
          rotation={[0, 0, (i - 1) * 0.18]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.25, 6]} />
          <meshStandardMaterial color="#54764b" />
        </mesh>
      ))}
    </group>
  )
}

function WelcomeBoard() {
  return (
    <group position={[-0.55, 1.65, -1.62]}>
      {/* Wooden frame */}
      <mesh castShadow>
        <boxGeometry args={[1.55, 1.05, 0.12]} />
        <meshStandardMaterial color="#795338" roughness={1} />
      </mesh>

      {/* Board surface */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.39, 0.89, 0.025]} />
        <meshStandardMaterial color="#c99d6b" roughness={1} />
      </mesh>

      {/* Pinned notes */}
      {[-0.37, 0, 0.37].map((x, i) => (
        <group key={x} position={[x, i === 1 ? 0.08 : -0.08, 0.095]}>
          <mesh rotation={[0, 0, (i - 1) * 0.08]}>
            <boxGeometry args={[0.3, 0.38, 0.025]} />
            <meshStandardMaterial
              color={i === 0 ? '#f1dfb8' : i === 1 ? '#e5cba0' : '#e8d8b9'}
            />
          </mesh>

          <mesh position={[0, 0.13, 0.025]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#a84f42" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WelcomePlant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: Math.cos((i * Math.PI * 2) / 6) * 0.2,
        y: 0.85 + (i % 2) * 0.12,
        z: Math.sin((i * Math.PI * 2) / 6) * 0.2,
      })),
    [],
  )

  return (
    <group position={[1.65, 0, -0.45]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 12]} />
        <meshStandardMaterial color="#b97854" roughness={1} />
      </mesh>

      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.45, 8]} />
        <meshStandardMaterial color="#54764b" />
      </mesh>

      {leaves.map((leaf, i) => (
        <mesh
          key={i}
          position={[leaf.x, leaf.y, leaf.z]}
          scale={[0.8, 1.25, 0.55]}
          rotation={[0.2, 0, (i - 2) * 0.2]}
        >
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#668c58" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export function WelcomeRoom({ isNight }: { isNight: boolean }) {
  return (
    <group>
      <WoodenDesk />
      <WelcomeBoard />
      <WelcomePlant />

      {/* Warm desk light */}
      <group position={[0.65, 1.18, -0.85]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#ffdda1"
            emissive="#ffc36c"
            emissiveIntensity={isNight ? 2 : 0.5}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          color="#ffd49b"
          intensity={isNight ? 0.65 : 0.15}
          distance={2.8}
        />
      </group>
    </group>
  )
}
