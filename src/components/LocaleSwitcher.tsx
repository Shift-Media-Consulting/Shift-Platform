'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (next: 'de' | 'en') => {
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        letterSpacing: '0.16em',
      }}
    >
      {(routing.locales as readonly string[]).map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => switchTo(l as 'de' | 'en')}
            aria-label={`Switch to ${l === 'de' ? 'German' : 'English'}`}
            aria-current={locale === l ? 'true' : undefined}
            style={{
              background: 'none',
              border: 'none',
              cursor: locale === l ? 'default' : 'pointer',
              color: 'var(--cream)',
              opacity: locale === l ? 1 : 0.45,
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.16em',
              padding: 0,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => { if (locale !== l) (e.currentTarget as HTMLButtonElement).style.opacity = '0.75' }}
            onMouseLeave={e => { if (locale !== l) (e.currentTarget as HTMLButtonElement).style.opacity = '0.45' }}
          >
            {l.toUpperCase()}
          </button>
          {i < routing.locales.length - 1 && (
            <span style={{ color: 'var(--cream)', opacity: 0.25 }}>/</span>
          )}
        </span>
      ))}
    </div>
  )
}
