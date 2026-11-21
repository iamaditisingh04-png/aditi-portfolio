import { useEffect, useRef } from 'react'

/** Gently offsets an element against the page scroll for depth. */
export function useParallax<T extends HTMLElement>(strength = 22) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0

    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      const offset = Math.max(-1, Math.min(1, progress)) * -strength
      element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [strength])

  return ref
}
