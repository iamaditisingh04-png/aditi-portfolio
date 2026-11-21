
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorldTheme } from '../../ThemeContext'

const vertexShader = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vDirection = world.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uHazeColor;

  varying vec3 vDirection;

  void main() {
    vec3 dir = normalize(vDirection);
    float elevation = clamp(dir.y, -0.25, 1.0);

    vec3 color = mix(
      uHorizon,
      uMid,
      smoothstep(-0.05, 0.19, elevation)
    );

    color = mix(
      color,
      uTop,
      smoothstep(0.16, 0.62, elevation)
    );

    float haze = smoothstep(0.18, 0.0, abs(elevation - 0.015));
    color += uHazeColor * haze * 0.42;

    float sun = max(dot(dir, normalize(uSunDirection)), 0.0);
    color += uSunColor * pow(sun, 8.0) * 0.13;
    color += uSunColor * pow(sun, 260.0) * 1.7;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function StarField({ visible }: { visible: boolean }) {
  const { geometry, material } = useMemo(() => {
    const positions: number[] = []

    for (let i = 0; i < 900; i++) {
      positions.push(
        (Math.random() - 0.5) * 150,
        12 + Math.random() * 85,
        -65 - Math.random() * 20,
      )
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    )

    const material = new THREE.PointsMaterial({
      color: '#fff5dc',
      size: 3,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })

    return { geometry, material }
  }, [])

  useFrame(({ clock }) => {
    material.opacity = visible
      ? 0.8 + Math.sin(clock.elapsedTime * 1.5) * 0.18
      : 0
  })

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={10}
    />
  )
}

export function Sky() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTop: {
            value: new THREE.Color(isDay ? '#78679f' : '#080d27'),
          },
          uMid: {
            value: new THREE.Color(isDay ? '#d995b0' : '#182343'),
          },
          uHorizon: {
            value: new THREE.Color(isDay ? '#ffd0a3' : '#354563'),
          },
          uSunDirection: {
            value: new THREE.Vector3(0.48, 0.12, -0.81).normalize(),
          },
          uSunColor: {
            value: new THREE.Color(isDay ? '#ffcf91' : '#a9c5f5'),
          },
          uHazeColor: {
            value: new THREE.Color(isDay ? '#ffad9c' : '#182747'),
          },
        },
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    [isDay],
  )

  return (
    <>
      <mesh material={material} renderOrder={-2} frustumCulled={false}>
        <sphereGeometry args={[190, 40, 26]} />
      </mesh>

      <StarField visible={!isDay} />
    </>
  )
}
