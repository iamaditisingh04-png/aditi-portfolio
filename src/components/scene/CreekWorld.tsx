
import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import { useMediaQuery, useReducedMotion } from '../../lib/useMediaQuery'
import { useWorldTheme } from '../../ThemeContext'

import { AmbientParticles } from './AmbientParticles'
import { CameraRig } from './CameraRig'
import { Cottage } from './Cottage'
import { CreekWater } from './CreekWater'
import { Flora } from './Flora'
import { Foreground } from './Foreground'
import { Lighting } from './Lighting'
import {
  SceneMotionContext,
  useSceneMotion,
  type SceneQuality,
} from './sceneMotion'
import { useJourneyProgress } from './journeyProgress'
import { Sky } from './Sky'
import { Terrain } from './Terrain'
import { terrainHeight } from './world'

function CanvasSizeSync() {
  const gl = useThree((state) => state.gl)
  const setSize = useThree((state) => state.setSize)

  useEffect(() => {
    const parent = gl.domElement.parentElement
    if (!parent) return

    const sync = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight

      if (width > 0 && height > 0) {
        setSize(width, height)
      }
    }

    sync()

    const retry = window.setTimeout(sync, 150)
    const observer = new ResizeObserver(sync)

    observer.observe(parent)

    return () => {
      window.clearTimeout(retry)
      observer.disconnect()
    }
  }, [gl, setSize])

  return null
}

function NightBloom() {
  const { theme, quality } = useSceneMotion()
  const isSmallScreen = useMediaQuery('(max-width: 900px)')
  const isNight = theme === 'night'

  return (
    <EffectComposer
      enabled={isNight}
      multisampling={quality === 'high' && !isSmallScreen ? 4 : 0}
    >
      <Bloom
        intensity={1.25}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.22}
        mipmapBlur
        radius={0.8}
      />
    </EffectComposer>
  )
}

export function CreekWorld() {
  const reducedMotion = useReducedMotion()
  const isSmallScreen = useMediaQuery('(max-width: 900px)')
  const quality: SceneQuality = isSmallScreen ? 'low' : 'high'
  const { theme } = useWorldTheme()
  const { progress } = useJourneyProgress()

  const motion = useMemo(
    () => ({
      animate: !reducedMotion,
      quality,
      theme,
      progress,
    }),
    [reducedMotion, quality, theme, progress],
  )

  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.8] : [1, 1.4]}
      frameloop={motion.animate ? 'always' : 'demand'}
      camera={{
        position: [2.4, 3.35, 14.2],
        fov: 54,
        near: 0.1,
        far: 320,
      }}
      shadows={quality === 'high' ? 'soft' : false}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
      }}
      className="!absolute inset-0"
    >
      <SceneMotionContext.Provider value={motion}>
        <CanvasSizeSync />

        <fog
          attach="fog"
          args={[
            theme === 'day' ? '#f3c9bd' : '#18213d',
            26,
            118,
          ]}
        />

        <Sky />
        <Lighting />
        <Terrain />
        <CreekWater />
        <Flora />

        <group position={[0, terrainHeight(8, -1), 0]}>
          <Cottage isNight={theme === 'night'} />
        </group>

        <Foreground />
        <AmbientParticles />
        <CameraRig />

        <NightBloom />
      </SceneMotionContext.Provider>
    </Canvas>
  )
}
