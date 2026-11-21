import { timeline } from '../../data/portfolio'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'

export function Achievements() {
  return (
    <SectionShell id="achievements" tone="soft">
      <Reveal>
        <SectionHeading
          eyebrow="Chapter IV · Achievements"
          title="Milestones, in bloom."
          align="center"
          className="mx-auto"
          lead="A quiet record of the steps so far. More chapters will be added as they happen."
        />
      </Reveal>

      <ol className="relative mx-auto mt-16 max-w-3xl">
        <span className="absolute left-[13px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-leaf/50 via-turquoise/40 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

        {timeline.map((item, index) => (
          <li
            key={item.year + item.title}
            className={`relative mb-10 pl-12 last:mb-0 sm:w-1/2 sm:pl-0 ${
              index % 2 === 0 ? 'sm:pr-14 sm:text-right' : 'sm:ml-auto sm:pl-14'
            }`}
          >
            <span
              className={`absolute left-0 top-1 h-[26px] w-[26px] rounded-full border border-sun/60 bg-cream shadow-[0_0_0_6px_rgba(255,248,232,0.85)] sm:left-auto ${
                index % 2 === 0 ? 'sm:-right-[13px]' : 'sm:-left-[13px]'
              }`}
            >
              <span className="absolute inset-[9px] rounded-full bg-sun/80" />
            </span>

            <span className="font-sans text-[0.55rem] uppercase tracking-[0.32em] text-terracotta/80">
              {item.year}
            </span>
            <h3 className="mt-2 font-display text-[1.22rem] font-normal leading-snug text-forest-deep">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[0.9rem] text-forest/50">{item.place}</p>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-14 max-w-md text-center font-display text-base italic leading-relaxed text-forest/45">
        Workshops, projects and results will be planted here as they arrive.
      </p>
    </SectionShell>
  )
}
