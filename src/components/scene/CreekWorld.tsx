import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMediaQuery, useReducedMotion } from '../../lib/useMediaQuery'
import { AmbientParticles } from './AmbientParticles'
import { CameraRig } from './CameraRig'
import { CreekStones, CreekWater } from './CreekWater'
import { DistantHills } from './DistantHills'
import { Fauna } from './Fauna'
import { Flora } from './Flora'
import { Forest } from './Forest'
import { Foreground } from './Foreground'
import { Lighting } from './Lighting'
import { Pathway } from './Pathway'
import { Rocks } from './Rocks'
import { SceneMotionContext, type SceneQuality } from './sceneMotion'
import { Sky } from './Sky'
import { Terrain } from './Terrain'
import { Trees } from './Trees'
import { Waterfalls } from './Waterfall'

/** Keeps the renderer matched to its container even when the first measure is missed. */
function CanvasSizeSync() {
  const gl = useThree((state) => state.gl)
  const setSize = useThree((state) => state.setSize)

  useEffect(() => {
    const parent = gl.domElement.parentElement
    if (!parent) return

    const sync = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      if (width > 0 && height > 0) setSize(width, height)
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

/** The enchanted creek: sky, terrain, water, flora and atmosphere in layered depth. */
export function CreekWorld() {
  const reducedMotion = useReducedMotion()
  const isSmallScreen = useMediaQuery('(max-width: 900px)')
  const quality: SceneQuality = isSmallScreen ? 'low' : 'high'

  const motion = useMemo(() => ({ animate: !reducedMotion, quality }), [reducedMotion, quality])

  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.8] : [1, 1.4]}
      frameloop={motion.animate ? 'always' : 'demand'}
      camera={{ position: [2.4, 3.35, 14.2], fov: 54, near: 0.1, far: 320 }}
      shadows={quality === 'high' ? 'soft' : false}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
      }}
      className="!absolute inset-0"
    >
      <SceneMotionContext.Provider value={motion}>
        <CanvasSizeSync />
        <fog attach="fog" args={['#e7eedb', 26, 118]} />
        <Sky />
        <DistantHills />
        <Lighting />
        <Forest />
        <Terrain />
        <Pathway />
        <CreekStones />
        <CreekWater />
        <Waterfalls />
        <Rocks />
        <Trees />
        <Flora />
        <Fauna />
        <Foreground />
        <AmbientParticles />
        <CameraRig />
      </SceneMotionContext.Provider>
    </Canvas>
  )
}
