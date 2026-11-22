
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useJourneyProgress } from './journeyProgress'

gsap.registerPlugin(ScrollTrigger)

export function ScrollJourney() {
  const { setProgress } = useJourneyProgress()

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#home',
      endTrigger: '#contact',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,

      onUpdate: (self) => {
        setProgress(self.progress)
      },

      onRefresh: (self) => {
        setProgress(self.progress)
      },
    })

    ScrollTrigger.refresh()
    setProgress(trigger.progress)

    return () => {
      trigger.kill()
    }
  }, [setProgress])

  return null
}
