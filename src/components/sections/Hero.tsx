
import { profile } from '../../data/portfolio'
import { ButtonLink } from '../ui/Button'
import { FlowerMark, OrganicEdge } from '../ui/Ornaments'

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-[100svh] min-h-[620px] w-full flex-col overflow-hidden bg-transparent"
    >
      {/* Cinematic lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_95%_at_78%_12%,rgba(255,246,214,0.16)_0%,rgba(255,246,214,0)_42%,rgba(14,38,26,0.42)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#0d2619]/72 via-[#123022]/18 to-transparent lg:h-[36%] lg:from-[#0c2417]/40" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_52%_at_50%_70%,rgba(8,29,19,0.62),rgba(8,29,19,0.18)_45%,transparent_74%)] lg:hidden" />

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[40%] bg-gradient-to-r from-[#0b2216]/34 via-[#0b2216]/10 to-transparent lg:block" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[85rem] flex-col justify-end px-5 pb-24 sm:px-8 sm:pb-28 lg:px-16 lg:pb-32">
        <div className="mx-auto w-full max-w-[34rem] text-center sm:max-w-[38rem] lg:mx-0 lg:max-w-[46rem] lg:text-left">

          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.3em] text-cream/75 sm:text-[0.55rem] sm:tracking-[0.38em] lg:justify-start">
            <span className="hidden h-px w-8 bg-sun/70 sm:block" />
            NIE, Mysore · Class of 2030
          </p>

          <h1 className="mt-4 w-full font-display text-[clamp(2rem,10vw,6.4rem)] font-light uppercase leading-[0.92] tracking-[0.015em] text-cream [text-shadow:0_6px_50px_rgba(6,24,16,0.5)] sm:mt-5">
            <span className="block animate-fade-up">
              Aditi
            </span>

            <span
              className="block animate-fade-up italic text-[#fbe7bd]"
              style={{ animationDelay: '110ms' }}
            >
              Singh
            </span>
          </h1>

          <div
            className="mx-auto mt-6 flex max-w-[26rem] animate-fade-up flex-col items-center gap-2 sm:mt-7 sm:max-w-[32rem] sm:flex-row sm:items-start sm:gap-3 lg:mx-0 lg:max-w-lg lg:justify-start"
            style={{ animationDelay: '220ms' }}
          >
            <FlowerMark className="h-4 w-4 shrink-0 text-sun/90 sm:mt-1.5" />

            <p className="max-w-full font-display text-[clamp(0.95rem,1.55vw,1.24rem)] font-light italic leading-relaxed text-cream/88">
              “{profile.tagline}”
            </p>
          </div>

          {/* Journey entrance */}
          <div
            className="mx-auto mt-8 flex w-full max-w-[19rem] animate-fade-up flex-col items-stretch gap-3 sm:mt-9 sm:max-w-[30rem] sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:mx-0 lg:justify-start"
            style={{ animationDelay: '320ms' }}
          >
            <ButtonLink href="#about" className="w-full sm:w-auto">
              Explore my world
            </ButtonLink>

            <ButtonLink
              href="#projects"
              variant="ghost"
              className="w-full sm:w-auto"
            >
              Skip to projects
            </ButtonLink>
          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-10 hidden w-full items-end justify-between gap-6 border-t border-cream/15 pt-5 sm:flex lg:mt-12">

          <p className="max-w-[15rem] font-sans text-[0.5rem] uppercase leading-relaxed tracking-[0.3em] text-cream/45">
            {profile.title} · Building in Mysore
          </p>

          <div className="flex items-center gap-6">
            <ul className="hidden items-center gap-5 xl:flex">
              {profile.interests.map((interest) => (
                <li
                  key={interest}
                  className="font-sans text-[0.5rem] uppercase tracking-[0.26em] text-cream/45"
                >
                  {interest}
                </li>
              ))}
            </ul>

            <a
              href="#about"
              className="group flex items-center gap-3 font-sans text-[0.5rem] uppercase tracking-[0.3em] text-cream/60 transition-colors hover:text-cream"
            >
              Begin the journey

              <span className="relative block h-8 w-px overflow-hidden bg-cream/20">
                <span className="absolute inset-x-0 top-0 h-3 animate-bob bg-sun/80" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <OrganicEdge />
    </section>
  )
}
