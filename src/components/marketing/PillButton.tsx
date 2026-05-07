import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

type Variant = 'cream' | 'ink' | 'teal' | 'outline-cream' | 'outline-ink'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  'cream':         'bg-cream text-teal hover:bg-cream-soft',
  'ink':           'bg-ink text-cream hover:bg-[#1a1a1a]',
  'teal':          'bg-teal text-cream hover:bg-teal-mid',
  'outline-cream': 'bg-transparent text-cream border border-cream/40 hover:bg-cream hover:text-teal',
  'outline-ink':   'bg-transparent text-ink border border-ink/30 hover:bg-ink hover:text-cream',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-6 py-2.5 text-[13px]',
  md: 'px-8 py-3.5 text-[14px]',
  lg: 'px-10 py-4 text-[15px]',
}

type Props = {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  style?: CSSProperties
}

/**
 * Brand pill button — used for every CTA across the site.
 * Includes hover lift, scale, and shadow expansion animations.
 */
export default function PillButton({
  href,
  variant = 'ink',
  size = 'md',
  className = '',
  children,
  style,
}: Props) {
  return (
    <Link
      href={href}
      className={[
        'group inline-flex items-center justify-center gap-2',
        'rounded-full font-bold tracking-[0.2px] whitespace-nowrap',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]',
        'hover:-translate-y-0.5 active:translate-y-0',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      style={{ fontFamily: 'var(--font-head)', ...style }}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        ›
      </span>
    </Link>
  )
}
