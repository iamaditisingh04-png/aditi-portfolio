
function WorkshopDesk({ isNight }: { isNight: boolean }) {
  const glow = isNight ? 1.2 : 0.25

  return (
    <group position={[0, 0, 0]}>
      {/* Desk top */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.16, 1.05]} />
        <meshStandardMaterial color="#95633f" roughness={0.9} />
      </mesh>

      {/* Desk legs */}
      {[-1.05, 1.05].map((x) =>
        [-0.38, 0.38].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.52, z]}>
            <boxGeometry args={[0.13, 1.05, 0.13]} />
            <meshStandardMaterial color="#68452f" />
          </mesh>
        )),
      )}

      {/* Drawer */}
      <mesh position={[0, 0.82, 0.38]}>
        <boxGeometry args={[1.25, 0.3, 0.12]} />
        <meshStandardMaterial color="#70482f" />
      </mesh>

      {/* Drawer handle */}
      <mesh position={[0, 0.82, 0.46]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#d6b477" metalness={0.5} />
      </mesh>

      {/* Open notebook */}
      <group position={[-0.55, 1.15, -0.12]} rotation={[-0.04, 0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.75, 0.035, 0.52]} />
          <meshStandardMaterial color="#f2e6c9" roughness={1} />
        </mesh>
        {[-0.13, 0, 0.13].map((z) => (
          <mesh key={z} position={[0, 0.02, z]}>
            <boxGeometry args={[0.58, 0.008, 0.008]} />
            <meshStandardMaterial color="#a68d70" />
          </mesh>
        ))}
      </group>

      {/* Tiny glowing invention */}
      <group position={[0.65, 1.38, -0.15]}>
        <mesh>
          <icosahedronGeometry args={[0.2, 1]} />
          <meshStandardMaterial
            color="#a8d9bd"
            emissive="#65c99b"
            emissiveIntensity={glow}
            roughness={0.3}
          />
        </mesh>
        <pointLight
          color="#8ce4bd"
          intensity={isNight ? 0.7 : 0.15}
          distance={2}
        />
      </group>

      {/* Pencil holder */}
      <mesh position={[0.95, 1.27, 0.28]}>
        <cylinderGeometry args={[0.12, 0.12, 0.28, 12]} />
        <meshStandardMaterial color="#c58b59" />
      </mesh>

      {[-0.05, 0.03, 0.09].map((x, i) => (
        <mesh
          key={i}
          position={[0.95 + x, 1.52, 0.28]}
          rotation={[0, 0, (i - 1) * 0.12]}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
          <meshStandardMaterial
            color={['#d46f57', '#6b8fba', '#d6b65f'][i]}
          />
        </mesh>
      ))}
    </group>
  )
}

function ProjectDisplay({ isNight }: { isNight: boolean }) {
  return (
    <group position={[0, 1.85, -1.55]}>
      {/* Wooden board */}
      <mesh>
        <boxGeometry args={[2.8, 1.25, 0.14]} />
        <meshStandardMaterial color="#805638" roughness={1} />
      </mesh>

      {/* Board surface */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.62, 1.08, 0.025]} />
        <meshStandardMaterial
          color={isNight ? '#554b3e' : '#d8c39c'}
          roughness={1}
        />
      </mesh>

      {/* Little pinned project cards */}
      {[
        [-0.82, 0.24, '#e7b6a0'],
        [0, 0.24, '#d7dfa9'],
        [0.82, 0.24, '#a9c8c0'],
        [-0.42, -0.3, '#e9d7b4'],
        [0.55, -0.3, '#d4b5ce'],
      ].map(([x, y, color], i) => (
        <group
          key={i}
          position={[x as number, y as number, 0.105]}
          rotation={[0, 0, (i % 2 === 0 ? -1 : 1) * 0.06]}
        >
          <mesh>
            <boxGeometry args={[0.48, 0.38, 0.025]} />
            <meshStandardMaterial color={color as string} />
          </mesh>

          <mesh position={[0, 0.13, 0.025]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#b75f50" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WorkshopShelf() {
  return (
    <group position={[1.55, 0, -0.75]}>
      {/* Shelves */}
      {[0.55, 1.15, 1.75].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.85, 0.09, 0.5]} />
          <meshStandardMaterial color="#805638" roughness={0.9} />
        </mesh>
      ))}

      {/* Side supports */}
      {[-0.37, 0.37].map((x) => (
        <mesh key={x} position={[x, 1.15, 0]}>
          <boxGeometry args={[0.08, 1.4, 0.45]} />
          <meshStandardMaterial color="#68452f" />
        </mesh>
      ))}

      {/* Little storage boxes */}
      <mesh position={[-0.12, 0.75, 0]}>
        <boxGeometry args={[0.32, 0.3, 0.3]} />
        <meshStandardMaterial color="#b47b50" />
      </mesh>

      <mesh position={[0.15, 1.35, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshStandardMaterial color="#9caa78" />
      </mesh>

      {/* Rolled plans */}
      <mesh
        position={[-0.12, 1.95, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.07, 0.07, 0.48, 12]} />
        <meshStandardMaterial color="#e9d9b9" />
      </mesh>
    </group>
  )
}

function WorkshopLamp({ isNight }: { isNight: boolean }) {
  return (
    <group position={[-0.6, 2.55, -0.3]}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
        <meshStandardMaterial color="#725239" />
      </mesh>

      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffe0a5"
          emissive="#ffbf70"
          emissiveIntensity={isNight ? 2 : 0.5}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        position={[0, -0.12, 0]}
        color="#ffd49b"
        intensity={isNight ? 1.2 : 0.3}
        distance={4}
      />
    </group>
  )
}

export function WorkshopRoom({ isNight }: { isNight: boolean }) {
  return (
    <group>
      <WorkshopDesk isNight={isNight} />
      <ProjectDisplay isNight={isNight} />
      <WorkshopShelf />
      <WorkshopLamp isNight={isNight} />

      {/* Small stool */}
      <group position={[-1.05, 0, 0.85]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.12, 16]} />
          <meshStandardMaterial color="#a77b4e" />
        </mesh>

        {[-0.22, 0.22].map((x) =>
          [-0.22, 0.22].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.28, z]}>
              <boxGeometry args={[0.08, 0.55, 0.08]} />
              <meshStandardMaterial color="#68452f" />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}
