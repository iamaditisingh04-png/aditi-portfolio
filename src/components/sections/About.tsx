import { profile } from '../../data/portfolio'
import { FlowerMark, LeafSprig } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'
import { PortraitFrame } from './PortraitFrame'

const facts = [
  { label: 'Degree', value: profile.degree },
  { label: 'Branch', value: profile.branch },
  { label: 'College', value: profile.college },
  { label: 'Graduation', value: profile.graduation },
]

export function About() {
  return (
    <SectionShell id="about" className="pt-24 md:pt-32">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-2 select-none font-display text-[11rem] leading-none text-forest/[0.05] md:right-8 md:text-[15rem]"
      >
        I
      </span>
      <LeafSprig className="pointer-events-none absolute -left-12 top-24 hidden text-leaf/25 lg:block" />
      <LeafSprig className="pointer-events-none absolute -right-10 bottom-4 hidden rotate-[195deg] text-turquoise/20 lg:block" />

      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-24">
        <Reveal className="relative">
          <PortraitFrame />
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Chapter I · About"
              title="A curious mind with a builder’s heart."
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 space-y-5 text-[1.02rem] leading-[1.9] text-forest/75">
              {profile.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <blockquote className="mt-9 border-l border-sun/70 pl-5">
              <p className="font-display text-[1.15rem] font-light italic leading-relaxed text-forest/80">
                “I like the moment an idea stops being imaginary and starts working.”
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={200}>
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-forest/12 pt-8">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-sans text-[0.52rem] uppercase tracking-[0.32em] text-forest/40">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-display text-[1.05rem] leading-snug text-forest-deep">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2">
              {profile.traits.map((trait, index) => (
                <span key={trait} className="flex items-center gap-4">
                  {index > 0 && <span className="h-1 w-1 rounded-full bg-terracotta/50" />}
                  <span className="font-sans text-[0.6rem] uppercase tracking-[0.26em] text-forest/60">
                    {trait}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-forest/10 pt-6">
              <span className="font-sans text-[0.5rem] uppercase tracking-[0.3em] text-forest/35">
                Often found with
              </span>
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-2 font-display text-[0.95rem] text-forest/65"
                >
                  <FlowerMark className="h-2.5 w-2.5 text-sun/80" />
                  {interest}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  )
}
