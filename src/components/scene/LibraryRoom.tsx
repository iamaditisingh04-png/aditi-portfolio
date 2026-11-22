

function Bookshelf({ position }: { position: [number, number, number] }) {
  const bookColors = [
    '#a65f4b',
    '#d5ae70',
    '#66836a',
    '#7d789e',
    '#54758a',
    '#bd8b65',
    '#d2c18c',
  ]

  return (
    <group position={position}>
      {/* Wooden bookshelf frame */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.1, 0.28]} />
        <meshStandardMaterial color="#765039" roughness={0.95} />
      </mesh>

      {/* Shelf boards */}
      {[0.35, 1.05, 1.75].map((y) => (
        <mesh key={y} position={[0, y, 0.2]} castShadow>
          <boxGeometry args={[1.9, 0.09, 0.55]} />
          <meshStandardMaterial color="#b17d4f" roughness={0.9} />
        </mesh>
      ))}

      {/* Books */}
      {bookColors.map((color, i) => (
        <mesh
          key={i}
          position={[
            -0.72 + (i % 4) * 0.22,
            0.59 + Math.floor(i / 4) * 0.7,
            0.22,
          ]}
          rotation={[0, 0, i % 2 === 0 ? -0.07 : 0.07]}
          castShadow
        >
          <boxGeometry args={[0.17, 0.48 + (i % 3) * 0.08, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function ReadingDesk({ isNight }: { isNight: boolean }) {
  return (
    <group position={[0.25, 0, -0.45]}>
      {/* Desk top */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.13, 0.85]} />
        <meshStandardMaterial color="#986b43" roughness={0.85} />
      </mesh>

      {/* Desk legs */}
      {[-0.68, 0.68].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.48, z]}>
            <boxGeometry args={[0.1, 0.9, 0.1]} />
            <meshStandardMaterial color="#67452f" roughness={0.95} />
          </mesh>
        )),
      )}

      {/* Open book */}
      <group position={[-0.15, 1.04, 0]}>
        <mesh rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.62, 0.035, 0.42]} />
          <meshStandardMaterial color="#ead9ae" roughness={1} />
        </mesh>

        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.025, 0.012, 0.38]} />
          <meshStandardMaterial color="#a9875d" />
        </mesh>
      </group>

      {/* Desk lantern */}
      <group position={[0.58, 1.15, -0.18]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.15, 0.2, 12]} />
          <meshStandardMaterial
            color="#f6d99c"
            emissive="#ffc36c"
            emissiveIntensity={isNight ? 1.8 : 0.45}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          position={[0, 0.1, 0]}
          color="#ffd49b"
          intensity={isNight ? 0.8 : 0.2}
          distance={3}
        />
      </group>

      {/* Pencil cup */}
      <mesh position={[-0.58, 1.12, -0.2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 12]} />
        <meshStandardMaterial color="#66836a" />
      </mesh>

      {[-0.04, 0, 0.04].map((x) => (
        <mesh
          key={x}
          position={[-0.58 + x, 1.34, -0.2]}
          rotation={[0, 0, x * 3]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.35, 6]} />
          <meshStandardMaterial color="#bd8057" />
        </mesh>
      ))}
    </group>
  )
}

function ReadingChair() {
  return (
    <group position={[-0.95, 0, -0.25]}>
      {/* Seat */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.75, 0.16, 0.7]} />
        <meshStandardMaterial color="#8c6045" roughness={1} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.95, -0.28]} castShadow>
        <boxGeometry args={[0.75, 0.9, 0.13]} />
        <meshStandardMaterial color="#a87855" roughness={1} />
      </mesh>

      {/* Legs */}
      {[-0.27, 0.27].map((x) =>
        [-0.23, 0.23].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.23, z]}>
            <boxGeometry args={[0.09, 0.48, 0.09]} />
            <meshStandardMaterial color="#67452f" />
          </mesh>
        )),
      )}

      {/* Cushion */}
      <mesh position={[0, 0.58, 0.02]}>
        <boxGeometry args={[0.62, 0.08, 0.55]} />
        <meshStandardMaterial color="#c58b72" roughness={1} />
      </mesh>
    </group>
  )
}

function PottedPlant() {
  return (
    <group position={[1.55, 0, -0.85]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.38, 12]} />
        <meshStandardMaterial color="#b97854" />
      </mesh>

      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.35, 8]} />
        <meshStandardMaterial color="#54764b" />
      </mesh>

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.2,
            0.65 + (i % 2) * 0.12,
            Math.sin((i * Math.PI * 2) / 5) * 0.2,
          ]}
          rotation={[0.2, 0, Math.sin(i) * 0.5]}
          scale={[0.8, 1.2, 0.5]}
        >
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#668c58" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export function LibraryRoom({ isNight }: { isNight: boolean }) {
  return (
    <group>
      {/* Library rug */}
      <mesh
        position={[0.1, 0.115, -0.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[2.9, 2.1]} />
        <meshStandardMaterial color="#a36f62" roughness={1} />
      </mesh>

      {/* Bookshelves */}
      <Bookshelf position={[0.65, 0.08, -1.3]} />

      {/* Reading corner */}
      <ReadingDesk isNight={isNight} />
      <ReadingChair />

      {/* Plant */}
      <PottedPlant />

      {/* Warm ceiling light */}
      <group position={[0.2, 2.25, -0.65]}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ffdda1"
            emissive="#ffc36c"
            emissiveIntensity={isNight ? 2 : 0.4}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          color="#ffd49b"
          intensity={isNight ? 1.1 : 0.25}
          distance={4}
        />
      </group>
    </group>
  )
}

