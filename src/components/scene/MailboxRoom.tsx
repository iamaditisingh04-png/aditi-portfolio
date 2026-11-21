
import * as THREE from 'three'

type MailboxRoomProps = {
  isNight: boolean
}

function Letter({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.48, 0.035, 0.34]} />
        <meshStandardMaterial color="#f3dfb8" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.022, 0]}>
        <boxGeometry args={[0.12, 0.008, 0.025]} />
        <meshStandardMaterial color="#bd7957" />
      </mesh>
    </group>
  )
}

function Mailbox() {
  return (
    <group position={[1.35, 0.9, -1.35]}>
      {/* Mailbox body */}
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.65, 0.55]} />
        <meshStandardMaterial color="#a84f42" roughness={0.8} />
      </mesh>

      {/* Rounded roof */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.92, 0.12, 0.62]} />
        <meshStandardMaterial color="#773d35" roughness={0.8} />
      </mesh>

      {/* Mail slot */}
      <mesh position={[0, 0.08, 0.282]}>
        <boxGeometry args={[0.48, 0.07, 0.015]} />
        <meshStandardMaterial color="#382b27" />
      </mesh>

      {/* Little flag */}
      <mesh position={[0.5, 0.15, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color="#e8b66d" />
      </mesh>
    </group>
  )
}

function WritingDesk() {
  return (
    <group position={[-0.7, 0, -1.25]}>
      {/* Tabletop */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[1.65, 0.13, 0.85]} />
        <meshStandardMaterial color="#81563b" roughness={0.85} />
      </mesh>

      {/* Legs */}
      {[-0.68, 0.68].map((x) =>
        [-0.32, 0.32].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.42, z]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.82, 0.1]} />
            <meshStandardMaterial color="#68432f" />
          </mesh>
        )),
      )}

      <Letter position={[-0.25, 0.94, 0.02]} rotation={[0, 0.2, 0]} />
      <Letter position={[0.3, 0.94, -0.12]} rotation={[0, -0.3, 0]} />

      {/* Ink bottle */}
      <mesh position={[0.55, 1.06, 0.22]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.22, 12]} />
        <meshStandardMaterial color="#384b49" roughness={0.35} />
      </mesh>

      {/* Quill */}
      <mesh
        position={[0.55, 1.24, 0.22]}
        rotation={[0, 0, -0.35]}
      >
        <cylinderGeometry args={[0.012, 0.018, 0.48, 6]} />
        <meshStandardMaterial color="#e8d5ad" />
      </mesh>
    </group>
  )
}

function WarmLamp({ isNight }: { isNight: boolean }) {
  return (
    <group position={[-1.25, 1.2, -1.3]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.12, 12]} />
        <meshStandardMaterial color="#80583c" />
      </mesh>

      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.28, 0.38, 12, 1, true]} />
        <meshStandardMaterial
          color="#e8b96d"
          side={THREE.DoubleSide}
          emissive={isNight ? '#d68b3e' : '#000000'}
          emissiveIntensity={isNight ? 0.65 : 0}
        />
      </mesh>

      <pointLight
        position={[0, 0.35, 0]}
        color="#ffc779"
        intensity={isNight ? 1.2 : 0.35}
        distance={3}
      />
    </group>
  )
}

export function MailboxRoom({ isNight }: MailboxRoomProps) {
  return (
    <group>
      <WritingDesk />
      <Mailbox />
      <WarmLamp isNight={isNight} />
    </group>
  )
}
