import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { mistTexture } from './textures'
import { creekCenterX, organic, terrainHeight } from './world'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float column = hash(vec2(floor(uv.x * 28.0), 1.0));
    float flow = fract(uv.y * 2.2 + uTime * (1.1 + column * 0.7) + column * 5.0);
    float streak = smoothstep(0.0, 0.22, flow) * (1.0 - smoothstep(0.6, 1.0, flow));

    float edges = smoothstep(0.0, 0.16, uv.x) * smoothstep(0.0, 0.16, 1.0 - uv.x);
    float heightFade = smoothstep(0.0, 0.18, uv.y) * (1.0 - smoothstep(0.82, 1.0, uv.y));

    vec3 color = mix(vec3(0.34, 0.8, 0.76), vec3(1.0, 1.0, 0.97), 0.35 + streak * 0.62);
    float alpha = (0.26 + streak * 0.6) * edges * heightFade * uOpacity;

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

type WaterfallProps = {
  position: [number, number, number]
  width?: number
  height?: number
  opacity?: number
}

/** A small mossy waterfall spilling into the creek, with froth at its base. */
export function Waterfall({ position, width = 2.1, height = 2.7, opacity = 1 }: WaterfallProps) {
  const { animate } = useSceneMotion()
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: opacity } }),
    [opacity],
  )
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  )

  const rockGeometry = useMemo(() => organic(new THREE.DodecahedronGeometry(1, 1), 0.24, 7), [])
  const mist = useMemo(() => mistTexture(), [])
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (animate) uniforms.uTime.value += delta
    if (groupRef.current && animate) {
      groupRef.current.position.y = position[1] + Math.sin(uniforms.uTime.value * 0.6) * 0.008
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh
        geometry={rockGeometry}
        position={[-width * 0.8, height * 0.4, -0.6]}
        scale={[1.6, height * 0.6, 1.15]}
        rotation={[0.1, 0.5, 0.05]}
      >
        <meshStandardMaterial color="#5c7a54" roughness={1} flatShading />
      </mesh>
      <mesh
        geometry={rockGeometry}
        position={[width * 0.74, height * 0.48, -0.55]}
        scale={[1.4, height * 0.68, 1.1]}
        rotation={[-0.08, -0.4, -0.04]}
      >
        <meshStandardMaterial color="#4e6f4a" roughness={1} flatShading />
      </mesh>
      <mesh
        geometry={rockGeometry}
        position={[0, height * 0.84, -0.8]}
        scale={[width * 1.02, 0.55, 0.95]}
        rotation={[0.06, 0.2, 0]}
      >
        <meshStandardMaterial color="#6c8a5c" roughness={1} flatShading />
      </mesh>
      <mesh
        geometry={rockGeometry}
        position={[-width * 0.2, height * 0.94, -0.5]}
        scale={[0.7, 0.4, 0.7]}
        rotation={[0, 1.1, 0.12]}
      >
        <meshStandardMaterial color="#88a76c" roughness={1} flatShading />
      </mesh>

      <mesh position={[0, height / 2, 0.12]}>
        <planeGeometry args={[width * 0.78, height, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Froth and spray where the water lands. */}
      {[
        { position: [0, 0.16, 0.4] as [number, number, number], scale: [width * 1.5, 0.9] },
        { position: [-width * 0.4, 0.1, 0.55] as [number, number, number], scale: [width * 0.9, 0.6] },
        { position: [width * 0.45, 0.12, 0.5] as [number, number, number], scale: [width * 0.8, 0.55] },
      ].map((foam, index) => (
        <sprite key={index} position={foam.position} scale={[foam.scale[0], foam.scale[1], 1]}>
          <spriteMaterial
            map={mist}
            transparent
            opacity={0.45}
            depthWrite={false}
            color="#f2fffb"
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

/** The main fall at the head of the creek plus a smaller tributary trickle. */
export function Waterfalls() {
  const mainX = creekCenterX(-16)
  const mainZ = -16.2
  const sideX = creekCenterX(-9.5) - 5.6

  return (
    <group>
      <Waterfall
        position={[mainX, terrainHeight(mainX, mainZ) - 0.35, mainZ]}
        width={2.5}
        height={3.2}
      />
      <Waterfall
        position={[sideX, terrainHeight(sideX, -9.5) + 0.15, -9.5]}
        width={0.9}
        height={1.6}
        opacity={0.85}
      />
    </group>
  )
}
