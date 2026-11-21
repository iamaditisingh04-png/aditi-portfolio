import { learningPaths } from '../../data/portfolio'
import { FlowerMark } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'

export function Skills() {
  return (
    <SectionShell id="skills" tone="soft">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionHeading
              eyebrow="Chapter II · Skills"
              title="What I’m exploring."
              lead="A garden is never finished. These are the paths I’m walking right now — each one a little further every week."
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-10 flex items-center gap-3 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-forest/40">
              <span className="h-px w-8 bg-forest/20" />
              Learning in public
            </p>
          </Reveal>
        </div>

        <ul className="border-t border-forest/12">
          {learningPaths.map((path, index) => (
            <li
              key={path.title}
              className="group relative border-b border-forest/12 py-8 transition-colors duration-500 hover:bg-leaf/[0.07] md:py-9"
            >
              <span className="absolute left-0 top-0 h-full w-px scale-y-0 bg-gradient-to-b from-leaf to-turquoise transition-transform duration-500 group-hover:scale-y-100" />
              <FlowerMark className="absolute right-3 top-9 h-4 w-4 text-sun opacity-0 transition-opacity duration-500 group-hover:opacity-90" />
              <Reveal delay={index * 70}>
                <div className="grid gap-3 px-1 transition-transform duration-500 group-hover:translate-x-2 md:grid-cols-[3.5rem_1fr] md:gap-6">
                  <span className="font-display text-lg text-terracotta/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.45rem] font-normal leading-snug text-forest-deep">
                      {path.title}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed text-forest/60">
                      {path.blurb}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-12 font-display text-base italic text-forest/50">
        Tools will be listed as the work grows — this chapter is deliberately honest.
      </p>
    </SectionShell>
  )
}
