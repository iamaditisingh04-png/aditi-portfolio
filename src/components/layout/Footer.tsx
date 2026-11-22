
import { contact } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { cn } from '../../lib/cn'
import { FlowerMark, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/Ornaments'

export function Footer() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'

  const iconLink = cn(
    'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun',
    isDay
      ? 'border-forest/15 bg-white/40 text-forest/60 hover:border-forest/30 hover:bg-white/80 hover:text-forest-deep'
      : 'border-white/15 bg-white/5 text-[#c2d0b8]/65 hover:border-[#d8b8d8]/40 hover:bg-white/10 hover:text-[#f3ead7]',
  )

  return (
    <footer
      className={cn(
        'relative border-t px-6 py-9 transition-colors duration-500',
        isDay
          ? 'border-forest/10 bg-[#e9eadc]'
          : 'border-white/10 bg-[#17251e]',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <FlowerMark className="h-4 w-4 text-[#e9b58f]" />

            <span
              className={cn(
                'font-display text-sm tracking-wide',
                isDay ? 'text-[#26382d]' : 'text-[#f3ead7]',
              )}
            >
              Aditi Singh
            </span>

            <span
              className={cn(
                'font-sans text-[0.55rem] uppercase tracking-[0.28em]',
                isDay ? 'text-forest/45' : 'text-[#c2d0b8]/50',
              )}
            >
              Computer Science Student
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={contact.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
              title="GitHub"
              className={iconLink}
            >
              <GitHubIcon className="h-3.5 w-3.5" />
            </a>

            <a
              href={contact.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              title="LinkedIn"
              className={iconLink}
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
            </a>

            <a
              href={`mailto:${contact.email}`}
              aria-label={`Email Aditi Singh at ${contact.email}`}
              title="Email"
              className={iconLink}
            >
              <MailIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <p
            className={cn(
              'font-display text-sm italic',
              isDay ? 'text-forest/65' : 'text-[#c2b8d5]',
            )}
          >
            CHILL or CHULL sath me.
          </p>

          <p
            className={cn(
              'font-sans text-[0.52rem] uppercase tracking-[0.28em]',
              isDay ? 'text-forest/40' : 'text-[#c2d0b8]/40',
            )}
          >
            An enchanted little world · 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
