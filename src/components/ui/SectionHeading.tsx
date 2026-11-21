
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { BotanicalRule } from './Ornaments'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      <span className={cn('eyebrow', align === 'center' && 'justify-center')}>
        {eyebrow}
      </span>

      <h2 className="display-title mt-5 text-[clamp(2rem,4.4vw,3.6rem)]">
        {title}
      </h2>

      <BotanicalRule
        className={cn('mt-6', align === 'center' ? 'mx-auto' : '')}
      />

      {lead && (
        <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-forest/70">
          {lead}
        </p>
      )}
    </div>
  )
}

export function SectionShell({
  id,
  children,
  className,
  tone = 'plain',
}: {
  id: string
  children: ReactNode
  className?: string
  tone?: 'paper' | 'soft' | 'plain'
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden px-5 py-24 sm:px-8 md:py-32',
        tone === 'paper' && 'paper',
        tone === 'soft' && 'paper-soft',
        className,
      )}
    >
      <div className="relative mx-auto w-full max-w-6xl">
        {children}
      </div>
    </section>
  )
}
