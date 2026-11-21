
import { profile } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { FlowerMark, LeafSprig } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionShell } from '../ui/SectionHeading'

const facts = [
  { label: 'Degree', value: profile.degree },
  { label: 'Branch', value: profile.branch },
  { label: 'College', value: profile.college },
  { label: 'Graduation', value: profile.graduation },
]

export function About() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'

  const colors = {
    wood: isDay
      ? 'border-[#9b704b]/50 bg-[#6c4934]/95'
      : 'border-[#a9b895]/25 bg-[#26372f]/95',
    paper: isDay
      ? 'border-[#b99a6c]/60 bg-[#f5e8ce]/95'
      : 'border-[#a9b895]/25 bg-[#35483b]/95',
    heading: isDay ? 'text-[#31523a]' : 'text-[#f0e6cf]',
    body: isDay ? 'text-[#5d7054]' : 'text-[#d2dbc9]',
    muted: isDay ? 'text-[#8a8065]' : 'text-[#aab9a2]',
    divider: isDay ? 'border-[#b99a6c]/40' : 'border-white/15',
    tag: isDay
      ? 'bg-[#dce2c9] text-[#4d6747]'
      : 'bg-[#526a52]/60 text-[#e1e7d7]',
  }

  return (
    <SectionShell
      id="about"
      tone="plain"
      className="relative min-h-screen overflow-hidden px-5 py-28 sm:px-8 md:py-36"
    >
      <LeafSprig className="pointer-events-none absolute -left-10 top-20 hidden rotate-[-25deg] text-leaf/35 lg:block" />
      <LeafSprig className="pointer-events-none absolute -right-10 bottom-16 hidden rotate-[190deg] text-leaf/35 lg:block" />

      <div className="relative mx-auto max-w-5xl">

        {/* Room introduction */}
        <Reveal className="mb-16 text-center">
          <span className={`font-sans text-[0.6rem] uppercase tracking-[0.4em] ${colors.muted}`}>
            Welcome, traveller
          </span>

          <h2 className={`mt-5 font-display text-[clamp(2.8rem,6vw,5rem)] leading-tight ${colors.heading}`}>
            A Little About Me
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-sun/70" />
            <FlowerMark className="h-5 w-5 text-sun" />
            <span className="h-px w-12 bg-sun/70" />
          </div>

          <p className={`mt-5 font-display text-lg italic ${colors.body}`}>
            Every little idea has a place to grow.
          </p>
        </Reveal>

        {/* Handwritten letter */}
        <Reveal>
          <article className={`relative mx-auto max-w-4xl rounded-sm border p-7 shadow-[0_25px_65px_rgba(25,30,20,0.22)] sm:p-12 ${colors.paper}`}>
            <div className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-3deg] border border-[#c5a77c]/60 bg-[#e9d6ad]/80 shadow-sm" />

            <FlowerMark className="absolute right-7 top-7 h-7 w-7 rotate-12 text-sun/70" />

            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sun/80" />
              <span className={`font-sans text-[0.58rem] uppercase tracking-[0.35em] ${colors.muted}`}>
                A letter from the cottage
              </span>
            </div>

            <h3 className={`mt-7 font-display text-3xl sm:text-4xl ${colors.heading}`}>
              Hello, I'm Aditi.
            </h3>

            <p className={`mt-3 font-display text-xl italic ${colors.body}`}>
              A curious mind with a builder's heart.
            </p>

            <div className={`mt-8 space-y-5 border-l-2 border-sun/70 pl-5 text-[0.98rem] leading-[1.9] ${colors.body}`}>
              {profile.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote className={`mt-9 border-t pt-7 ${colors.divider}`}>
              <p className={`font-display text-xl italic leading-relaxed ${colors.heading}`}>
                "I like the moment an idea stops being imaginary and starts working."
              </p>
            </blockquote>

            <div className="mt-8 flex flex-wrap gap-2">
              {profile.traits.map((trait) => (
                <span
                  key={trait}
                  className={`rounded-full px-4 py-2 font-sans text-[0.58rem] uppercase tracking-[0.16em] ${colors.tag}`}
                >
                  {trait}
                </span>
              ))}
            </div>

            <p className={`mt-9 text-right font-display text-lg italic ${colors.body}`}>
              — Aditi
            </p>
          </article>
        </Reveal>

        {/* Academic noticeboard */}
        <Reveal delay={100}>
          <div className={`relative mx-auto mt-14 max-w-4xl rounded-xl border-[5px] p-5 shadow-[0_20px_45px_rgba(25,30,20,0.25)] sm:p-8 ${colors.wood}`}>
            <div className={`rounded-md border p-7 sm:p-9 ${colors.paper}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className={`font-sans text-[0.58rem] uppercase tracking-[0.35em] ${colors.muted}`}>
                    Pinned to my noticeboard
                  </span>

                  <h3 className={`mt-3 font-display text-2xl sm:text-3xl ${colors.heading}`}>
                    My Academic Journey
                  </h3>
                </div>

                <FlowerMark className="h-8 w-8 text-terracotta/80" />
              </div>

              <dl className={`mt-8 grid grid-cols-1 gap-7 border-t pt-8 sm:grid-cols-2 ${colors.divider}`}>
                {facts.map((fact) => (
                  <div key={fact.label} className="relative pl-4">
                    <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-sun" />

                    <dt className={`font-sans text-[0.55rem] uppercase tracking-[0.28em] ${colors.muted}`}>
                      {fact.label}
                    </dt>

                    <dd className={`mt-2 font-display text-lg leading-snug ${colors.heading}`}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        {/* Curiosity shelf */}
        <Reveal delay={180}>
          <div className={`relative mx-auto mt-14 max-w-4xl border-b-[9px] border-[#79583c]/70 px-5 pb-5 pt-8 shadow-[0_16px_25px_rgba(25,30,20,0.12)] ${colors.paper}`}>
            <div className="absolute -top-3 left-8 right-8 h-3 rounded-full bg-[#a77b51] shadow-md" />

            <span className={`font-sans text-[0.58rem] uppercase tracking-[0.35em] ${colors.muted}`}>
              A few things on my curiosity shelf
            </span>

            <h3 className={`mt-3 font-display text-2xl ${colors.heading}`}>
              Things I love exploring
            </h3>

            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-5">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className={`flex items-center gap-2 font-display text-base ${colors.body}`}
                >
                  <FlowerMark className="h-3.5 w-3.5 shrink-0 text-sun" />
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Transition to the next room */}
        <Reveal delay={220}>
          <div className="mt-20 flex flex-col items-center text-center">
            <LeafSprig className="h-10 w-10 rotate-90 text-leaf/70" />

            <p className={`mt-5 font-display text-xl italic ${colors.body}`}>
              There's much more to discover inside...
            </p>

            <a
              href="#skills"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-sun/50 px-6 py-3 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-sun transition-all duration-300 hover:bg-sun/10"
            >
              Visit the little library
              <span aria-hidden="true">→</span>
            </a>

            <span className="mt-6 font-sans text-[0.55rem] uppercase tracking-[0.4em] text-sun">
              Welcome Room · Chapter I
            </span>
          </div>
        </Reveal>

      </div>
    </SectionShell>
  )
}
