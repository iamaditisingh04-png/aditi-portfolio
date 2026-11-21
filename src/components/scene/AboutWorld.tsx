
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Sculpture() {
  const group = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        state.pointer.y * 0.16,
        0.04,
      )
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        -state.pointer.x * 0.12,
        0.04,
      )
    }

    if (knot.current) {
      knot.current.rotation.x += delta * 0.16
      knot.current.rotation.y += delta * 0.22
    }
  })

  return (
    <group ref={group} position={[2.2, 0, 0]}>
      {/* Main liquid-metal sculpture */}
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.25, 0.38, 220, 32, 2, 5]} />
        <meshStandardMaterial
          color="#b9b8c7"
          metalness={0.92}
          roughness={0.17}
        />
      </mesh>

      {/* Floating orbital rings */}
      <mesh rotation={[1.1, 0.3, 0.4]}>
        <torusGeometry args={[2.05, 0.018, 16, 160]} />
        <meshStandardMaterial
          color="#c7a5ff"
          metalness={0.8}
          roughness={0.2}
          emissive="#513080"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh rotation={[0.3, 1.1, 0.8]}>
        <torusGeometry args={[2.45, 0.012, 16, 160]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.15}
        />
      </mesh>

      {/* Small floating geometric objects */}
      <mesh position={[-2.4, 1.7, -1]}>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial
          color="#a58bd8"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[2.1, -2, 0.5]}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color="#e4c9ae"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>

      <pointLight
        position={[0, 2, 3]}
        intensity={18}
        color="#c6a5ff"
      />
    </group>
  )
}

function FloatingObjects() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return

    group.current.children.forEach((child, index) => {
      child.position.y =
        Math.sin(state.clock.elapsedTime * 0.65 + index * 1.7) * 0.22 +
        child.userData.baseY

      child.rotation.x += 0.002
      child.rotation.y += 0.004
    })
  })

  const objects = [
    { position: [-4, 1.5, -2], size: 0.12 },
    { position: [-3, -1.8, -1], size: 0.18 },
    { position: [4, 2.2, -3], size: 0.15 },
    { position: [4.5, -1.2, -2], size: 0.1 },
    { position: [-1, 3, -4], size: 0.13 },
    { position: [1, -3, -3], size: 0.16 },
  ] as const

  return (
    <group ref={group}>
      {objects.map((object, index) => (
        <mesh
          key={index}
          position={object.position}
          userData={{ baseY: object.position[1] }}
        >
          <icosahedronGeometry args={[object.size, 1]} />
          <meshStandardMaterial
            color="#c5b7e9"
            metalness={0.7}
            roughness={0.3}
            emissive="#44305e"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function ParticleField() {
  const points = useRef<THREE.Points>(null)

  const positions = new Float32Array(1800)

  for (let i = 0; i < 600; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16
    positions[i * 3 + 2] = -8 - Math.random() * 12
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y =
        state.clock.elapsedTime * 0.008
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c7b2ee"
        size={0.035}
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#07070c']} />

      <fog attach="fog" args={['#07070c', 10, 25]} />

      <ambientLight intensity={0.35} />

      <directionalLight
        position={[-4, 5, 5]}
        intensity={2.5}
        color="#d8c6ff"
      />

      <pointLight
        position={[4, -2, 2]}
        intensity={35}
        color="#6841a5"
      />

      <pointLight
        position={[-5, 1, 1]}
        intensity={20}
        color="#b58cdd"
      />

      <Sculpture />
      <FloatingObjects />
      <ParticleField />
    </>
  )
}

export default function AboutWorld() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '650px',
        overflow: 'hidden',
        background: '#07070c',
        color: '#ffffff',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 48,
        }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Scene />
      </Canvas>

      {/* Editorial typography */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '8%',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '5px',
            color: '#bba3df',
            marginBottom: '28px',
          }}
        >
          THE PERSON BEHIND THE CODE — 001
        </p>

        <h1
          style={{
            fontSize: 'clamp(64px, 11vw, 150px)',
            lineHeight: 0.82,
            letterSpacing: '-0.09em',
            fontWeight: 500,
            margin: 0,
            maxWidth: '700px',
          }}
        >
          ABOUT
          <br />
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px #c7b2ee',
            }}
          >
            ME.
          </span>
        </h1>

        <p
          style={{
            maxWidth: '340px',
            fontSize: '14px',
            lineHeight: 1.9,
            color: '#aaa6b5',
            marginTop: '36px',
          }}
        >
          A curious mind exploring the intersection of
          technology, creativity and imagination.
        </p>

        <div
          style={{
            position: 'absolute',
            bottom: '38px',
            left: '8%',
            fontSize: '10px',
            letterSpacing: '3px',
            color: '#777180',
          }}
        >
          02 / ABOUT
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '38px',
            right: '8%',
            fontSize: '10px',
            letterSpacing: '3px',
            color: '#bba3df',
          }}
        >
          SCROLL TO EXPLORE ↓
        </div>
      </div>
    </section>
  )
}
