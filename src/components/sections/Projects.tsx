import { projects } from '../../data/portfolio'
import { ButtonLink } from '../ui/Button'
import { FlowerMark, GitHubIcon } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'

export function Projects() {
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
            <p className="mt-8 max-w-xl text-[1.02rem] leading-[1.9] text-forest/72">
              The first projects are germinating — experiments in code, intelligence and play. Each
              one will be planted here with its story, its stack and what it taught me.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-md font-display text-[1.15rem] font-light italic leading-relaxed text-forest/60">
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
          <div className="border-l border-forest/15 pl-7 lg:mt-2">
            <div className="flex items-center gap-3">
              <FlowerMark className="h-4 w-4 text-sun" />
              <span className="font-sans text-[0.52rem] uppercase tracking-[0.34em] text-forest/40">
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
                    <span className="font-display text-[1.08rem] leading-snug text-forest-deep">
                      {project.name}
                    </span>
                  </div>
                  <p className="mt-1 pl-7 text-[0.86rem] leading-relaxed text-forest/50">
                    {project.note}
                  </p>
                  <div className="mt-3 flex items-center gap-3 pl-7">
                    <span className="h-px flex-1 bg-forest/10" />
                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} repository on GitHub (opens in a new tab)`}
                        className="inline-flex items-center gap-1.5 font-sans text-[0.48rem] uppercase tracking-[0.28em] text-forest/55 transition-colors duration-300 hover:text-forest-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sun"
                      >
                        <GitHubIcon className="h-3 w-3" />
                        GitHub
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 font-sans text-[0.48rem] uppercase tracking-[0.28em] text-forest/35"
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
