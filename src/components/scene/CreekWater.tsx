import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './sceneMotion'
import { pebbleTexture } from './textures'
import {
  CREEK_Z_END,
  CREEK_Z_START,
  WATER_LEVEL,
  creekCenterX,
  creekHalfWidth,
  mulberry32,
} from './world'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    transformed.y += sin(position.z * 1.9 + uTime * 1.2) * 0.014
                   + sin(position.x * 2.7 - uTime * 0.9) * 0.01
                   + sin(position.z * 4.3 - uTime * 2.1) * 0.004;
    vec4 world = modelMatrix * vec4(transformed, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uShallow;
  uniform vec3 uSky;
  uniform vec3 uSun;
  uniform vec3 uSunDirection;
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
    vec2 uv = vec2(vUv.x * 3.4, vUv.y * 30.0);
    float flow = uTime * 0.55;

    float n1 = noise(vec2(uv.x + sin(uv.y * 0.3 + uTime * 0.35) * 0.9, uv.y - flow));
    float n2 = noise(vec2(uv.x * 2.1 - 3.0, uv.y * 1.7 - flow * 1.5));
    float n3 = noise(vec2(uv.x * 4.6 + 7.0, uv.y * 3.3 - flow * 2.2));

    // Slow, large-scale currents shift the turquoise from jade to aqua.
    float current = noise(vec2(uv.x * 0.55 + uTime * 0.045, uv.y * 0.42 - uTime * 0.08));
    float pool = noise(vec2(uv.x * 0.22 - uTime * 0.03, uv.y * 0.18 + uTime * 0.05));

    // Surface normal derived from the noise field, for real highlights.
    float e = 0.09;
    float hC = n1 * 0.6 + n3 * 0.4;
    float hX = noise(vec2(uv.x + e + sin(uv.y * 0.3 + uTime * 0.35) * 0.9, uv.y - flow)) * 0.6
             + noise(vec2((uv.x + e) * 4.6 + 7.0, uv.y * 3.3 - flow * 2.2)) * 0.4;
    float hY = noise(vec2(uv.x + sin((uv.y + e) * 0.3 + uTime * 0.35) * 0.9, uv.y + e - flow)) * 0.6
             + noise(vec2(uv.x * 4.6 + 7.0, (uv.y + e) * 3.3 - flow * 2.2)) * 0.4;
    vec3 nrm = normalize(vec3((hC - hX) * 1.7, 1.0, (hC - hY) * 1.7));

    vec3 viewDir = normalize(cameraPosition - vWorld);
    float depth = smoothstep(0.0, 0.5, min(vUv.x, 1.0 - vUv.x));

    vec3 color = mix(uShallow, uMid, depth);
    color = mix(color, uDeep, smoothstep(0.45, 1.0, depth) * 0.52 + n2 * 0.1);

    // Shifting bands of jade, aqua and glassy green.
    vec3 jade = vec3(0.18, 0.62, 0.52);
    vec3 aqua = vec3(0.42, 0.86, 0.82);
    color = mix(color, jade, smoothstep(0.25, 0.85, current) * 0.38);
    color = mix(color, aqua, smoothstep(0.55, 1.0, pool) * 0.22);
    // A warm sheen where the sun grazes the slow-moving pools.
    color = mix(color, uSun * 0.86, smoothstep(0.6, 1.0, pool) * 0.14);

    // Caustic ribbons of light travelling over the bed.
    float caustic = smoothstep(0.58, 0.99, n1 * 0.5 + n3 * 0.6);
    color += vec3(0.36, 0.62, 0.5) * caustic * 0.42;

    // Sky reflection at grazing angles.
    float fresnel = pow(1.0 - max(dot(nrm, viewDir), 0.0), 3.0);
    color = mix(color, uSky, clamp(fresnel * 0.95, 0.0, 0.62));

    // The far bank and treeline tint the surface where it meets the shore.
    float edge = min(vUv.x, 1.0 - vUv.x);
    float bankReflection = smoothstep(0.32, 0.0, edge) * (0.35 + fresnel * 0.65);
    color = mix(color, vec3(0.19, 0.35, 0.22), bankReflection * 0.34);

    // Sun glints on the ripple normals.
    vec3 halfDir = normalize(normalize(uSunDirection) + viewDir);
    float specular = pow(max(dot(nrm, halfDir), 0.0), 92.0);
    color += uSun * specular * 0.9;

    // Foam gathering against the banks.
    float foamNoise = noise(vec2(uv.x * 4.2 + uTime * 0.6, uv.y * 2.0 - flow * 2.0));
    float foam = (1.0 - smoothstep(0.0, 0.15, edge + foamNoise * 0.06)) * (0.4 + foamNoise * 0.6);
    color = mix(color, vec3(0.97, 1.0, 0.97), foam * 0.7);

    // Streamers of foam pulled along the current.
    float streak = smoothstep(0.9, 1.0, noise(vec2(uv.x * 9.0, uv.y * 1.1 - flow * 3.0)));
    color += vec3(0.82, 0.94, 0.9) * streak * 0.22;

    // Transparent at the shallows so the pebbles read through the water.
    float alpha = mix(0.34, 0.88, smoothstep(0.0, 0.78, depth));
    alpha = mix(alpha, 1.0, foam * 0.55);

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function buildRibbon(halfWidthFactor: number, y: number, segments = 140) {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const z = THREE.MathUtils.lerp(CREEK_Z_START, CREEK_Z_END, t)
    const center = creekCenterX(z)
    const half = creekHalfWidth(z) * halfWidthFactor
    positions.push(center - half, y, z)
    positions.push(center + half, y, z)
    uvs.push(0, t * 6)
    uvs.push(1, t * 6)
  }

  for (let i = 0; i < segments; i += 1) {
    const a = i * 2
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/** Clear turquoise water with flowing ripples, reflections and shore foam. */
export function CreekWater() {
  const { animate } = useSceneMotion()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color('#0a504c') },
      uMid: { value: new THREE.Color('#28a89d') },
      uShallow: { value: new THREE.Color('#6fdccd') },
      uSky: { value: new THREE.Color('#c8ecf6') },
      uSun: { value: new THREE.Color('#fff3c9') },
      uSunDirection: { value: new THREE.Vector3(0.42, 0.42, -0.8).normalize() },
    }),
    [],
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

  const geometry = useMemo(() => buildRibbon(0.99, WATER_LEVEL), [])
  const bedGeometry = useMemo(() => buildRibbon(0.94, -0.34, 90), [])
  const pebbles = useMemo(() => pebbleTexture(), [])

  useFrame((_, delta) => {
    if (animate) uniforms.uTime.value += delta * 0.9
  })

  return (
    <group>
      <mesh geometry={bedGeometry} receiveShadow>
        <meshStandardMaterial map={pebbles} color="#ded3b4" roughness={0.92} metalness={0} />
      </mesh>
      <mesh geometry={geometry} material={material} renderOrder={2} />
    </group>
  )
}

