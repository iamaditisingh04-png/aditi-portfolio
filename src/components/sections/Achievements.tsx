
import { timeline } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { FlowerMark } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'

export function Achievements() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'

  const colors = {
    line: isDay
      ? 'from-[#9aaf78]/70 via-[#c5a4c9]/50 to-transparent'
      : 'from-[#9aaf78]/70 via-[#c5a4c9]/40 to-transparent',
    marker: isDay
      ? 'border-[#c69b65] bg-[#f3ead7] shadow-[0_0_0_6px_rgba(243,234,215,0.75)]'
      : 'border-[#d8b8d8]/70 bg-[#26382d] shadow-[0_0_0_6px_rgba(23,37,30,0.8)]',
    heading: isDay ? 'text-[#26382d]' : 'text-[#f3ead7]',
    body: isDay ? 'text-[#435744]/75' : 'text-[#c2d0b8]',
    label: isDay ? 'text-[#a66e50]' : 'text-[#e9b58f]',
    closing: isDay ? 'text-[#435744]/65' : 'text-[#c2b8d5]',
  }

  return (
    <SectionShell id="achievements" tone="plain">
      <Reveal>
        <SectionHeading
          eyebrow="Chapter IV · Little Wins"
          title="A collection of little victories."
          align="center"
          className="mx-auto"
          lead="Not every milestone needs a grand celebration. Sometimes just getting there is enough."
        />
      </Reveal>

      <Reveal delay={80}>
        <p className={`mx-auto mt-7 max-w-xl text-center text-sm leading-[1.9] ${colors.body}`}>
          A few milestones from the journey so far. The list is still growing,
          and honestly, that's the fun part.
        </p>
      </Reveal>

      <ol className="relative mx-auto mt-16 max-w-3xl">
        <span
          className={`absolute left-[13px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b ${colors.line} sm:left-1/2 sm:-translate-x-1/2`}
        />

        {timeline.map((item, index) => (
          <li
            key={item.year + item.title}
            className={`relative mb-12 pl-12 last:mb-0 sm:w-1/2 sm:pl-0 ${
              index % 2 === 0
                ? 'sm:pr-14 sm:text-right'
                : 'sm:ml-auto sm:pl-14'
            }`}
          >
            <span
              className={`absolute left-0 top-1 h-[26px] w-[26px] rounded-full border ${colors.marker} sm:left-auto ${
                index % 2 === 0 ? 'sm:-right-[13px]' : 'sm:-left-[13px]'
              }`}
            >
              <span className="absolute inset-[9px] rounded-full bg-[#e9b58f]" />
            </span>

            <span className={`font-sans text-[0.58rem] uppercase tracking-[0.32em] ${colors.label}`}>
              {item.year}
            </span>

            <h3 className={`mt-2 font-display text-[1.22rem] font-normal leading-snug ${colors.heading}`}>
              {item.title}
            </h3>

            <p className={`mt-2 text-[0.9rem] ${colors.body}`}>
              {item.place}
            </p>
          </li>
        ))}
      </ol>

      <Reveal delay={180}>
        <div className="mx-auto mt-16 flex max-w-lg flex-col items-center text-center">
          <FlowerMark className="h-6 w-6 text-sun" />

          <p className={`mt-5 font-display text-lg italic leading-relaxed ${colors.closing}`}>
            Tiny wins. Dramatic celebrations. Every little milestone counts.
          </p>

          <p className={`mt-3 text-xs leading-relaxed ${colors.body}`}>
            Even the ones that involved 47 failed attempts and one extremely suspicious fix.
          </p>

          <span className={`mt-5 font-sans text-[0.52rem] uppercase tracking-[0.35em] ${colors.label}`}>
            To be continued...
          </span>
        </div>
      </Reveal>
    </SectionShell>
  )
}
