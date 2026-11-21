import { useMemo } from 'react'
import * as THREE from 'three'

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
  varying vec3 vDirection;

  void main() {
    vec3 dir = normalize(vDirection);
    float elevation = clamp(dir.y, -0.25, 1.0);

    vec3 color = mix(uHorizon, uMid, smoothstep(-0.05, 0.15, elevation));
    color = mix(color, uTop, smoothstep(0.12, 0.58, elevation));

    // Warm haze gathering just above the treeline.
    color += vec3(0.2, 0.15, 0.06) * smoothstep(0.16, 0.0, abs(elevation - 0.015)) * 0.3;

    float sun = max(dot(dir, normalize(uSunDirection)), 0.0);
    color += uSunColor * pow(sun, 8.0) * 0.1;
    color += uSunColor * pow(sun, 260.0) * 1.5;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const skyUniforms = {
  uTop: new THREE.Color('#3f8fcb'),
  uMid: new THREE.Color('#8fd0ec'),
  uHorizon: new THREE.Color('#f0f6e3'),
  uSunDirection: new THREE.Vector3(0.48, 0.34, -0.81).normalize(),
  uSunColor: new THREE.Color('#ffedbf'),
}

/** A real gradient sky dome so the world has a horizon instead of a CSS backdrop. */
export function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTop: { value: skyUniforms.uTop },
          uMid: { value: skyUniforms.uMid },
          uHorizon: { value: skyUniforms.uHorizon },
          uSunDirection: { value: skyUniforms.uSunDirection },
          uSunColor: { value: skyUniforms.uSunColor },
        },
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    [],
  )

  return (
    <mesh material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[190, 40, 26]} />
    </mesh>
  )
}
