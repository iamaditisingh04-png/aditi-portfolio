
import { useEffect, useState, type ReactNode } from 'react'
import { contact } from '../../data/portfolio'
import { useWorldTheme } from '../../ThemeContext'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ui/Button'
import {
  BotanicalRule,
  CheckIcon,
  CopyIcon,
  ExternalIcon,
  FlowerMark,
  GitHubIcon,
  LeafSprig,
  LinkedInIcon,
  MailIcon,
} from '../ui/Ornaments'
import { Reveal } from '../ui/Reveal'
import { SectionShell } from '../ui/SectionHeading'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sun'

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} profile (opens in a new tab)`}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[#26382d]/70 px-5 py-3 text-[#F3DFC0] transition-colors duration-300 hover:border-[#d8b8d8]/50 hover:bg-[#26382d] hover:text-[#FFF8E8]',
        focusRing,
      )}
    >
      {children}
      <span className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.24em]">
        {label}
      </span>
      <ExternalIcon className="h-2.5 w-2.5 opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
    </a>
  )
}

export function Contact() {
  const { theme } = useWorldTheme()
  const isDay = theme === 'day'
  const [copied, setCopied] = useState(false)

  const colors = {
    heading: 'text-[#FFF8E8]',
    body: 'text-[#E8DCC4]',
    label: 'text-[#E9B58F]',
    muted: 'text-[#D0C5AC]',
    line: 'bg-white/20',
    icon: 'text-[#E9B58F]',
    decoration: isDay ? 'text-[#E8DCC4]/20' : 'text-[#c2d0b8]/15',
    glow: isDay
      ? 'bg-[radial-gradient(60%_70%_at_50%_30%,rgba(233,181,143,0.25),transparent_65%)]'
      : 'bg-[radial-gradient(60%_70%_at_50%_30%,rgba(216,184,216,0.12),transparent_65%)]',
    email: 'text-[#E8DCC4]',
  }

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
    } catch {
      const field = document.createElement('textarea')
      field.value = contact.email
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      document.body.removeChild(field)
    }
    setCopied(true)
  }

  return (
    <SectionShell id="contact" className="pb-24 pt-24 md:pt-32">
      <div className={cn('pointer-events-none absolute inset-0', colors.glow)} />

      <LeafSprig
        className={cn(
          'pointer-events-none absolute -left-10 bottom-0 hidden rotate-[172deg] md:block',
          colors.decoration,
        )}
      />
      <LeafSprig
        className={cn(
          'pointer-events-none absolute -right-6 top-16 hidden rotate-[14deg] md:block',
          colors.decoration,
        )}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sun/40 bg-sun/10">
            <FlowerMark className={`h-6 w-6 ${colors.icon}`} />
          </div>

          <span className={`mt-7 block font-sans text-[0.55rem] uppercase tracking-[0.34em] ${colors.label}`}>
            Chapter V · The Little Mailbox
          </span>
        </Reveal>

        <Reveal delay={90}>
          <h2 className={`mt-5 font-display text-[clamp(2.1rem,5vw,3.9rem)] leading-tight ${colors.heading}`}>
            Got an idea?
            <br />
            Let's make a little chaos.
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <BotanicalRule className="mx-auto mt-7" />

          <p className={`mx-auto mt-7 max-w-lg text-[1.02rem] leading-[1.9] ${colors.body}`}>
            Have something interesting in mind? Want to build something
            weird, cool, or preferably both? Maybe you just want to say hi.
            My inbox is open. I promise I'm friendlier than my debugging sessions.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${contact.email}`}
              aria-label={`Email Aditi Singh at ${contact.email}`}
              className={cn('btn-bloom btn-bloom--solid w-full sm:w-auto', focusRing)}
            >
              <span>Send me a little letter</span>
              <MailIcon className="btn-bloom__arrow" />
            </a>

            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? 'Email address copied' : `Copy email address ${contact.email}`}
              className={cn('btn-bloom btn-bloom--outline w-full sm:w-auto', focusRing)}
            >
              <span>{copied ? 'Copied!' : 'Steal my email'}</span>
              {copied ? (
                <CheckIcon className="btn-bloom__arrow" />
              ) : (
                <CopyIcon className="btn-bloom__arrow" />
              )}
            </button>
          </div>

          <p className={`mt-5 font-sans text-[0.68rem] tracking-[0.16em] ${colors.email}`}>
            {contact.email}
          </p>

          <span role="status" aria-live="polite" className="sr-only">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </Reveal>

        <Reveal delay={250}>
          <p className={`mb-5 mt-10 font-sans text-[0.52rem] uppercase tracking-[0.32em] ${colors.label}`}>
            Find me elsewhere on the internet
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SocialLink
              href={contact.github.url}
              label={contact.github.label}
            >
              <GitHubIcon className="h-4 w-4" />
            </SocialLink>

            <SocialLink
              href={contact.linkedin.url}
              label={contact.linkedin.label}
            >
              <LinkedInIcon className="h-4 w-4" />
            </SocialLink>

            {contact.resume.url ? (
              <SocialLink
                href={contact.resume.url}
                label={contact.resume.label}
              >
                <MailIcon className="h-4 w-4" />
              </SocialLink>
            ) : (
              <span
                aria-disabled="true"
                title="The résumé PDF will be added here soon"
                className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border border-dashed border-white/25 px-5 py-3 text-white/60"
              >
                <MailIcon className="h-4 w-4" />
                <span className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.24em]">
                  Résumé · soon
                </span>
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={310}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <ButtonLink href="#home" variant="outline" className="w-full sm:w-auto">
              Back to the beginning
            </ButtonLink>

            <ButtonLink href="#about" variant="outline" className="w-full sm:w-auto">
              Meet the human
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-14 flex items-center justify-center gap-4">
            <span className={`h-px w-14 ${colors.line}`} />
            <p className={`font-sans text-[0.5rem] uppercase tracking-[0.34em] ${colors.muted}`}>
              Mysore · India · Somewhere in the clouds
            </p>
            <span className={`h-px w-14 ${colors.line}`} />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
