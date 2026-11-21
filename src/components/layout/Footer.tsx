import { contact } from '../../data/portfolio'
import { FlowerMark, GitHubIcon, LinkedInIcon, MailIcon } from '../ui/Ornaments'

const iconLink =
  'flex h-9 w-9 items-center justify-center rounded-full border border-forest/15 bg-white/40 text-forest/60 transition-colors duration-300 hover:border-forest/30 hover:bg-white/80 hover:text-forest-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun'

export function Footer() {
  return (
    <footer className="relative border-t border-forest/10 bg-cream px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <div className="flex items-center gap-3">
            <FlowerMark className="h-4 w-4 text-terracotta" />
            <span className="font-display text-sm tracking-wide text-forest-deep">
              Aditi Singh
            </span>
            <span className="font-sans text-[0.55rem] uppercase tracking-[0.28em] text-forest/35">
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

        <p className="font-sans text-[0.55rem] uppercase tracking-[0.28em] text-forest/35">
          An enchanted little world · 2026
        </p>
      </div>
    </footer>
  )
}
