
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { navSections, type SectionId } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { cn } from '../../lib/cn'
import { FlowerMark } from '../ui/Ornaments'

export function Navbar() {
  const [active, setActive] = useState<SectionId>('home')
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useWorldTheme()
  const isDay = theme === 'day'
  const [settled, setSettled] = useState(false)
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false })
  const listRef = useRef<HTMLUListElement>(null)

  const colors = {
    nav: isDay
      ? 'border-forest/15 bg-[#f3ead7]/90 shadow-[0_22px_60px_-30px_rgba(18,48,32,0.35)]'
      : 'border-white/10 bg-[#17251e]/90 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.8)]',
    logo: isDay ? 'text-[#26382d]' : 'text-[#f3ead7]',
    link: isDay ? 'text-forest/55 hover:text-forest-deep' : 'text-[#c2d0b8]/65 hover:text-[#f3ead7]',
    active: isDay ? 'text-forest-deep' : 'text-[#f3ead7]',
    pill: isDay ? 'bg-forest/8 ring-forest/10' : 'bg-white/10 ring-white/10',
    button: isDay
      ? 'border-forest/15 bg-white/50 text-forest hover:bg-white/80'
      : 'border-white/15 bg-white/5 text-[#f3ead7] hover:bg-white/10',
    mobile: isDay
      ? 'bg-[#f3ead7]/98'
      : 'bg-[#17251e]/98',
    mobileText: isDay ? 'text-forest-deep' : 'text-[#f3ead7]',
    mobileMuted: isDay ? 'text-forest/55' : 'text-[#c2d0b8]/60',
    mobileBorder: isDay ? 'border-forest/10' : 'border-white/10',
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .slice(0, 1)
          .forEach((entry) => setActive(entry.target.id as SectionId))
      },
      { rootMargin: '-44% 0px -46% 0px', threshold: [0, 0.15, 0.4, 0.8] },
    )

    navSections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    const onScroll = () => setSettled(window.scrollY > window.innerHeight * 0.62)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      const item = list?.querySelector<HTMLAnchorElement>(`[data-section="${active}"]`)
      if (!list || !item) return
      setPill({ left: item.offsetLeft, width: item.offsetWidth, visible: true })
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (listRef.current) observer.observe(listRef.current)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [active, settled])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id: SectionId) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <nav
          aria-label="Primary"
          className={cn(
            'pointer-events-auto flex w-full max-w-[46rem] items-center justify-between gap-2 rounded-full border p-1.5 pl-4 backdrop-blur-xl transition-all duration-700',
            colors.nav,
            settled ? 'py-1.5' : '',
          )}
        >
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              go('home')
            }}
            className="group flex shrink-0 items-center gap-2.5 py-1"
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-sun/20 transition-transform duration-700 group-hover:scale-110" />
              <FlowerMark className="relative h-4 w-4 text-[#e9b58f] transition-transform duration-700 group-hover:rotate-45" />
            </span>
            <span className={`font-display text-[0.98rem] tracking-[0.02em] ${colors.logo}`}>
              Aditi
            </span>
          </a>

          <ul ref={listRef} className="relative hidden items-center md:flex">
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-y-0 left-0 block rounded-full ring-1 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
                colors.pill,
                pill.visible ? 'opacity-100' : 'opacity-0',
              )}
              style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
            />

            {navSections.map(({ id, label }) => {
              const isActive = active === id

              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    data-section={id}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      go(id)
                    }}
                    className={cn(
                      'relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[0.64rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300',
                      isActive ? colors.active : colors.link,
                    )}
                  >
                    <span
                      className={cn(
                        'h-1 w-1 rounded-full bg-[#e9b58f] transition-all duration-300',
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                      )}
                    />
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDay ? 'night' : 'day'} mode`}
            title={isDay ? 'Switch to night' : 'Switch to day'}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 hover:scale-110 ${colors.button}`}
          >
            <span className="text-xl transition-transform duration-500 hover:rotate-45" key={theme}>
              {isDay ? '☀️' : '🌙'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="petal-menu"
            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] transition-colors md:hidden ${colors.button}`}
          >
            <FlowerMark className="h-3.5 w-3.5 text-[#e9b58f]" />
            Menu
          </button>
        </nav>
      </header>

      <div
        id="petal-menu"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-[60] transition-opacity duration-500 md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className={`absolute inset-0 backdrop-blur-2xl ${colors.mobile}`} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(216,184,216,0.16),transparent_70%)]"
        />

        <div className="relative flex h-full flex-col px-7 pb-10 pt-6">
          <div className="flex items-center justify-between">
            <span className={`font-sans text-[0.6rem] uppercase tracking-[0.32em] ${colors.mobileMuted}`}>
              Little Chapters
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full border ${colors.mobileBorder} ${colors.mobileText}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mt-8 flex flex-1 flex-col justify-center">
            {navSections.map(({ id, label }, index) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                style={{ transitionDelay: open ? `${index * 45}ms` : '0ms' }}
                className={cn(
                  `flex items-baseline gap-4 border-b py-3 text-left transition-all duration-700 ${colors.mobileBorder}`,
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                )}
              >
                <span className="font-sans text-[0.58rem] tracking-[0.24em] text-[#e9b58f]">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  className={cn(
                    'font-display text-[1.75rem] font-light leading-tight',
                    active === id ? colors.mobileText : colors.mobileMuted,
                  )}
                >
                  {label}
                </span>

                {active === id && (
                  <FlowerMark className="ml-auto h-4 w-4 text-[#d8b8d8]" />
                )}
              </button>
            ))}
          </nav>

          <p className={`mt-6 font-display text-sm italic ${colors.mobileMuted}`}>
            CHILL or CHULL sath me.
          </p>
        </div>
      </div>
    </>
  )
}
