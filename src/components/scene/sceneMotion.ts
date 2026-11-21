import { createContext, useContext } from 'react'

export type SceneQuality = 'high' | 'low'

export type SceneMotion = {
  /** When false, ambient animation is paused for reduced-motion visitors. */
  animate: boolean
  quality: SceneQuality
}

export const SceneMotionContext = createContext<SceneMotion>({
  animate: true,
  quality: 'high',
})

export const useSceneMotion = () => useContext(SceneMotionContext)
