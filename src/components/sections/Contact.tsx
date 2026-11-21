import { useEffect, useState, type ReactNode } from 'react'
import { contact } from '../../data/portfolio'
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
        'group inline-flex items-center gap-2.5 rounded-full border border-forest/15 bg-white/45 px-5 py-3 text-forest transition-colors duration-300 hover:border-forest/30 hover:bg-white/75',
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
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
    } catch {
      // Older or locked-down browsers: fall back to a hidden selection.
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_30%,rgba(245,205,104,0.3),transparent_65%)]" />
      <LeafSprig className="pointer-events-none absolute -left-10 bottom-0 hidden rotate-[172deg] text-leaf/20 md:block" />
      <LeafSprig className="pointer-events-none absolute -right-6 top-16 hidden rotate-[14deg] text-blush/30 md:block" />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sun/40 bg-sun/10">
            <FlowerMark className="h-6 w-6 text-terracotta" />
          </div>
          <span className="eyebrow mt-7 justify-center">Chapter V · Contact</span>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="display-title mt-5 text-[clamp(2.1rem,5vw,3.9rem)]">
            Let’s grow
            <br />
            something together.
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <BotanicalRule className="mx-auto mt-7" />
          <p className="mx-auto mt-7 max-w-lg text-[1.02rem] leading-[1.9] text-forest/70">
            I’d love to hear from you — a project idea, a question, or simply a hello. Write to
            me, or find me in the gardens over on GitHub and LinkedIn.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${contact.email}`}
              aria-label={`Email Aditi Singh at ${contact.email}`}
              className={cn('btn-bloom btn-bloom--solid w-full sm:w-auto', focusRing)}
            >
              <span>Email me</span>
              <MailIcon className="btn-bloom__arrow" />
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? 'Email address copied' : `Copy email address ${contact.email}`}
              className={cn('btn-bloom btn-bloom--outline w-full sm:w-auto', focusRing)}
            >
              <span>{copied ? 'Copied' : 'Copy email'}</span>
              {copied ? (
                <CheckIcon className="btn-bloom__arrow" />
              ) : (
                <CopyIcon className="btn-bloom__arrow" />
              )}
            </button>
          </div>

          <p className="mt-5 font-sans text-[0.68rem] tracking-[0.16em] text-forest/55">
            {contact.email}
          </p>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <SocialLink href={contact.github.url} label={contact.github.label}>
              <GitHubIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={contact.linkedin.url} label={contact.linkedin.label}>
              <LinkedInIcon className="h-4 w-4" />
            </SocialLink>
            {contact.resume.url ? (
              <SocialLink href={contact.resume.url} label={contact.resume.label}>
                <MailIcon className="h-4 w-4" />
              </SocialLink>
            ) : (
              <span
                aria-disabled="true"
                title="The résumé PDF will be added here soon"
                className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border border-dashed border-forest/20 px-5 py-3 text-forest/40"
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
              Wander back to the creek
            </ButtonLink>
            <ButtonLink href="#about" variant="outline" className="w-full sm:w-auto">
              Read my story
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-14 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-forest/15" />
            <p className="font-sans text-[0.5rem] uppercase tracking-[0.34em] text-forest/35">
              Mysore · India
            </p>
            <span className="h-px w-14 bg-forest/15" />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
