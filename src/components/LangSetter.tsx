'use client'

import { useEffect } from 'react'

/**
 * Sets document.documentElement.lang after hydration.
 * Needed because the root layout cannot read the [locale] param,
 * so we use suppressHydrationWarning on <html> and fix it client-side.
 */
export default function LangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
