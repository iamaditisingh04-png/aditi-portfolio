
import { createContext, useContext } from 'react'

export const JourneyProgressContext = createContext({
  progress: 0,
  setProgress: (_progress: number) => {},
})

export function useJourneyProgress() {
  return useContext(JourneyProgressContext)
}
