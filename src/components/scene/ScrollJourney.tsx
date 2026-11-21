
import { useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useJourneyProgress } from './journeyProgress'

gsap.registerPlugin(ScrollTrigger)

export function ScrollJourney() {
  const { setProgress } = useJourneyProgress()

  const updateProgress = useCallback(
    (progress: number) => {
      setProgress(progress)
    },
    [setProgress],
  )

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#about',
      endTrigger: '#contact',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateProgress(self.progress)
      },
    })

    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
    }
  }, [updateProgress])

  return null
}

