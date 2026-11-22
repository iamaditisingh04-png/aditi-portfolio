
import { Mascot } from 'page-mascot'
import { profile } from '../../data/portfolio'
import { ButtonLink } from '../ui/Button'
import { FlowerMark } from '../ui/Ornaments'

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[760px] w-full flex-col overflow-hidden bg-transparent lg:min-h-[100svh]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_95%_at_78%_12%,rgba(255,246,214,0.16)_0%,rgba(255,246,214,0)_42%,rgba(14,38,26,0.42)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#0d2619]/72 via-[#123022]/18 to-transparent lg:h-[36%] lg:from-[#0c2417]/40" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_52%_at_50%_70%,rgba(8,29,19,0.62),rgba(8,29,19,0.18)_45%,transparent_74%)] lg:hidden" />

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[40%] bg-gradient-to-r from-[#0b2216]/34 via-[#0b2216]/10 to-transparent lg:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[85rem] flex-1 items-center px-5 pb-24 pt-28 sm:px-8 sm:pb-28 lg:px-16 lg:py-32">
        <div className="w-full">
          <div className="mx-auto w-full max-w-[38rem] text-center lg:mx-0 lg:text-left">

            {/* Motto */}
            <div className="mb-7 animate-fade-up">
              <p className="font-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-medium italic leading-tight tracking-wide text-[#E9B58F] [text-shadow:0_3px_25px_rgba(0,0,0,0.4)]">
                CHILL or CHULL sath me.
              </p>

              <div className="mt-3 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-8 bg-[#D8B8D8]/70" />
                <span className="font-sans text-[0.55rem] uppercase tracking-[0.32em] text-[#E8DCC4]">
                  A little motto to live by
                </span>
                <span className="h-px w-8 bg-[#D8B8D8]/70" />
              </div>
            </div>

            {/* College */}
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.3em] text-[#E8DCC4]/85 sm:text-[0.55rem] sm:tracking-[0.38em] lg:justify-start">
              <span className="hidden h-px w-8 bg-sun/70 sm:block" />
              NIE, Mysore · Class of 2030
            </p>

            {/* Name and animated deer */}
            <div className="mt-4 flex items-start justify-center gap-1 sm:mt-5 lg:justify-start lg:gap-3">
              <h1 className="shrink-0 font-display text-[clamp(2.5rem,10vw,6.4rem)] font-light uppercase leading-[0.92] tracking-[0.015em] text-[#FFF8E8] [text-shadow:0_6px_50px_rgba(6,24,16,0.5)]">
                <span className="block animate-fade-up">Aditi</span>
                <span
                  className="block animate-fade-up italic text-[#F3DFC0]"
                  style={{ animationDelay: '110ms' }}
                >
                  Singh
                </span>
              </h1>

              {/* Interactive deer mascot */}
              <div className="relative -ml-4 -mt-4 aspect-square w-[84px] shrink-0 animate-fade-up sm:-ml-5 sm:-mt-5 sm:w-[105px] lg:-ml-8 lg:-mt-6 lg:w-[145px]">
                <Mascot
                  directions="/mascots/deer-directions.webp"
                  reactions="/mascots/deer-reactions.webp"
                  size={145}
                  label="Little deer mascot"
                  className="absolute left-0 top-0 origin-top-left scale-[0.58] sm:scale-[0.72] lg:scale-100"
                />
              </div>
            </div>

            {/* Description */}
            <div
              className="mx-auto mt-7 flex max-w-[29rem] animate-fade-up flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-3 lg:mx-0 lg:max-w-lg lg:justify-start"
              style={{ animationDelay: '220ms' }}
            >
              <FlowerMark className="h-4 w-4 shrink-0 text-[#E9B58F] sm:mt-1.5" />
              <p className="font-sans text-sm leading-relaxed text-[#E8DCC4] sm:text-base">
                {profile.title}
              </p>
            </div>

            {/* Buffering message */}
            <p
              className="mt-4 animate-fade-up font-display text-sm italic tracking-wide text-[#D8B8D8] sm:text-base"
              style={{ animationDelay: '280ms' }}
            >
              Currently buffering... please wait.
            </p>

            {/* Buttons */}
            <div
              className="mx-auto mt-8 flex w-full max-w-[19rem] animate-fade-up flex-col items-stretch gap-3 sm:mt-9 sm:max-w-[30rem] sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:mx-0 lg:justify-start"
              style={{ animationDelay: '360ms' }}
            >
              <ButtonLink href="#about" className="w-full sm:w-auto">
                Explore my world
              </ButtonLink>

              <ButtonLink href="#projects" variant="ghost" className="w-full sm:w-auto">
                Skip to projects
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom information */}
      <div className="relative z-10 mx-auto mt-auto hidden w-full max-w-[85rem] items-end justify-between gap-6 px-5 pb-8 sm:flex sm:px-8 lg:px-16">
        <p className="max-w-[15rem] font-sans text-[0.5rem] uppercase leading-relaxed tracking-[0.3em] text-[#E8DCC4]/65">
          {profile.branch} · Building in Mysore
        </p>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-5 xl:flex">
            {profile.interests.map((interest) => (
              <li
                key={interest}
                className="font-sans text-[0.5rem] uppercase tracking-[0.26em] text-[#E8DCC4]/75"
              >
                {interest}
              </li>
            ))}
          </ul>

          <a
            href="#about"
            className="group flex items-center gap-3 font-sans text-[0.5rem] uppercase tracking-[0.3em] text-[#E8DCC4]/85 transition-colors hover:text-[#FFF8E8]"
          >
            Begin the journey
            <span className="relative block h-8 w-px overflow-hidden bg-[#E8DCC4]/30">
              <span className="absolute inset-x-0 top-0 h-3 animate-bob bg-[#E9B58F]" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
