
import * as THREE from 'three'

type AchievementRoomProps = {
  isNight: boolean
}

function AwardFrame({
  position,
  rotation = 0,
  accent,
  isNight,
}: {
  position: [number, number, number]
  rotation?: number
  accent: string
  isNight: boolean
}) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Wooden frame */}
      <mesh>
        <boxGeometry args={[0.92, 0.82, 0.12]} />
        <meshStandardMaterial
          color="#805536"
          roughness={0.82}
        />
      </mesh>

      {/* Paper inside */}
      <mesh position={[0, 0, 0.071]}>
        <boxGeometry args={[0.76, 0.66, 0.018]} />
        <meshStandardMaterial
          color={isNight ? '#e8dfc7' : '#fff4d9'}
          roughness={1}
        />
      </mesh>

      {/* Decorative emblem */}
      <mesh position={[0, 0.12, 0.09]}>
        <circleGeometry args={[0.13, 32]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.65}
        />
      </mesh>

      {/* Certificate lines */}
      {[0, 1, 2].map((line) => (
        <mesh
          key={line}
          position={[0, -0.08 - line * 0.09, 0.09]}
        >
          <boxGeometry args={[0.42 - line * 0.07, 0.018, 0.012]} />
          <meshStandardMaterial color="#9c8b70" />
        </mesh>
      ))}
    </group>
  )
}

function Medal({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.09, 0.38, 0.025]} />
        <meshStandardMaterial color="#b65c50" />
      </mesh>

      <mesh position={[0, -0.08, 0.025]}>
        <cylinderGeometry args={[0.17, 0.17, 0.07, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, -0.08, 0.07]}>
        <circleGeometry args={[0.085, 6]} />
        <meshStandardMaterial
          color="#fff0bd"
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
    </group>
  )
}

function Trophy({
  position,
  isNight,
}: {
  position: [number, number, number]
  isNight: boolean
}) {
  const gold = '#e6b84f'

  return (
    <group position={position}>
      {/* Trophy cup */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.28, 0.16, 0.42, 32, 1, true]} />
        <meshStandardMaterial
          color={gold}
          metalness={0.72}
          roughness={0.24}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cup base */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.15, 0.19, 0.12, 24]} />
        <meshStandardMaterial color={gold} metalness={0.65} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
        <meshStandardMaterial color={gold} metalness={0.65} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.48, 0.12, 0.3]} />
        <meshStandardMaterial color="#805536" roughness={0.8} />
      </mesh>

      {/* Handles */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.29, 0.62, 0]}
          rotation={[0, 0, side * 0.18]}
        >
          <torusGeometry args={[0.13, 0.035, 12, 24]} />
          <meshStandardMaterial
            color={gold}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      ))}

      {isNight && (
        <pointLight
          position={[0, 0.65, 0.35]}
          color="#ffd77a"
          intensity={0.45}
          distance={2}
        />
      )}
    </group>
  )
}

function AchievementShelf({ isNight }: { isNight: boolean }) {
  return (
    <group position={[0, 0.95, -0.95]}>
      {/* Shelf */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 0.13, 0.55]} />
        <meshStandardMaterial color="#805536" roughness={0.82} />
      </mesh>

      {/* Shelf brackets */}
      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, -0.16, 0]}>
          <boxGeometry args={[0.12, 0.28, 0.3]} />
          <meshStandardMaterial color="#65432f" />
        </mesh>
      ))}

      <Trophy position={[-0.85, 0.1, 0.02]} isNight={isNight} />

      <group position={[0.35, 0.1, 0.02]}>
        <Medal position={[0, 0.23, 0]} color="#d9a441" />
        <Medal position={[0.48, 0.23, 0]} color="#b9c3ce" />
      </group>

      {/* Little keepsake box */}
      <mesh position={[1.12, 0.22, 0]}>
        <boxGeometry args={[0.42, 0.28, 0.35]} />
        <meshStandardMaterial color="#a76b48" roughness={0.75} />
      </mesh>

      <mesh position={[1.12, 0.37, 0]}>
        <boxGeometry args={[0.46, 0.06, 0.39]} />
        <meshStandardMaterial color="#d4a66c" roughness={0.65} />
      </mesh>
    </group>
  )
}

function AchievementBoard({ isNight }: { isNight: boolean }) {
  return (
    <group position={[0, 2.15, -1.48]}>
      {/* Cork board */}
      <mesh>
        <boxGeometry args={[3.65, 1.75, 0.12]} />
        <meshStandardMaterial
          color={isNight ? '#78563d' : '#a87850'}
          roughness={1}
        />
      </mesh>

      {/* Inner board */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[3.43, 1.53, 0.025]} />
        <meshStandardMaterial
          color={isNight ? '#b58b65' : '#d5b18a'}
          roughness={1}
        />
      </mesh>

      <AwardFrame
        position={[-1.05, 0.27, 0.11]}
        rotation={-0.035}
        accent="#d9a441"
        isNight={isNight}
      />

      <AwardFrame
        position={[0, 0.27, 0.11]}
        rotation={0.025}
        accent="#739a78"
        isNight={isNight}
      />

      <AwardFrame
        position={[1.05, 0.27, 0.11]}
        rotation={-0.025}
        accent="#bd7665"
        isNight={isNight}
      />

      {/* Decorative pinned notes */}
      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, -0.53, 0.115]}>
          <boxGeometry args={[0.42, 0.28, 0.025]} />
          <meshStandardMaterial
            color="#f1dfae"
            roughness={1}
          />
        </mesh>
      ))}

      {/* Pin heads */}
      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, -0.53, 0.15]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#bd6654" />
        </mesh>
      ))}
    </group>
  )
}

export function AchievementRoom({ isNight }: AchievementRoomProps) {
  return (
    <group>
      <AchievementBoard isNight={isNight} />
      <AchievementShelf isNight={isNight} />

      {/* Warm gallery lighting */}
      <pointLight
        position={[0, 2.7, 0.1]}
        color={isNight ? '#ffd38a' : '#fff0c9'}
        intensity={isNight ? 1.1 : 0.65}
        distance={6}
      />

      {/* Ceiling lamp */}
      <group position={[0, 3.15, -0.1]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#a87850" />
        </mesh>

        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.22, 20, 16]} />
          <meshStandardMaterial
            color="#ffe2a1"
            emissive="#ffbd58"
            emissiveIntensity={isNight ? 1.2 : 0.35}
            roughness={0.35}
          />
        </mesh>
      </group>
    </group>
  )
}
