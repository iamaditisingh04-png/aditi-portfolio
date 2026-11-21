
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WelcomeRoom } from './WelcomeRoom'
import { useSceneMotion } from './sceneMotion'
import { LibraryRoom } from './LibraryRoom'
import { WorkshopRoom } from './WorkshopRoom'
import { AchievementRoom } from './AchievementRoom'
import { MailboxRoom } from './MailboxRoom'

function Flower({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number]
  color: string
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.12,
            Math.sin((i * Math.PI * 2) / 5) * 0.12,
            0,
          ]}
        >
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}

      <mesh>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color="#f5c85c" />
      </mesh>
    </group>
  )
}

function ForestCompanion() {
  return (
    <group position={[0.8, 1.35, 2.05]}>
      <mesh castShadow>
        <sphereGeometry args={[0.48, 24, 24]} />
        <meshStandardMaterial color="#788c67" roughness={1} />
      </mesh>

      <mesh position={[0, -0.12, 0.35]} scale={[0.72, 0.72, 0.3]}>
        <sphereGeometry args={[0.43, 20, 20]} />
        <meshStandardMaterial color="#f2e6c8" roughness={1} />
      </mesh>

      {[-0.25, 0.25].map((x) => (
        <mesh
          key={x}
          position={[x, 0.52, 0.02]}
          rotation={[0, 0, x * 0.5]}
        >
          <coneGeometry args={[0.12, 0.38, 12]} />
          <meshStandardMaterial color="#788c67" />
        </mesh>
      ))}

      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.44]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#25251e" />
        </mesh>
      ))}

      <mesh position={[0, 0.02, 0.47]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#514438" />
      </mesh>
    </group>
  )
}

function InteriorDecor({ isNight }: { isNight: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4.35, 0.14, 3.45]} />
        <meshStandardMaterial color="#ad8258" roughness={0.95} />
      </mesh>

      <mesh
        position={[-0.15, 0.105, -0.15]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.1, 1.65]} />
        <meshStandardMaterial color="#9d7660" roughness={1} />
      </mesh>

      <mesh
        position={[-0.15, 0.108, -0.15]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.85, 0.94, 4]} />
        <meshStandardMaterial color="#d5b681" roughness={1} />
      </mesh>

      {[-1.65, 0, 1.65].map((x) => (
        <mesh key={x} position={[x, 2.58, 0]}>
          <boxGeometry args={[0.13, 0.18, 3.35]} />
          <meshStandardMaterial color="#765339" roughness={1} />
        </mesh>
      ))}

      <group position={[-0.3, 2.25, -0.25]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#725239" />
        </mesh>

        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.19, 16, 16]} />
          <meshStandardMaterial
            color="#ffdc9d"
            emissive="#ffc36c"
            emissiveIntensity={isNight ? 2 : 0.55}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          position={[0, -0.05, 0]}
          color="#ffd49b"
          intensity={isNight ? 1.4 : 0.35}
          distance={5}
        />
      </group>
    </group>
  )
}

/* LIBRARY ROOM */
function LibraryRoomShell({ isNight }: { isNight: boolean }) {
  return (
    <group position={[4.45, 0, -0.65]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.14, 3.45]} />
        <meshStandardMaterial color="#ad8258" roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.35, -1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 1.35, 1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Right wall - front section */}
      <mesh position={[2.1, 1.35, 1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Right wall - back section */}
      <mesh position={[2.1, 1.35, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Wall above the Workshop doorway */}
      <mesh position={[2.1, 2.4, 0]}>
        <boxGeometry args={[0.12, 0.6, 1.35]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Library ceiling beams */}
      {[-1.4, 0, 1.4].map((z) => (
        <mesh key={z} position={[0, 2.58, z]}>
          <boxGeometry args={[4.15, 0.16, 0.12]} />
          <meshStandardMaterial color="#765339" roughness={1} />
        </mesh>
      ))}

      <LibraryRoom isNight={isNight} />
    </group>
  )
}

