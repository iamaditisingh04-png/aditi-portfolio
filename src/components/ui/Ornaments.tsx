import { cn } from '../../lib/cn'

type MarkProps = { className?: string }

/** A six-petal blossom used as the site's small signature mark. */
export function FlowerMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('h-5 w-5', className)}>
      <g fill="currentColor" opacity="0.92">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse key={angle} cx="16" cy="9" rx="3.4" ry="6" transform={`rotate(${angle} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="3.2" fill="#F5CD68" />
    </svg>
  )
}

/** A thin botanical rule that separates chapters. */
export function BotanicalRule({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 260 24" aria-hidden="true" className={cn('h-6 w-56 text-forest/35', className)}>
      <path d="M2 12h74" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M184 12h74" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path
        d="M130 19c-6.5 0-8.5-5.5-8.5-7 0-4.6 4.4-8 8.5-10.4 4.1 2.4 8.5 5.8 8.5 10.4 0 1.5-2 7-8.5 7Z"
        fill="currentColor"
        opacity="0.75"
      />
      <circle cx="110" cy="12" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="150" cy="12" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

/** Hand-drawn-style leaf sprig for section corners. */
export function LeafSprig({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 120 160" aria-hidden="true" className={cn('h-40 w-28', className)}>
      <path
        d="M60 158C58 120 52 74 34 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      {[
        'M57 132c-14 2-22-4-26-14 15-2 23 3 26 14Z',
        'M54 112c14 1 21-5 24-15-14-1-21 5-24 15Z',
        'M51 90c-13 1-19-5-22-14 13-1 19 5 22 14Z',
        'M47 68c12 0 18-6 20-14-12-1-18 5-20 14Z',
      ].map((leaf) => (
        <path key={leaf} d={leaf} fill="currentColor" opacity="0.35" />
      ))}
      <circle cx="62" cy="48" r="7" fill="#F5CD68" opacity="0.6" />
      <circle cx="74" cy="34" r="4.5" fill="#E9A5AE" opacity="0.55" />
    </svg>
  )
}

/** Brand marks used by the contact and project links. */
export function GitHubIcon({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
      fill="currentColor"
    >
      <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.87c-3.06.67-3.71-1.48-3.71-1.48-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.68.08-.68 1.11.08 1.7 1.15 1.7 1.15.98 1.7 2.58 1.21 3.2.93.1-.72.39-1.21.71-1.49-2.44-.28-5.01-1.23-5.01-5.48 0-1.21.43-2.2 1.14-2.97-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.05 1.14a10.5 10.5 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.6 1.52.22 2.64.11 2.92.71.77 1.14 1.76 1.14 2.97 0 4.26-2.58 5.2-5.03 5.47.4.35.75 1.03.75 2.07v3.07c0 .3.2.64.76.53a11.02 11.02 0 0 0 7.51-10.44C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  )
}

export function LinkedInIcon({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
      fill="currentColor"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 9.75h5.16V21H2.4V9.75Zm7.7 0h4.94v1.54h.08c.69-1.2 2.37-2.04 4.05-2.04 4.06 0 4.83 2.44 4.83 5.75V21h-5.16v-5.3c0-1.27-.02-2.9-1.9-2.9-1.9 0-2.19 1.38-2.19 2.81V21h-5.15V9.75Z" />
    </svg>
  )
}

/** An envelope, drawn in the same ink-line style as the botanical marks. */
export function MailIcon({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.75" y="5" width="18.5" height="14" rx="2.4" />
      <path d="m3.5 7.2 7.3 5.6a2 2 0 0 0 2.4 0l7.3-5.6" />
    </svg>
  )
}

/** Two offset petals — the copy-email mark. */
export function CopyIcon({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2.2" />
      <path d="M15 5.6A2.2 2.2 0 0 0 12.8 3.4H6.2A2.2 2.2 0 0 0 4 5.6v6.6A2.2 2.2 0 0 0 6.2 14.4" />
    </svg>
  )
}

/** A stem-check that appears once the address is on the clipboard. */
export function CheckIcon({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 12.8 4.7 4.7L19.5 6.9" />
    </svg>
  )
}

/** The little outbound arrow for links leaving the creek. */
export function ExternalIcon({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

/** A hand-cut shoreline that carries the world into the parchment page. */
export function OrganicEdge({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-[76px] w-full', className)}
    >
      <path
        d="M0,66 C150,44 268,84 430,72 C592,60 690,28 858,40 C1010,50 1120,80 1268,64 C1340,56 1400,44 1440,48 L1440,96 L0,96 Z"
        fill="#f0e0bf"
        opacity="0.55"
      />
      <path
        d="M0,78 C170,58 300,94 470,82 C640,70 760,46 930,56 C1100,66 1220,88 1440,70 L1440,96 L0,96 Z"
        fill="#fff8e8"
      />
    </svg>
  )
}
