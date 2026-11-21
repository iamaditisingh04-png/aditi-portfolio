
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import {
  CREEK_Z_END,
  CREEK_Z_START,
  WATER_LEVEL,
  creekCenterX,
  creekHalfWidth,
} from './world'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vUv = uv;

    vec3 transformed = position;

    float wave1 = sin(position.x * 0.65 + uTime * 0.28);
    float wave2 = sin(position.z * 0.48 - uTime * 0.2);
    float wave3 = sin(position.x * 1.1 + position.z * 0.7 + uTime * 0.16);

    transformed.y += wave1 * 0.009
                   + wave2 * 0.007
                   + wave3 * 0.003;

    vec4 world = modelMatrix * vec4(transformed, 1.0);

    vWorld = world.xyz;

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uNight;
  uniform vec3 uWater;
  uniform vec3 uDeep;
  uniform vec3 uReflection;
  uniform vec3 uSun;
  uniform vec3 uMoon;

  varying vec2 vUv;
  varying vec3 vWorld;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    // Longitudinal movement gives the water a gentle flowing feel.
    vec2 uv = vec2(vUv.x * 3.5, vUv.y * 10.0);

    float broad = noise(
      uv * 0.7 + vec2(uTime * 0.018, -uTime * 0.055)
    );

    float detail = noise(
      uv * 2.2 + vec2(-uTime * 0.025, uTime * 0.045)
    );

    float ripple =
      sin(uv.x * 5.0 + uv.y * 3.0 + uTime * 0.3) * 0.5 + 0.5;

    float depth = smoothstep(
      0.0,
      0.48,
      min(vUv.x, 1.0 - vUv.x)
    );

    // Original daytime water colours.
    vec3 color = mix(uWater, uDeep, depth * 0.58);

    color = mix(color, uReflection, broad * 0.18);
    color = mix(color, uSun, ripple * 0.045);

    float shimmer = smoothstep(0.84, 0.98, detail);
    color += uSun * shimmer * 0.07;

    float reflection = smoothstep(0.5, 0.95, broad);
    color = mix(color, uReflection, reflection * 0.1);

    // ----------------------------------------
    // NIGHT-ONLY SILVER-BLUE MOONLIGHT
    // ----------------------------------------

    // Long, soft reflections moving downstream.
    float moonWave = sin(
      uv.y * 4.0 -
      uv.x * 2.0 +
      uTime * 0.38
    );

    float moonPattern = noise(
      uv * vec2(1.4, 2.8) +
      vec2(uTime * 0.025, -uTime * 0.07)
    );

    // Narrow, broken highlights instead of a bright mirror.
    float moonShimmer = smoothstep(
      0.67,
      0.96,
      moonPattern + moonWave * 0.12
    );

    // Keep the highlights softer near the river banks.
    float moonEdge = smoothstep(
      0.02,
      0.34,
      min(vUv.x, 1.0 - vUv.x)
    );

    float moonReflection =
      moonShimmer * moonEdge * (0.16 + broad * 0.12);

    // A very subtle cool tint across the water at night.
    color = mix(
      color,
      uMoon,
      uNight * (0.045 + broad * 0.035)
    );

    // Scattered silver-blue highlights.
    color += uMoon * moonReflection * uNight * 0.42;

    // Tiny moving moonlit ripples.
    float silverRipple = smoothstep(
      0.88,
      0.99,
      ripple * detail
    );

    color += uMoon * silverRipple * uNight * 0.12;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function buildRiverSurface() {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const segments = 220

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments

    const z = THREE.MathUtils.lerp(
      CREEK_Z_START,
      CREEK_Z_END,
      t,
    )

    const center = creekCenterX(z)
    const half = creekHalfWidth(z) * 0.99

    positions.push(center - half, WATER_LEVEL, z)
    positions.push(center + half, WATER_LEVEL, z)

    uvs.push(0, t)
    uvs.push(1, t)
  }

  for (let i = 0; i < segments; i += 1) {
    const a = i * 2

    indices.push(
      a,
      a + 2,
      a + 1,
      a + 1,
      a + 2,
      a + 3,
    )
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )

  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(uvs, 2),
  )

  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

/** A gently flowing countryside river with sunset and moonlit reflections. */
export function CreekWater() {
  const { animate, theme } = useSceneMotion()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNight: { value: 0 },
      uWater: {
        value: new THREE.Color('#75aaa0'),
      },
      uDeep: {
        value: new THREE.Color('#376e70'),
      },
      uReflection: {
        value: new THREE.Color('#dba9a0'),
      },
      uSun: {
        value: new THREE.Color('#ffe0b5'),
      },
      uMoon: {
        value: new THREE.Color('#a9c9ed'),
      },
    }),
    [],
  )

  const geometry = useMemo(() => buildRiverSurface(), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: false,
        depthWrite: true,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  )

  // Smoothly transition the moonlight when changing themes.
  useFrame((_, delta) => {
    const targetNight = theme === 'night' ? 1 : 0

    uniforms.uNight.value = THREE.MathUtils.damp(
      uniforms.uNight.value,
      targetNight,
      2.5,
      delta,
    )

    if (animate) {
      uniforms.uTime.value += delta * 0.45
    }
  })

  return (
    <group>
      <mesh
        geometry={geometry}
        material={material}
        renderOrder={2}
        receiveShadow
      />
    </group>
  )
}

/** Compatibility export: no stones or aquatic decorations. */
export function CreekStones() {
  return null
}