/* PROJECT WORKSHOP ROOM */
function WorkshopRoomShell({ isNight }: { isNight: boolean }) {
  return (
    <group position={[8.9, 0, -0.65]}>
      {/* Wooden floor */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.14, 3.45]} />
        <meshStandardMaterial color="#ad8258" roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.35, -1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 1.35, 1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Right wall - front section, leaving doorway to Achievements */}
      <mesh position={[2.1, 1.35, 1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Right wall - back section */}
      <mesh position={[2.1, 1.35, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Wall above the Achievements doorway */}
      <mesh position={[2.1, 2.4, 0]}>
        <boxGeometry args={[0.12, 0.6, 1.35]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Ceiling beams */}
      {[-1.4, 0, 1.4].map((z) => (
        <mesh key={z} position={[0, 2.58, z]}>
          <boxGeometry args={[4.15, 0.16, 0.12]} />
          <meshStandardMaterial color="#765339" roughness={1} />
        </mesh>
      ))}

      <WorkshopRoom isNight={isNight} />
    </group>
  )
}

/* ACHIEVEMENT GALLERY ROOM */
function AchievementRoomShell({ isNight }: { isNight: boolean }) {
  return (
    <group position={[13.35, 0, -0.65]}>
      {/* Wooden floor */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.14, 3.45]} />
        <meshStandardMaterial color="#ad8258" roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.35, -1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 1.35, 1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Left wall - front section, leaving doorway open */}
      <mesh position={[-2.1, 1.35, 1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Left wall - back section */}
      <mesh position={[-2.1, 1.35, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Wall above entrance from Workshop */}
      <mesh position={[-2.1, 2.4, 0]}>
        <boxGeometry args={[0.12, 0.6, 1.35]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Right wall - front section, leaving Mailbox doorway open */}
      <mesh position={[2.1, 1.35, 1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Right wall - back section */}
      <mesh position={[2.1, 1.35, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Wall above the Mailbox doorway */}
      <mesh position={[2.1, 2.4, 0]}>
        <boxGeometry args={[0.12, 0.6, 1.35]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Ceiling beams */}
      {[-1.4, 0, 1.4].map((z) => (
        <mesh key={z} position={[0, 2.58, z]}>
          <boxGeometry args={[4.15, 0.16, 0.12]} />
          <meshStandardMaterial color="#765339" roughness={1} />
        </mesh>
      ))}

      <AchievementRoom isNight={isNight} />
    </group>
  )
}

/* MAILBOX / CONTACT ROOM */
function MailboxRoomShell({ isNight }: { isNight: boolean }) {
  return (
    <group position={[17.8, 0, -0.65]}>
      {/* Wooden floor */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4.3, 0.14, 3.45]} />
        <meshStandardMaterial color="#ad8258" roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.35, -1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 1.35, 1.72]} receiveShadow>
        <boxGeometry args={[4.3, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Left wall - front section, leaving Gallery doorway open */}
      <mesh position={[-2.1, 1.35, 1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Left wall - back section */}
      <mesh position={[-2.1, 1.35, -1.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.05]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Wall above the doorway */}
      <mesh position={[-2.1, 2.4, 0]}>
        <boxGeometry args={[0.12, 0.6, 1.35]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Outer right wall */}
      <mesh position={[2.1, 1.35, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.7, 3.45]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Ceiling beams */}
      {[-1.4, 0, 1.4].map((z) => (
        <mesh key={z} position={[0, 2.58, z]}>
          <boxGeometry args={[4.15, 0.16, 0.12]} />
          <meshStandardMaterial color="#765339" roughness={1} />
        </mesh>
      ))}

      <MailboxRoom isNight={isNight} />
    </group>
  )
}

export function Cottage({ isNight }: { isNight: boolean }) {
  const door = useRef<THREE.Group>(null)
  const { progress } = useSceneMotion()

  useFrame(() => {
    if (!door.current) return

    const opening = THREE.MathUtils.smoothstep(progress, 0.48, 0.65)
    door.current.rotation.y = -opening * 1.65
  })

  const flowerColors = ['#f4b7ad', '#f6e3c0', '#e7a8bb', '#e7d7a0']

  return (
    <group position={[8, 0, -1]}>
      {/* COTTAGE INTERIOR */}

      {/* Back wall */}
      <mesh position={[0, 1.35, -1.74]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 2.7, 0.12]} />
        <meshStandardMaterial color="#e9d5ae" roughness={1} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-2.19, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 2.7, 3.6]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Right wall: front section */}
      <mesh position={[2.19, 1.35, 1.1]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 2.7, 1.4]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Right wall: back section */}
      <mesh position={[2.19, 1.35, -1.55]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 2.7, 0.5]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Top of connecting doorway */}
      <mesh position={[2.19, 2.4, -0.65]} castShadow>
        <boxGeometry args={[0.12, 0.6, 1.35]} />
        <meshStandardMaterial color="#e5cfaa" roughness={1} />
      </mesh>

      {/* Front wall: left side of entrance */}
      <mesh position={[-2.175, 1.35, 1.84]} castShadow>
        <boxGeometry args={[0.15, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Front wall: between door and window */}
      <mesh position={[-0.1875, 1.35, 1.84]} castShadow>
        <boxGeometry args={[0.825, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Front wall: right side of window */}
      <mesh position={[2.0625, 1.35, 1.84]} castShadow>
        <boxGeometry args={[0.375, 2.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Front wall above the window */}
      <mesh position={[1.05, 2.34, 1.84]}>
        <boxGeometry args={[1.65, 0.72, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      {/* Front wall below the window */}
      <mesh position={[1.05, 0.35, 1.84]}>
        <boxGeometry args={[1.65, 0.7, 0.12]} />
        <meshStandardMaterial color="#315e3d" roughness={0.95} />
      </mesh>

      <InteriorDecor isNight={isNight} />
      <WelcomeRoom isNight={isNight} />

      {/* Connected rooms */}
      <LibraryRoomShell isNight={isNight} />
      <WorkshopRoomShell isNight={isNight} />
      <AchievementRoomShell isNight={isNight} />
      <MailboxRoomShell isNight={isNight} />

      {/* COTTAGE EXTERIOR */}

      {/* Green roof */}
      <mesh position={[0, 2.95, 0]} castShadow>
        <boxGeometry args={[5, 0.3, 4.1]} />
        <meshStandardMaterial color="#355b3e" roughness={1} />
      </mesh>

      {/* Roof edge */}
      <mesh position={[0, 2.75, 2.05]}>
        <boxGeometry args={[5.1, 0.18, 0.18]} />
        <meshStandardMaterial color="#244b32" />
      </mesh>

      {/* Shop sign */}
      <mesh position={[0, 2.35, 1.96]}>
        <boxGeometry args={[3.8, 0.48, 0.12]} />
        <meshStandardMaterial color="#214a32" roughness={0.9} />
      </mesh>

      <mesh position={[0, 2.35, 2.04]}>
        <boxGeometry args={[3.6, 0.035, 0.025]} />
        <meshStandardMaterial color="#c7a56b" />
      </mesh>

      {/* Warm shop window */}
      <mesh position={[1.05, 1.35, 1.96]}>
        <boxGeometry args={[1.65, 1.25, 0.08]} />
        <meshStandardMaterial
          color={isNight ? '#ffd28c' : '#e7c98e'}
          emissive="#ffbd69"
          emissiveIntensity={isNight ? 1.3 : 0.16}
          toneMapped={false}
        />
      </mesh>

      {/* Window frame */}
      <mesh position={[1.05, 1.35, 2.03]}>
        <boxGeometry args={[1.78, 1.38, 0.08]} />
        <meshStandardMaterial color="#315e3d" />
      </mesh>

      {/* Window glass */}
      <mesh position={[1.05, 1.35, 2.09]}>
        <boxGeometry args={[1.55, 1.15, 0.025]} />
        <meshStandardMaterial
          color="#f4dca7"
          emissive="#f4c979"
          emissiveIntensity={isNight ? 1.4 : 0.12}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Window crossbars */}
      <mesh position={[1.05, 1.35, 2.13]}>
        <boxGeometry args={[0.07, 1.2, 0.06]} />
        <meshStandardMaterial color="#315e3d" />
      </mesh>

      <mesh position={[1.05, 1.35, 2.14]}>
        <boxGeometry args={[1.65, 0.07, 0.06]} />
        <meshStandardMaterial color="#315e3d" />
      </mesh>

      {/* Window sill */}
      <mesh position={[1.05, 0.65, 2.15]}>
        <boxGeometry args={[1.95, 0.14, 0.38]} />
        <meshStandardMaterial color="#a77c51" />
      </mesh>

      <ForestCompanion />

      {/* Door frame */}
      <mesh position={[-1.35, 1.15, 1.98]}>
        <boxGeometry args={[1.5, 2.25, 0.12]} />
        <meshStandardMaterial color="#234a31" />
      </mesh>

      {/* Scroll-controlled hinged door */}
      <group ref={door} position={[-2.05, 0, 2.12]}>
        <mesh position={[0.35, 1.1, 0]} castShadow>
          <boxGeometry args={[0.7, 2.15, 0.14]} />
          <meshStandardMaterial color="#4d9954" roughness={0.85} />
        </mesh>

        <mesh position={[0.35, 1.1, 0.085]}>
          <boxGeometry args={[0.48, 1.85, 0.025]} />
          <meshStandardMaterial color="#3b7545" />
        </mesh>

        <mesh position={[0.62, 1.1, 0.13]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#d8b66d" metalness={0.5} />
        </mesh>
      </group>

      {/* Doorstep */}
      <mesh position={[-1.3, 0.08, 2.3]} receiveShadow>
        <boxGeometry args={[1.9, 0.16, 0.8]} />
        <meshStandardMaterial color="#d7bd8f" />
      </mesh>

      {/* Outdoor tea table */}
      <group position={[2.05, 0, 3.1]}>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.1, 24]} />
          <meshStandardMaterial color="#eee0bb" />
        </mesh>

        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.07, 0.12, 0.7, 12]} />
          <meshStandardMaterial color="#483d2c" />
        </mesh>

        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 20]} />
          <meshStandardMaterial color="#483d2c" />
        </mesh>

        <mesh position={[0, 0.84, 0]}>
          <cylinderGeometry args={[0.13, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#f5e7c8" />
        </mesh>
      </group>

      {/* Flowering roof vines */}
      {Array.from({ length: 13 }).map((_, i) => (
        <group key={i}>
          <mesh
            position={[
              -2.1 + i * 0.35,
              3.15 + Math.sin(i * 0.8) * 0.1,
              1.95,
            ]}
            rotation={[0.2, 0, 0.3]}
          >
            <sphereGeometry
              args={[0.2 + (i % 3) * 0.04, 10, 10]}
            />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#497b40' : '#648d4c'}
              roughness={1}
            />
          </mesh>

          {i % 2 === 0 && (
            <Flower
              position={[-2.1 + i * 0.35, 3.32, 2.05]}
              color={flowerColors[i % flowerColors.length]}
              scale={0.8}
            />
          )}
        </group>
      ))}

      {/* Potted flowers */}
      {[-2.35, 2.75, 1.1].map((x, i) => (
        <group
          key={x}
          position={[x, 0, 2.7 + (i === 2 ? 1 : 0)]}
        >
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.22, 0.16, 0.42, 12]} />
            <meshStandardMaterial color="#b97854" />
          </mesh>

          {Array.from({ length: 4 }).map((_, j) => (
            <Flower
              key={j}
              position={[
                Math.cos(j * Math.PI / 2) * 0.16,
                0.55 + (j % 2) * 0.12,
                Math.sin(j * Math.PI / 2) * 0.16,
              ]}
              color={flowerColors[(i + j) % flowerColors.length]}
              scale={0.7}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
