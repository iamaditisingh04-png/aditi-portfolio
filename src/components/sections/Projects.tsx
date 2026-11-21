
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
    body: isDay ? 'text-forest/72' : 'text-[#c2cbe0]',
    quote: isDay ? 'text-forest/60' : 'text-[#aebbd8]',
    border: isDay ? 'border-forest/15' : 'border-white/15',
    label: isDay ? 'text-forest/40' : 'text-white/45',
    heading: isDay ? 'text-forest-deep' : 'text-[#f0f2ff]',
    note: isDay ? 'text-forest/50' : 'text-[#aebbd8]',
    line: isDay ? 'bg-forest/10' : 'bg-white/15',
    link: isDay ? 'text-forest/55 hover:text-forest-deep' : 'text-[#b8c7e8] hover:text-white',
    unavailable: isDay ? 'text-forest/35' : 'text-white/35',
  }

  return (
    <SectionShell id="projects">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-24">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Chapter III · Projects"
              title="A garden still being planted."
            />
          </Reveal>

          <Reveal delay={90}>
            <p className={`mt-8 max-w-xl text-[1.02rem] leading-[1.9] ${colors.body}`}>
              The first projects are germinating — experiments in code, intelligence and play. Each
              one will be planted here with its story, its stack and what it taught me.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className={`mt-6 max-w-md font-display text-[1.15rem] font-light italic leading-relaxed ${colors.quote}`}>
              No placeholders dressed up as finished work. When a project is real, it lands here.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <ButtonLink href="#contact" variant="solid" className="mt-9 w-full sm:w-auto">
              Come back soon
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className={`border-l pl-7 lg:mt-2 ${colors.border}`}>
            <div className="flex items-center gap-3">
              <FlowerMark className="h-4 w-4 text-sun" />
              <span className={`font-sans text-[0.52rem] uppercase tracking-[0.34em] ${colors.label}`}>
                In the greenhouse
              </span>
            </div>

            <ul className="mt-7 space-y-6">
              {projects.map((project, index) => (
                <li key={project.name} className="group">
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-[0.55rem] tracking-[0.24em] text-terracotta/60">
                      0{index + 1}
                    </span>

                    <span className={`font-display text-[1.08rem] leading-snug ${colors.heading}`}>
                      {project.name}
                    </span>
                  </div>

                  <p className={`mt-1 pl-7 text-[0.86rem] leading-relaxed ${colors.note}`}>
                    {project.note}
                  </p>

                  <div className="mt-3 flex items-center gap-3 pl-7">
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
                        GitHub
                      </a>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 font-sans text-[0.48rem] uppercase tracking-[0.28em] ${colors.unavailable}`}
                        title="Add the repository URL in src/data/portfolio.ts when it is public"
                      >
                        <GitHubIcon className="h-3 w-3 opacity-60" />
                        Repo · soon
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
