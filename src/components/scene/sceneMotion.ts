
import { createContext, useContext } from 'react'
import type { WorldTheme } from '../../ThemeContext'

export type SceneQuality = 'high' | 'low'

export type SceneMotion = {
  animate: boolean
  quality: SceneQuality
  theme: WorldTheme
  progress: number
}

export const SceneMotionContext = createContext<SceneMotion>({
  animate: true,
  quality: 'high',
  theme: 'day',
  progress: 0,
})

export const useSceneMotion = () => useContext(SceneMotionContext)
