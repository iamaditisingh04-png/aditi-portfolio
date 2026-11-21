import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'light' | 'ghost' | 'solid' | 'outline'

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

const variantClass: Record<Variant, string> = {
  light: 'btn-bloom btn-bloom--light',
  ghost: 'btn-bloom btn-bloom--ghost',
  solid: 'btn-bloom btn-bloom--solid',
  outline: 'btn-bloom btn-bloom--outline',
}

export function ButtonLink({ href, children, variant = 'light', className, onClick }: ButtonLinkProps) {
  return (
    <a href={href} onClick={onClick} className={cn(variantClass[variant], className)}>
      <span>{children}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="btn-bloom__arrow">
        <path
          d="M4 12h15M13 6l6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
