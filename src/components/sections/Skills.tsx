
import { learningPaths } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { FlowerMark, LeafSprig } from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionHeading, SectionShell } from '../ui/SectionHeading'

const bookColors = [
  'from-[#a95e4d] to-[#754438]',
  'from-[#71845b] to-[#435d43]',
  'from-[#c49a58] to-[#92703e]',
  'from-[#8b718c] to-[#594b68]',
  'from-[#65828a] to-[#405b65]',
  'from-[#bd806c] to-[#87574c]',
]

export function Skills() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'

  const colors = {
    heading: isDay ? 'text-[#294b35]' : 'text-[#f0eadb]',
    body: isDay ? 'text-[#526b54]' : 'text-[#d0d9d0]',
    muted: isDay ? 'text-[#71816b]' : 'text-[#b0bea9]',
    panel: isDay
      ? 'border-[#e4d0ad]/80 bg-[#fff7e8]/85'
      : 'border-white/15 bg-[#202c35]/85',
    shelf: isDay ? 'bg-[#765139]' : 'bg-[#3c3540]',
    shelfEdge: isDay ? 'bg-[#a77a50]' : 'bg-[#66536a]',
  }

  return (
    <SectionShell
      id="skills"
      tone="plain"
      className="min-h-screen py-28 md:py-36"
    >
      {/* Decorative leaves */}
      <LeafSprig className="pointer-events-none absolute -left-10 top-20 hidden h-24 w-24 rotate-[-25deg] text-leaf/35 lg:block" />
      <LeafSprig className="pointer-events-none absolute -right-8 bottom-24 hidden h-24 w-24 rotate-[155deg] text-leaf/35 lg:block" />

      {/* Library introduction */}
      <Reveal className="mx-auto mb-16 max-w-3xl text-center">
        <span className={`font-sans text-[0.58rem] uppercase tracking-[0.4em] ${colors.muted}`}>
          Chapter II · The Library
        </span>

        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-sun/70" />
          <FlowerMark className="h-5 w-5 text-sun" />
          <span className="h-px w-10 bg-sun/70" />
        </div>

        <div className="mt-5">
          <SectionHeading
            eyebrow="A collection of things I'm learning"
            title="The Little Library"
            align="center"
            lead="Every book holds a new possibility. These are the skills I'm exploring, practising and slowly making my own."
          />
        </div>
      </Reveal>

      {/* Library notice */}
      <Reveal delay={100}>
        <div className={`mx-auto mb-12 flex max-w-3xl items-center gap-4 rounded-2xl border p-5 backdrop-blur-md sm:p-6 ${colors.panel}`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d6b77e]/20">
            <span className="text-2xl">📖</span>
          </div>

          <div>
            <p className={`font-display text-xl ${colors.heading}`}>
              A work in progress
            </p>
            <p className={`mt-1 text-sm leading-relaxed ${colors.body}`}>
              This library grows with every experiment, project and new thing I learn.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Bookshelf */}
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path, index) => (
            <Reveal key={path.title} delay={index * 80}>
              <article className="group relative h-full">
                {/* Book */}
                <div className="relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-t-xl rounded-b-md border border-[#8d704e]/30 bg-[#fff7e8]/90 shadow-[0_12px_30px_rgba(49,57,35,0.13)] backdrop-blur-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(49,57,35,0.2)]">

                  {/* Book spine */}
                  <div className={`absolute inset-y-0 left-0 w-3 bg-gradient-to-r ${bookColors[index % bookColors.length]}`} />

                  {/* Book cover details */}
                  <div className="flex flex-1 flex-col p-7 pl-9">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[0.58rem] uppercase tracking-[0.25em] text-[#8c795c]">
                        Volume {String(index + 1).padStart(2, '0')}
                      </span>

                      <FlowerMark className="h-5 w-5 text-[#d5ad62] transition-transform duration-500 group-hover:rotate-45" />
                    </div>

                    {/* Decorative book illustration */}
                    <div className="my-7 flex justify-center">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${bookColors[index % bookColors.length]} shadow-inner`}>
                        <span className="font-display text-3xl text-[#fff0d4]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl leading-snug text-[#31543b]">
                      {path.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-[1.8] text-[#66745b]">
                      {path.blurb}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[#d9c7a5]/70 pt-4">
                      <span className="font-sans text-[0.53rem] uppercase tracking-[0.22em] text-[#8a8066]">
                        Learning journal
                      </span>

                      <span className="h-2 w-2 rounded-full bg-[#91a477]" />
                    </div>
                  </div>
                </div>

                {/* Wooden shelf beneath each book */}
                <div className={`relative -mt-1 h-3 rounded-sm ${colors.shelf} shadow-[0_5px_8px_rgba(35,30,20,0.2)]`}>
                  <div className={`absolute inset-x-0 bottom-0 h-1 ${colors.shelfEdge}`} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Closing note */}
      <Reveal delay={180}>
        <div className="mt-20 flex flex-col items-center text-center">
          <FlowerMark className="h-7 w-7 text-sun" />

          <p className={`mt-5 max-w-xl font-display text-xl italic leading-relaxed ${colors.body}`}>
            "There will always be another book to open, another skill to discover."
          </p>

          <span className={`mt-5 font-sans text-[0.55rem] uppercase tracking-[0.38em] ${colors.muted}`}>
            Chapter II · Still growing
          </span>
        </div>
      </Reveal>
    </SectionShell>
  )
}