/** Smooth pebbles resting in the shallows, seen through the water. */
export function CreekStones() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const stones = useMemo(() => {
    const rand = mulberry32(811)
    const result: Array<{
      x: number
      y: number
      z: number
      scale: [number, number, number]
      rotation: number
      tint: string
    }> = []
    const palette = ['#d9cbaa', '#bdb69a', '#c97850', '#8fa07e', '#e2dcc2', '#a9a48a']

    // Cluster the pebbles so the shallows read as gravel bars.
    for (let cluster = 0; cluster < 24; cluster += 1) {
      const cz = CREEK_Z_START + 2.5 + rand() * (CREEK_Z_END - CREEK_Z_START - 5)
      const side = rand() > 0.5 ? 1 : -1
      const cx = creekCenterX(cz) + side * creekHalfWidth(cz) * (0.4 + rand() * 0.45)
      const members = 3 + Math.floor(rand() * 5)

      for (let i = 0; i < members; i += 1) {
        result.push({
          x: cx + (rand() - 0.5) * 1.5,
          y: -0.16 + rand() * 0.1,
          z: cz + (rand() - 0.5) * 1.6,
          scale: [0.06 + rand() * 0.15, 0.035 + rand() * 0.06, 0.06 + rand() * 0.15],
          rotation: rand() * Math.PI,
          tint: palette[Math.floor(rand() * palette.length)],
        })
      }
    }

    return result
  }, [])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    stones.forEach((stone, index) => {
      dummy.position.set(stone.x, stone.y, stone.z)
      dummy.rotation.set(0, stone.rotation, 0)
      dummy.scale.set(...stone.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      color.set(stone.tint)
      mesh.setColorAt(index, color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [color, dummy, stones])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, stones.length]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.05} />
    </instancedMesh>
  )
}
