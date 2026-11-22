
import { projects } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { ButtonLink } from '../ui/Button'
import { FlowerMark, GitHubIcon } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'

export function Projects() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'

  const colors = {
    body: isDay ? 'text-forest/75' : 'text-[#d0d9d0]',
    quote: isDay ? 'text-forest/65' : 'text-[#c2b8d5]',
    border: isDay ? 'border-forest/15' : 'border-white/15',
    label: isDay ? 'text-forest/45' : 'text-white/50',
    heading: isDay ? 'text-forest-deep' : 'text-[#f0eadb]',
    note: isDay ? 'text-forest/60' : 'text-[#b0bea9]',
    line: isDay ? 'bg-forest/10' : 'bg-white/15',
    link: isDay
      ? 'text-forest/65 hover:text-forest-deep'
      : 'text-[#d8b8d8] hover:text-white',
    unavailable: isDay ? 'text-forest/40' : 'text-white/40',
    card: isDay
      ? 'border-[#b99a6c]/50 bg-[#f5e8ce]/75'
      : 'border-white/15 bg-[#26382d]/80',
  }

  return (
    <SectionShell id="projects">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-24">

        {/* Introduction */}
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Chapter III · The Workshop"
              title="Things I made instead of just thinking about them."
            />
          </Reveal>

          <Reveal delay={90}>
            <p className={`mt-8 max-w-xl text-[1.02rem] leading-[1.9] ${colors.body}`}>
              Random ideas have a habit of turning into folders, code,
              bugs and eventually actual projects. Some worked, some
              taught me lessons, and some made me question my life
              choices. All of them have a story.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className={`mt-6 max-w-md font-display text-[1.15rem] font-light italic leading-relaxed ${colors.quote}`}>
              Every project starts with a "what if?" and an unreasonable
              amount of enthusiasm.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <ButtonLink href="#contact" variant="solid" className="mt-9 w-full sm:w-auto">
              Have an idea? Let's talk
            </ButtonLink>
          </Reveal>
        </div>

        {/* Project workshop board */}
        <Reveal delay={120}>
          <div className={`rounded-xl border p-6 backdrop-blur-md sm:p-8 ${colors.card}`}>
            <div className="flex items-center gap-3">
              <FlowerMark className="h-4 w-4 text-sun" />
              <span className={`font-sans text-[0.52rem] uppercase tracking-[0.34em] ${colors.label}`}>
                Pinned to the workshop board
              </span>
            </div>

            <h3 className={`mt-5 font-display text-2xl ${colors.heading}`}>
              The Things I've Built
            </h3>

            <ul className="mt-7 space-y-7">
              {projects.map((project, index) => (
                <li key={project.name} className="group">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 font-sans text-[0.6rem] tracking-[0.2em] text-terracotta/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4 className={`font-display text-xl leading-snug ${colors.heading}`}>
                        {project.name}
                      </h4>

                      <p className={`mt-2 text-sm leading-[1.8] ${colors.note}`}>
                        {project.note}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <span className={`h-px flex-1 ${colors.line}`} />

                        {project.repo ? (
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} repository on GitHub (opens in a new tab)`}
                            className={`inline-flex items-center gap-1.5 font-sans text-[0.48rem] uppercase tracking-[0.28em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sun ${colors.link}`}
                          >
                            <GitHubIcon className="h-3 w-3" />
                            Explore repository
                          </a>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 font-sans text-[0.48rem] uppercase tracking-[0.28em] ${colors.unavailable}`}
                          >
                            <GitHubIcon className="h-3 w-3 opacity-60" />
                            Repository coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Workshop closing note */}
      <Reveal delay={200}>
        <div className="mx-auto mt-20 flex max-w-2xl flex-col items-center text-center">
          <FlowerMark className="h-7 w-7 text-sun" />

          <p className={`mt-5 font-display text-xl italic leading-relaxed ${colors.body}`}>
            "If it works, don't ask too many questions."
          </p>

          <span className={`mt-5 font-sans text-[0.55rem] uppercase tracking-[0.38em] ${colors.label}`}>
            Chapter III · Workshop wisdom
          </span>
        </div>
      </Reveal>
    </SectionShell>
  )
}
