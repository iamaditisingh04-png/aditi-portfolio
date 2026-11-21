import * as THREE from 'three'

/**
 * Shared foliage shading. Real leaves never read as one smooth plastic surface:
 * light scatters through them, small clusters catch light unevenly, and the edges
 * pick up a cool sky rim. These three effects are injected into the standard
 * material so shadows, fog and tone mapping keep working as before.
 */
const NOISE_GLSL = /* glsl */ `
  float foliageHash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  }

  float foliageNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(foliageHash(i), foliageHash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(foliageHash(i + vec3(0.0, 1.0, 0.0)), foliageHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(foliageHash(i + vec3(0.0, 0.0, 1.0)), foliageHash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(foliageHash(i + vec3(0.0, 1.0, 1.0)), foliageHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }
`

export type FoliageOptions = {
  /** Sway the crown in the wind (sapling trees). */
  wind?: number
  /** Strength of the leaf-scale light breakup. */
  breakup?: number
  /** Warm backlight scattering through the leaves. */
  translucency?: number
  /** Cool rim along the silhouette. */
  rim?: number
}

export type FoliageMaterial = {
  material: THREE.MeshStandardMaterial
  uniforms: {
    uTime: { value: number }
    uSunDirection: { value: THREE.Vector3 }
    uWarm: { value: THREE.Color }
    uCool: { value: THREE.Color }
  }
}

export function createFoliageMaterial(options: FoliageOptions = {}): FoliageMaterial {
  const { wind = 0, breakup = 0.2, translucency = 0.5, rim = 0.22 } = options

  const uniforms = {
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(19, 13.5, 7).normalize() },
    uWarm: { value: new THREE.Color('#ffd9a0') },
    uCool: { value: new THREE.Color('#b6e3dc') },
  }

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  })

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime
    shader.uniforms.uSunDirection = uniforms.uSunDirection
    shader.uniforms.uWarm = uniforms.uWarm
    shader.uniforms.uCool = uniforms.uCool
    shader.uniforms.uBreakup = { value: breakup }
    shader.uniforms.uTranslucency = { value: translucency }
    shader.uniforms.uRim = { value: rim }

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         varying vec3 vFoliageWorld;
         varying vec3 vFoliageNormal;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         ${
           wind > 0
             ? `float crownLift = max(transformed.y - 1.2, 0.0);
                float swayA = sin(uTime * 0.5 + transformed.y * 0.45 + transformed.x * 0.22);
                float swayB = sin(uTime * 0.83 + transformed.z * 0.5 + 1.7);
                transformed.x += (swayA * 0.016 + swayB * 0.008) * crownLift * ${wind.toFixed(2)};
                transformed.z += swayB * 0.011 * crownLift * ${wind.toFixed(2)};`
             : ''
         }
         vec4 foliageWorld = modelMatrix * vec4(transformed, 1.0);
         vFoliageWorld = foliageWorld.xyz;
         vFoliageNormal = normalize(mat3(modelMatrix) * objectNormal);`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform vec3 uSunDirection;
         uniform vec3 uWarm;
         uniform vec3 uCool;
         uniform float uBreakup;
         uniform float uTranslucency;
         uniform float uRim;
         varying vec3 vFoliageWorld;
         varying vec3 vFoliageNormal;
         ${NOISE_GLSL}`,
      )
      // Break the surface into leaf-sized light pools instead of one smooth skin.
      .replace(
        '#include <normal_fragment_begin>',
        `#include <normal_fragment_begin>
         {
           vec3 p = vFoliageWorld * 2.6;
           vec3 leafBump = vec3(
             sin(p.y * 2.1 + p.z * 1.3),
             sin(p.z * 1.7 + p.x * 2.3),
             sin(p.x * 1.9 + p.y * 1.1)
           );
           vec3 bumpView = (viewMatrix * vec4(leafBump, 0.0)).xyz;
           normal = normalize(normal + bumpView * uBreakup);
         }`,
      )
      // Mottled leaf colour, warmer where the light grazes the canopy.
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
         {
           float coarse = foliageNoise(vFoliageWorld * 1.45);
           float fine = foliageNoise(vFoliageWorld * 5.2 + 13.0);
           diffuseColor.rgb *= 0.88 + coarse * 0.14 + fine * 0.1;
           diffuseColor.rgb = mix(
             diffuseColor.rgb,
             diffuseColor.rgb * vec3(1.14, 1.05, 0.8),
             fine * 0.55
           );
         }`,
      )
      // Backlit glow through the leaves plus a cool atmospheric edge.
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
         {
           vec3 viewDirection = normalize(cameraPosition - vFoliageWorld);
           vec3 leafNormal = normalize(vFoliageNormal);
           float back = pow(clamp(dot(-leafNormal, uSunDirection), 0.0, 1.0), 1.5);
           float dapple = 0.55 + 0.45 * sin(vFoliageWorld.x * 0.42 + vFoliageWorld.y * 0.7 + vFoliageWorld.z * 0.35);
           float edge = pow(1.0 - clamp(dot(leafNormal, viewDirection), 0.0, 1.0), 2.4);
           outgoingLight += diffuseColor.rgb * uWarm * back * uTranslucency;
           outgoingLight += diffuseColor.rgb * uCool * edge * uRim * dapple;
         }`,
      )
  }

  material.customProgramCacheKey = () =>
    `foliage-${wind}-${breakup}-${translucency}-${rim}`

  return { material, uniforms }
}
